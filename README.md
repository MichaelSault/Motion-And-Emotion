# Motion and Emotion
uOttawa - Comp. Sci. Honours Project (Continued Consulting Work)

Supervised by: Dr. Wonsook Lee

Contributors: Talaal Mirza, Michael Sault

---
## TODO (CONSULTING WORK)

### Finalize Project and Work Out Bugs
#### 2020 February 7 - 2020 March
- [x] User Interface to Load New Images (**IMPORTANT**)
  - Users can move images into the "media" folder to be selected
  - Without PHP users must manually add items to the list
  - Offer to add more commonly used images to list by defult
- [ ] Change video type (**OPTIONAL**)
  - If possible within the WebRTC library
- [x] Fix video output size (**IMPORTANT**)
  - Output is far to big on small screens.
  - Also managed to fix the issue with animating along the path
- [x] Fix bug where image won't resize. (**IMPORTAT**)
  - May have to remove/limit mutiple images or keyframe implementation
- [x] Generate User Manuals/Videos (**OPTIONAL**)
  - Might have to meet with the profs one more time
  - Completed a tutorial page demonstarting the basics of recording a path


---
~~## TODO (HONOURS PROJECT)

### From meeting notes
#### 2019 September 20 - 2019 December 31
- [x] User animation
  - Allow user to create paths for images to follow using mouse input
- [ ] Animation/state saving
  - Allow user to save travel paths as well as image configuration

### Overall
- [x] Create page
- [x] Create more tasks
  - ~~[ ] Create Trello board?~~ It's just me now, no need.
- [x] Implement moving images
- [x] Implement scaling images
- [x] Implement changing images
- [x] Implement rotating images
- [x] Map movement, scaling and rotations to key presses
- [x] Verify installation/build process
  - Verified that p5.js needs a "live" server for accessing the images; Updated README accordingly
  - [ ] ~~Investigate standalone options~~
  - ~~From what I understand we will be providing this tool for WYSISWYG use so we should maybe look into creating a packaged solution that doesn't require the use of running a server. This might require moving to Processing java or Processing.py~~ Moving to Processing java/python too time consuming.
- [ ] Update README accordingly
- [ ] Investigate moving to a package manager?
- [ ] Document the code
- [ ] Organize the code better (less global vars, better scoping)
- [x] ~~Develop proper task organization~~
  - ~~We shouldn't be just pushing to master. I propose that we create individual tasks; For each task that gets worked on individual branches; For each branch that has its task completed we create Pull requests and have the other collaborator review them. This way we can better organize the changes that get pushed through~~ We were, but again it's just me here and if it's not ready, I won't push it.
  - [x] ~~Added branch rule to master. Changes now require pull requests.~~ Left over from before.

---
## Building and Running this project
- Clone the repo and follow the instructions in side the [`/lib/README.md`](/lib/README.md)
- In order to run this code you will need a live server
  - One option is to use visual studio code to open the code and use the extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
  - Another option is to use browser apps/extensions to run a local server
    - Chrome: [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/)
  - Some more involved options may require python or php. How-to's for those are available on:
    - [Mozilla Developer Network: How do you set up a local testing server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)
    - [(GitHub) p5.js > Wiki: Local server](https://github.com/processing/p5.js/wiki/Local-server)
