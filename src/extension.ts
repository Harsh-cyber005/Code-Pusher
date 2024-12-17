import * as vscode from 'vscode';
import fs from 'fs';
import * as path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';

let git: SimpleGit;
const LOG_FILE_NAME = 'code-pusher.log';

async function generateCommitMessage(): Promise<string> {
	try {
		const changedFiles = await git.diff(['--name-only']);
        const shortStat = await git.diff(['--shortstat']);

        const files = changedFiles.split('\n').filter(Boolean).slice(0, 3);
        let message = files.map((file) => file.split('/').pop()).join(', ') || 'Code update';

        if (shortStat) {
            const changesSummary = shortStat.replace(/\n/g, '').trim();
            message += ` (${changesSummary})`;
        }

        return message;
	} catch (error) {
		return "Code update";
	}
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkChanges() {
	try {
		const status = await git.status();
		if (status.files.length) {
			return true;
		}
		return false;
	} catch (error) {
		console.error(error);
		return false;
	}
}

async function logCommitStatus(
    logDir: string,
    status: string,
    message: string,
    changedFiles: string
) {
    const logPath = path.join(logDir, LOG_FILE_NAME);
    const now = new Date().toLocaleString();

    const logEntry = `Date/Time: ${now}
Status: ${status}
Commit Message: ${message}
Files Changed:\n${changedFiles || 'No files changed'}
------------------------------------------------\n`;

    fs.appendFileSync(logPath, logEntry, 'utf8');
}

async function logPushStatus(
	logDir: string,
	status: string
) {
	const logPath = path.join(logDir, LOG_FILE_NAME);
	const now = new Date().toLocaleString();

	const logEntry = `Date/Time: ${now}
Status: ${status}
------------------------------------------------\n`;

	fs.appendFileSync(logPath, logEntry, 'utf8');
}

async function pushCode(remote: string, branch: string, logDir: string) {
	try {
		await git.push(remote, branch);
		logPushStatus(logDir, 'Success');
		vscode.window.showInformationMessage('Code pushed successfully');
	} catch (error) {
		logPushStatus(logDir, 'Failed');
		vscode.window.showErrorMessage(`Failed to push code: ${error}`);
		vscode.window.showInformationMessage('Current remote and branch are: ' + remote + ' ' + branch, 'please change them in settings and try again');
		console.error(error);
	}
}

async function commitCode(timeGapInMinutes: number, logDir: string) {
	try {
		const commitMessage = await generateCommitMessage();
		const hasChanges = await checkChanges();
		const changedFiles = await git.diff(['--name-only']);
		if (!hasChanges) {
			vscode.window.showInformationMessage(`No changes to commit right now, will check again after ${timeGapInMinutes} ${timeGapInMinutes === 1?"minute":"minutes"}`);
			return;
		}
		await git.add('.');
		await git.commit(commitMessage);
		// await git.push(remote, branch);
		logCommitStatus(logDir, 'Success', commitMessage, changedFiles);
		vscode.window.showInformationMessage(`Code committed successfully with message: ${commitMessage}`);
	} catch (error) {
		logCommitStatus(logDir, 'Failed', 'Failed to commit code', '');
		vscode.window.showErrorMessage(`Failed to commit code: ${error}`);
		console.error(error);
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "code-pusher" is now active!');
	let interval: NodeJS.Timeout;
	let timeGapInMinutes: number = 0.2;
	const disposable = vscode.commands.registerCommand('codePusher.startCommittingCode', async () => {
		vscode.window.showInformationMessage("Checking if there is a git repository present in the root directory or not....");
		await sleep(2000);
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage("No workspace is opened");
			return;
		}
		const rootPath = workspaceFolders[0].uri.fsPath;
		const gitPath = `${rootPath}/.git`;
		const logDir = path.join(process.env.HOME || process.env.USERPROFILE || process.env.PWD || '', '.code-pusher');
		if (!fs.existsSync(gitPath)) {
			vscode.window.showErrorMessage("No git repository found in the root directory");
			return;
		}
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}
		vscode.window.showInformationMessage('starting to commit ...');
		await sleep(1000);
		vscode.window.showInformationMessage(`saving logs to ${logDir}`);
		git = simpleGit(rootPath);
		timeGapInMinutes = vscode.workspace.getConfiguration().get<number>('codePusher.timeGapInMinutes') || 30;
		interval = setInterval(async () => {
			await commitCode(timeGapInMinutes, logDir);
		}, timeGapInMinutes * 60 * 1000);
	});
	context.subscriptions.push(disposable);

	const stopDisposable = vscode.commands.registerCommand('codePusher.stopCommittingCode', async () => {
		// ask if they want to push the code before stopping
		const push = await vscode.window.showInputBox({
			placeHolder: 'Do you want to push the code before stopping? (yes/no)'
		});
		if (push?.toLowerCase() === 'yes' || push?.toLowerCase() === 'y') {
			const remote = vscode.workspace.getConfiguration().get<string>('codePusher.remoteName') || 'origin';
			if (!remote) {
				vscode.window.showErrorMessage("Please provide the upstream name");
				return;
			}
			const branch = vscode.workspace.getConfiguration().get<string>('codePusher.branchName') || 'master';
			if (!branch) {
				vscode.window.showErrorMessage("Please provide the branch name");
				return;
			}
			await pushCode(remote, branch, '');
			await sleep(2000);
		}
		clearInterval(interval);
		vscode.window.showInformationMessage('Code pushing stopped!');
	});
	context.subscriptions.push(stopDisposable);
}

export function deactivate() {
	vscode.window.showInformationMessage('Auto Commit & Push Logger Deactivated!');
}
