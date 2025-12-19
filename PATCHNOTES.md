## 1.0 (2025-08-16)
- Release



## 1.1 (2025-08-19)
-> Lunaudia:
- Lunaudio is now called Lunaudia

-> Player:
- Added Shuffle (randomly goes through the tracks)
- Added Repeat (repeats the same track infinitely)
- Music no longer automatically starts playing when opening

-> Info:
- Added info button in the top right
- Info scene shows info and current version
- and has buttons for GitHub, Discord and ko-fi

-> Changes:
- Added font (Open Sans Bold)
- Prettier progress bar



## 1.2 (2025-11-19)
-> Automatic Metadata:
- Lunaudia can now extract metadata from most audio files! (if they have it)
- This is automatic, no need to do anything 
- Song title and author are used, if not available, it'll still use the file name (as before)
- Single/album cover is used and displayed if available! if not, it resorts to the image in folder (as before)
- A small icon is displayed if metadata is used
- This was difficult to add, and will be expanded in the future 

-> Paths:
- Lunaudia can now get audio files from multiple sources
- Besides the audio folder, added Music as a default
- Added a button (left side) to add new paths, with a custom input system (CTRL+V works, Enter to confirm)
- All subfolders get checked now, including of the two default paths 
- More customization will come

-> Volume Selection:
- Added Volume Selection to the right side
- Goes from 0% to 100% in 11 steps
- Previously, volume was always at 100%
- This is saved

-> New Icon Design:
- Added new stylized images for: play, pause, previous, next, shuffle, repeat, help
- Added images for metadata info and new path/folder
- These images replace the previous texts

-> Other:
- Lunaudia is now available on Linux!
- It can now run when there is no audio folder or when it's empty
- Album cover can now be clicked to enlargen it from 40% to 100%, and clicked again to go back to normal size
- Updated WGGJ from v1.3 to v1.5.1



## 1.3 (2025-12-19)
-> Playlists:
- Added the foundations of a library: Playlists!
- Previously, you only had "one playlist" (with multiple paths, audio folder and Music folder by default), that is now the default playlist ("Local")
- The button to add paths now leads to your Playlists instead
- Here, you can see your Playlists (scrollable) and add as many as you want (no gurantee for performance at extreme amounts)
- Click the button next to a cover to set it for the current playlist
- You can select a playlist (to play it), edit its name, add a path or manage its paths
- Manage Paths: change the path, remove it, or toggle if it scans subdirs (enabled by default)
- This will be expanded in the future

-> Other:
- Added new images for: edit path, edit, delete, subdirs
- Improved song UI loading
- Player: Running is no longer shown, only Paused
- Player: Adjusted size of playlists, shuffle and repeat images