# Motion_and_Emotion
uOttawa - Comp. Sci. Honours Project

Supervised by: Dr. Wonsook Lee

Contributors: Talaal Mirza, Michael Sault

---

## TODO

### From meeting notes
#### 2019 September 20
- [x] User animation
  - Allow user to create paths for images to follow using mouse input
- [ ] Animation/state saving
  - Allow user to save travel paths as well as image configuration

### Overall
- [x] Create page
- [ ] Create more tasks
  - [ ] Create Trello board?
- [x] Implement moving images
- [x] Implement scaling images
- [x] Implement changing images
- [x] Implement rotating images
- [x] Map movement, scaling and rotations to key presses
- [x] Verify installation/build process
  - Verified that p5.js needs a "live" server for accessing the images; Updated README accordingly
  - [ ] Investigate standalone options
  - From what I understand we will be providing this tool for WYSISWYG use so we should maybe look into creating a packaged solution that doesn't require the use of running a server. This might require moving to Processing java or Processing.py
- [ ] Update README accordingly
- [ ] Investigate moving to a package manager?
- [ ] Document the code
- [ ] Organize the code better (less global vars, better scoping)
- [ ] Develop proper task organization
  - We shouldn't be just pushing to master. I propose that we create individual tasks; For each task that gets worked on individual branches; For each branch that has its task completed we create Pull requests and have the other collaborator review them. This way we can better organize the changes that get pushed through
  - [x] Added branch rule to master. Changes now require pull requests.

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