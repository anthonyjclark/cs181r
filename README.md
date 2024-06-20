# CS 181R: Mobile Robotics

The goal is to create a course that is interactive and engaging.

## Development

The course book (this website) is built using [Quarto](https://quarto.org/). Here are the important bits:

- Non-Quarto files
  - `_arduino/`: code for the course robot
  - `_interactives/`: libraries for "interactives"
  - `_static/`: static web pages not process by Quarto
- Quarto files
  - `_quarto.yml`: Quarto configuration file
  - `index.qmd`: course home page
  - `book/`: book chapters written in Quarto's qmd format
  - `pages/`: website pages written in Quarto's qmd format (schedule)

### Dependencies

- [Quarto](https://quarto.org/)
- [quarto-vscode](https://marketplace.visualstudio.com/items?itemName=quarto.quarto)
- [Python and Jupyter](https://quarto.org/docs/computations/python.html#installation)
- Additional dependencies listed in `_interactives/README.md`

### Book Chapters

Create and edit files in the `book` directory. Take a look at the `book/_template.qmd` file to see how to structure a chapter.

Use `quarto preview CHAPTER` to preview a chapter. For examples, `quarto preview book/01-IntroductionAndSafety.qmd`.

### Interactives

I like Bret Victor's take on interactive diagrams. Read is article [Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/) for more information.

Read the `_interactives/README.md` file for more information on creating interactives.

## TODO

- add goat counter to base template (probably no)
- add hover/link for definitions and acronyms (glossary: see below)

### File

*Making* Robots

- follow irom lab structure but with code
	+ euler, verlet, rk4, featherstone algorithms
	+ start in one dimension, then add two, then go to 3
	+ simulate with P, then PD, then...

matlab academy (assign and get notified?)

- [Cetus X FPV Kit – BETAFPV Hobby](https://betafpv.com/products/cetus-x-fpv-kit)
- https://news.stanford.edu/2019/01/16/stanfords-robotics-legacy/
- [Home](https://shop.evilmadscientist.com/)
- [intro-to-robotics | IRoM-Lab](https://irom-lab.princeton.edu/intro-to-robotics/)
- https://plantraco.com/
- https://www.goodreads.com/book/show/257015.Getting_Started_in_Electronics
- https://www.oreilly.com/library/view/electronics-all-in-one-for/9781119822110/
- https://shop.evilmadscientist.com/productsmenu/652
- https://old.reddit.com/r/robotics/comments/110ig7p/tiny_wheeled_robot/
- https://www.reddit.com/r/ControlTheory/wiki/resources/
- https://stanfordasl.github.io/aa274a/
- https://www.mathworks.com/company/newsletters/articles/teaching-avionics-and-control-with-a-minidrone-competition.html?s_v1=47577&elqem=3952350_EM_NA_DIR_23-03_MOE-EDU&elqTrackId=4d8b6b74423a4600a323abb742ecd758&elq=8eec7f7c9d644918b2c70cf7dbc417cf&elqaid=47577&elqat=1&elqCampaignId=17686
- [books - PrintedCircuitBoard](https://old.reddit.com/r/PrintedCircuitBoard/wiki/books#wiki_digital_design)
	+ books
[Advanced Robot Dynamics](https://www.andrew.cmu.edu/user/amj1/book/)
[SMARS Mini](https://www.kevsrobots.com/blog/smars-mini.html)
[kevinmcaleer/PicoSMARS](https://github.com/kevinmcaleer/picosmars)

- https://wordpress.rose-hulman.edu/berry123/wp-content/uploads/sites/153/2021/10/ECE425_SyllabusW2021.pdf

https://pikuma.com/blog/verlet-integration-2d-cloth-physics-simulation


[Thunder Lightning Animation with Delay](http://www.trainelectronics.com/Animation-thunder-lightning/delay.htm)
[Thunder Lightning Animation](http://www.trainelectronics.com/Animation-thunder-lightning/)
[Wokwi - Online Arduino and ESP32 Simulator](https://wokwi.com/)
[Circuit Simulator Applet](https://www.falstad.com/circuit/)
[p5.vscode - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode)
[p5.js Web Editor | VerletSticksPinned](https://editor.p5js.org/gustavocp/sketches/z-6Ap6xla)



State-space
Robust control
Backstepping
Sliding mode
Feedback linearization
Flatness-based
Model predictive control
Adaptive control


1. Play the whole game
2. Make the game worth playing
3. Work on the hard parts

https://www.prairielearn.org

https://spectrum.ieee.org/special-reports/chip-hall-of-fame/

https://github.com/ros-planning/navigation2/tree/main/nav2_mppi_controller



## Automatic Glossary

- [Glossaries for Markdown and Quarto Documents • glossary](https://debruine.github.io/glossary/)
- [glossary functionality for R-markdown documents](https://github.com/yonicd/glossaries)
- [Custom syntax extension](https://gist.github.com/tarleb/a0646da1834318d4f71a780edaf9f870)
- [glossar.yml](https://github.com/pro4bib/handbuch-it-in-bibliotheken/blob/main/glossar.yml)
- [glossary.lua](https://github.com/pro4bib/handbuch-it-in-bibliotheken/blob/main/templates/glossary.lua)
- [glossary: Quarto extension to insert a glossary into a document](https://github.com/andrewpbray/glossary)
- Automatically link/hover/tooltip definitions
- Automatically give full word for acronyms
- Automatically color and match variables
- two-way glossary/index (links back to references)
- plural and singular forms
- verb forms
- first time in chapter or section?
- filter to search for glossary terms and provide a link and hover text [definitions lists](https://pandoc.org/MANUAL.html#definition-lists)
- [Porter Stemming Algorithm – Basic Intro | Vijini Mallawaarachchi](https://vijinimallawaarachchi.com/2017/05/09/porter-stemming-algorithm/)

## Teaching Notes

- I want you to feel like you are the inventor originator
- What I cannot create, I do not understand
- I will have mistakes in my first time teaching this
- Let me know if something feels off
- I really like how Stephen Boyd breaks down the components of a matrix and matrix multiplication.
- Socratic "what if" style teaching (in the style of history applied to cs)
- [THINKING METHOD GUIDEBOOK](https://www.languagetransfer.org/guidebook)
- If using wasm: can distribute closed source using wasm (ie solutions)
- Use VSCode [Temporary Profile](https://code.visualstudio.com/docs/editor/profiles#_what-is-a-temporary-profile)
- Astrom and Murray feedback systems (state space notation)
- Messner and Tilbury control tutorials for matlab and Simulink
- ETH Zurich modeling and control of a ball-bot
- Similar code/diff to [3. Raw input and output | Build Your Own Text Editor](https://viewsourcecode.org/snaptoken/kilo/03.rawInputAndOutput.html#reposition-the-cursor)

## Quarto Features

- quarto code annotations
- quarto cross-reference hover (custom for definitions?)
- authoring
  - references
  - lists (figures, tables, listings)
  - callouts
  - theorems and proofs
  - equations
  - sections
- layout
- themes
  - change theme
  - fontsize, linestretch
  - fontcolor, linkcolor
  - light and dark modes

## Ideas

- No copying-pasting code from website (provide code as... file? repo?)
- Observable examples: [Player / oscar6echo](https://observablehq.com/@oscar6echo/player)
- Interactives ideas: [Interactive Visualizations](https://dash.plotly.com/julia/interactive-graphing)
- Go into motor dynamics: [Build a Simple Electric Motor](https://www.youtube.com/watch?v=WI0pGk0MMhg)
- [GPS](https://ciechanow.ski/gps/)
- use revealjs for code slides? (highlight, fade, diff, etc.) using iframe (format-links: [reveal])
- [lecture notes: MPC, nonlinear, dynamical systems](https://markcannon.github.io/teaching/)
- [Team Meetings](https://www.cs.cmu.edu/~rapidproto/handouts/workingingroups.html)
- [Meeting Minutes](https://www.cs.cmu.edu/~rapidproto/handouts/meetingnotes.html)
- create lectures cover mecanum wheels (or Ackermann) and quadrotors, assignments cover diff drive?
- use jupyter.pomona.edu with julia?
- constrained least squares for smooth paths?
- [p5() constructor](https://p5js.org/reference/#/p5/p5)
- Develop widgets separately from chapters: User either script tags or iframes
- for each chapter: define macros in color at top (maybe use m4?)
  - [Colorful Equations with MathJax](http://adereth.github.io/blog/2013/11/29/colorful-equations/)
- LQR (Indy Autonomous Challenge)
- A* (f1tenth, Indy Autonomous Challenge)
- mpc (f1tenth)
- [colorblind pallets](https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40)
- [color mode for plots](https://observablehq.com/framework/themes#auto-mode)
- prescript: `$\newcommand{\Map}[2]{{\vphantom{{#2}}}^{#1}{#2}}$speed`
- visualize least squares (two objectives (lecture 8 lds, boyd, 14m) adjust mu)
- get board name `❯ cat packages/esp32/hardware/esp32/2.0.16/boards.txt | rg -i xiao` (XIAO_ESP32S3.name=XIAO_ESP32S3)
- [Rotary Encoder: Immediately Tame your Noisy Encoder!](https://www.best-microcontroller-projects.com/rotary-encoder.html)

Bluetooth
- [Status](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md)
- [Guide](https://randomnerdtutorials.com/esp32-bluetooth-low-energy-ble-arduino-ide/)
- [OTA](https://learn.sparkfun.com/tutorials/esp32-ota-updates-over-ble-from-a-react-web-application/all)
- [NimBLE](https://github.com/h2zero/NimBLE-Arduino)
- [Types](https://www.npmjs.com/package/@types/web-bluetooth)
- [WebBluetooth](https://googlechrome.github.io/samples/web-bluetooth/)
- [Mobile App](https://www.nordicsemi.com/Products/Development-tools/nRF-Connect-for-mobile)
- [Spec](https://www.bluetooth.com/specifications/specs/)
- [Webble for iOS](https://www.greenparksoftware.co.uk/projects/webble/1.2.3)
- [Bluefy for iOS](https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055)
- [Speed](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy#Technical_details)



## Resources

- [MTH 141 Linear Algebra](https://math.ryerson.ca/~danziger/professor/MTH141/Handouts/index.html)
- [Embedded: News & Resources For The Electronics Community](https://www.embedded.com/)
- [Components101 - Electronic Components Pinouts, Details & Datasheets](https://components101.com/)
- [Engineering Statics](https://engineeringstatics.org/root-1-2.html)
- [Introduction To Autonomous Robots](https://introduction-to-autonomous-robots.github.io/)
- [Model Predictive Control: Theory, Computation, and Design](https://sites.engineering.ucsb.edu/~jbraw/mpc/)
- [Camera NanoTank: 9 Steps (with Pictures)](https://www.instructables.com/Camera-NanoTank/)
- [ESP32-CAM Remote Controlled Car Robot Web Server](https://randomnerdtutorials.com/esp32-cam-car-robot-web-server/)
- [Saste Jugaad - YouTube](https://www.youtube.com/@SasteJugaad/videos)
- [Shubham_bhatt's](https://www.instructables.com/member/shubham_bhatt/instructables/)
- [OpenBot](https://www.openbot.org/home)
- [espressif/esp32-camera](https://github.com/espressif/esp32-camera)
- [DiffBot Differential Drive Mobile Robot](https://ros-mobile-robots.com/)
- [SymForce](https://symforce.org/) code generation
- [pydy/pydy: Multibody dynamics tool kit.](https://github.com/pydy/pydy)

## Authors

- Ella Zhu
- Jack Chin
- Anthony J. Clark
