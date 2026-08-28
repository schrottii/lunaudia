## v1.0 (2025-08-16)
- Release



## v1.1 (2025-08-19)
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



## v1.2 (2025-11-19)
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



## v1.3 (2025-12-19)
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



## v1.4 (2026-04-25)
-> Discord RPC:
- Added support for Discord RPC
- When you have Discord (& are not offline & don't have sharing activities disabled), Lunaudia will display with the current playing song and artist

-> Supported file formats: 
- Added support for a lot more formats:
- Audio: aac, m4r, opus, webm
- Image: jpeg, jpe, jfif, exif, avif, gif, agif, bmp, dib, rle, tga
- Already supported previously: 
- Audio: mp3, flac, m4a, ogg, wav
- Image: png, jpg

-> Internal:
- Reworked node-related code, strictly seperating it from the front-end, which leads to 
- Improved security
- Code improvements
- File tree rework

-> Design:
- Duration is now displayed in the 0:00 format rather than 0s
- Replaced text at top with wide logo
- Added colored bar to the top

-> Volume Selection:
- Changed from 11 steps to 21 (0%, 5%, 10%,... from 0%, 10%, 20%,...)
- Can now be held

-> Other:
- Playlists: added button to delete playlist
- Changed default size from 1920x960 to 1280x720
- App title updates to the current playing song
- When paused, it returns to "Lunaudia" for privacy reasons
- Fixed being able to change the cover art's animation before it is finished



## v1.4.1 (2026-04-26)
-> Mono Audio System:
- Added, this allows you to change how the audio is played
- Changed via buttons in the top right
- Only applied when changing song
- Stereo: same as before
- Left: only played in left ear
- Right: only played in right ear
- Dual: like stereo but "more full"

-> Other:
- Lunaudia is now available on Linux arm64!

-> Bug fixes:
- Fixed playlist loading issues
- Fixed movement of the new remove playlist button



## v1.5 (2026-08-28)
-> Playlist picker:
- Added to the player scene, left side
- One button for each song, like a tracklist, click to quickly jump to it
- Up to 250 buttons/songs listed
- The selected/current song is highlighted (no transparency)
- Scrollable (there is some extra space on the right side to scroll without selecting)

-> Playlists:
- Added button (and support) for setting the cover from a path, saved after closing
- Improved loading Local playlist on startup
- Fixed duplication of Local playlist

-> Mono Audio System:
- Is now treated as a proper setting, saved after closing
- Clicking one will change the color to purple, indicate it will change to that on the next song

-> Prompt inputs:
- Improved handling of apostrophes
- Now cancelled when changing scene

-> Design:
- Playlists, paths: changed color and added transparency for rows
- Playlist, paths: changed color of button texts
- Moved back buttons to the top right and made them wider
- Changed button image

-> Design (Player Scene):
- Volume Selection: added pink gradient (higher = more pink)
- Added background for the info (left side)
- Moved info further left
- Moved shuffle and repeat to the right (next to the volume selection)
- Moved playlist, help and Mono Audio System buttons to the top

-> Design (Info Scene):
- Added button to open patch notes
- Added buttons to open the new license, ToS & privacy policy files (bottom left)
- Moved text and buttons higher
- Moved back button

-> Documentation:
- Massively expanded the README.md:
- Download / Install step-by-step guide
- Info on how to use it, including ways to play audio, playlist buttons, and more
- Supported file formats list
- Building info (mostly for myself)

-> Other:
- You can now use "Open with" or drag a song onto the .exe to open it with Lunaudia (only one at a time, probably Windows-only)
- Added LICENSE.md (Balnoom license with some Lunaudia-specific bits), TOS.md & PRIVACY.md 
- They can be accessed from the Info scene (bottom left), the PATCHNOTES.md as well
- Updated WGGJ from v1.5.1 to v1.7 and converted many objects to attachments