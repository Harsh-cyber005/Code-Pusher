# Code Pusher

**Code Pusher** is a Visual Studio Code extension that automatically commits your code changes at regular intervals. Perfect for developers who want to keep their code backed up and synced to remote repositories with minimal effort. This also helps make the Github Contribution Graph look more active.

## Features

- **Automatic Git Commits**: Automatically commit changes to your local repository.
- **Automatic Git Push**: Push changes to your remote repository after finishing the commits.
- **Customizable Interval**: Set the interval (in minutes) for auto-committing.
- **Custom Git Configuration**: Configure remote and branch names for pushing code to your preferred repository and branch.
- **Start/Stop Control**: Easily start and stop the auto-commit using VS Code commands.

## Installation

1. Open **Visual Studio Code**.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for **Code Pusher** in the Extensions Marketplace.
4. Click **Install**.

Alternatively, install it directly via the command line:
```bash
code --install-extension <your-extension-id>
```

## Activation

The extension automatically activates when you run the provided commands or when configured settings are applied.

### Start Auto-Commit

To begin auto-committing, you can run the following command from the **Command Palette** (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS):
- **Start Committing Code**

### Stop Auto-Commit

To stop the auto-commit, run:
- **Stop Committing Code**

## Extension Settings

You can configure the following settings to customize the behavior of the extension:

- **`codePusher.timeGapInMinutes`**: The interval (in minutes) between auto-commits and pushes. Default is `30` minutes.
- **`codePusher.remoteName`**: The name of the remote repository to push changes to. Default is `origin`.
- **`codePusher.branchName`**: The branch name to push the changes to. Default is `master`.

Example of configuring settings in `settings.json`:
```json
{
    "codePusher.timeGapInMinutes": 15,
    "codePusher.remoteName": "origin",
    "codePusher.branchName": "master"
}
```

## How It Works

1. **Auto-Commit**: The extension automatically commits any changes to the local Git repository at the specified interval.
2. **Auto-Push**: After Stopping the Auto-Commit, the extension asks if user wants to push the code to remote repository or not, if yes, then it pushes the changes to the configured remote repository and branch.
3. **Logging**: Every commit and push action is logged for your reference.

## Commands

- **Start Committing Code**: Begins the auto-commit and push process.
- **Stop Committing Code**: Stops the auto-commit and push process.

These commands are available through the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`), or you can add keybindings for them.

## Requirements

- **Git**: Git must be installed and configured on your system.
- **VS Code**: Version 1.96.0 or later is required for compatibility.

## Known Issues

- Make sure the repository is initialized (`git init`) and the remote is configured correctly.

## Release Notes

### 0.0.1

- Initial release with basic auto-commit and push functionality.
- Added configuration for interval, remote, and branch.
- Basic start and stop commands for controlling the commit.

## Contributing

Feel free to contribute by submitting issues or pull requests. Here's how you can contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

## License

This extension is licensed under the MIT License.

## Acknowledgements

Thanks to [simple-git](https://github.com/steveukx/git-js) for simplifying Git operations within Node.js.

---

**Happy Coding! Keep your code safe with Code Pusher.**

---

### Key Sections in This README:
- **Introduction**: A clear explanation of what the extension does.
- **Features**: Highlights the key features of the extension.
- **Installation**: Step-by-step instructions for installing the extension from the marketplace or via the command line.
- **Activation**: Instructions on how to start and stop the auto-commit and push process.
- **Settings**: Describes the configurable options like commit interval, remote name, and branch name.
- **How It Works**: Details about how the extension operates in the background.
- **Commands**: Lists the available commands in the Command Palette to control the extension.
- **Requirements**: Specifies the dependencies and the version requirements.
- **Known Issues**: Mentions some potential limitations or bugs.
- **Release Notes**: Version history and changes made in the extension.
- **Contributing**: Guides for anyone who wants to contribute to the project.
- **License**: Includes licensing information.

This README is structured to be informative and professional, suitable for publishing your extension on the Visual Studio Code Marketplace. Let me know if you need further customizations!