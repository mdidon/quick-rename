# Quick Rename

A CLI for quickly renaming bulk files

<br />

## Binaries

[Download for macOS](https://github.com/mdidon/quick-rename/releases/download/1.0.0/quick-rename-macos)

[Download for Windows](https://github.com/mdidon/quick-rename/releases/download/1.0.0/quick-rename-win.exe)

*Please note you will need to first run `chmod +x quick-rename-macos` on macOS to set as executable*

<br />

## CLI Usage

`--location` The target folder to look for files in

`--remove` The text from the file name to remove

`--replace` (Optional) The text to replace the removed text with

`--write` (Optional) The folder path to write the renamed files to (default: Desktop)

### Example

`./quick-rename --location <path> --remove "Text to remove" --replace "Text to replace" --write <path>`
