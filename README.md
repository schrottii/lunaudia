# Lunaudia 
Version: 1.5 (2026-08-28) 
(c) Schrottii / Balnoom 2025 - 2026
A relatively simple music player I have made.

Code is open to read but not to edit. For future updates many more features are planned. View the PATCHNOTES.md for a complete list of changes.

Lunaudia uses node and Electron. 

[View all patch notes here](PATCHNOTES.md)

## Legal info
- [License (Balnoom license + Lunaudia specific)](LICENSE.md)
- [Terms of Service (generic)](TOS.md)
- [Privacy policy](PRIVACY.md)

# Download / Install
1. Download the version that fits your OS from the GitHub releases. 
https://github.com/schrottii/lunaudia/releases/
- Windows: Lunaudia_Windows.zip 
- Linux: lunaudia-linux-x64.tar.gz or lunaudia-linux-arm64.tar.gz 

2. Extract it (winRAR, 7zip, etc.)
3. There should be a folder (lunaudia-win32-x64 or similar), with an .exe inside. There may also be an .exe outside. That's the file to run the program.'

Support for macOS, emulation or Wine is not guaranteed.

# How to use
## How to play songs
There are three methods:
1. The program's own audio folder: any songs inside this are put into the "Local" playlist automatically
2. Set a path for a playlist. All songs in that path are a part of the playlist.
3. Use "open with" or drag the song on the .exe (Windows only?)

## Playback manipulation
- Previous song, pause/resume, next song (self explanatory)
- Loop: When turned on (glowing), the current song is repeated forever.
- Shuffle: True shuffle! When turned on, the next song will be a random one - repeats possible.
- Volume: on the right side. 0%, 5%, 10%, ..., 95%, 100%
- Top right: the Mono Audio System. Lets you choose between stereo, left, right and dual. Applies when the song changes.
- Clicking the cover art makes it bigger

## Playlists
- Select: chooses this as the current playlist.
- Change name: set a new name for the playlist.
- Add path: insert a new path name, that will be added to the playlist's paths
- x paths: click to see a list of this playlist's path (then editable)
- Remove: deletes the playlist :(
- Image from path: insert a path name, that will become the playlist's cover art!

## Paths
- Change: change this path name (where it leads to)
- Remove: deletes this path
- Subdirs: When enabled, not only the songs in this directory are loaded, but also in all subdirectories - recursion!

# Notes
## Supported file formats
### Audio
- mp3, flac, m4a, ogg, wav
- aac, m4r, opus, webm

### Images
- png, jpg
- jpeg, jpe, jfif, exif, avif, gif, agif, bmp, dib, rle, tga

## Building
| Command              | Output location
|:--------------------:|:-------
| start                | -
| package              | ./out/lunaudia-win32-x64
| package-linux-x64    | ./out/lunaudia-linux-x64
| package-linux-arm64  | ./out/lunaudia-linux-arm64