



- Automatically link/hover/tooltip definitions
- Automatically give full word for acronyms
- Automatically color and match variables
- two-way glossary/index (links back to references)


- Similar code/diff to https://viewsourcecode.org/snaptoken/kilo/03.rawInputAndOutput.html#reposition-the-cursor

quarto code annotations
quarto cross-reference hover (custom for definitions?)

Filter to search for glossary terms and provide a link and hover text.
- [Pandoc - Pandoc User’s Guide](https://pandoc.org/MANUAL.html#definition-lists)


[Player / oscar6echo | Observable](https://observablehq.com/@oscar6echo/player)


Example (might need R installed)
- [Glossaries for Markdown and Quarto Documents • glossary](https://debruine.github.io/glossary/)
- [yonicd/glossaries: glossary functionality for Rmarkdown documents](https://github.com/yonicd/glossaries)
- [Custom syntax extension](https://gist.github.com/tarleb/a0646da1834318d4f71a780edaf9f870)
- this one seems pretty close
	+ [handbuch-it-in-bibliotheken/glossar.yml at main · pro4bib/handbuch-it-in-bibliotheken](https://github.com/pro4bib/handbuch-it-in-bibliotheken/blob/main/glossar.yml)
	+ [handbuch-it-in-bibliotheken/templates/glossary.lua at main · pro4bib/handbuch-it-in-bibliotheken](https://github.com/pro4bib/handbuch-it-in-bibliotheken/blob/main/templates/glossary.lua)
- might be relevant: [andrewpbray/glossary: Quarto extension to insert a glossary into a document](https://github.com/andrewpbray/glossary)



https://github.com/quarto-dev/quarto-cli/issues/1697#issuecomment-1207203774
@SHogenboom those are great ideas, but I have some caveats about auto-linking (based on a lot of experience implementing glossary links in educational materials):

- The auto-linking of terms should let you add variants so you can link the same definition to different verb forms or plural and singular versions.
- It would be good to have a manual option in addition to auto. When I write educational materials, I might want to link the term "argument" the first few times I use it, or the first time each chapter, but probably not 10 times in 1 paragraph.
- Auto-linking probably only makes sense in main text, not in tables or figure captions or code chunks. Working out the scope of where it is and isn't appropriate to auto-link might be more work than a manual demarcation option, like only link words marked by {{:term:}}.

P.S. I'm glad you think the glossary package will be helpful! I'd planned on sending it to CRAN after a little more development to make it easier to set up your own glossary website (it's currently pretty specialised for our PsyTeachR purposes), but I'm putting that plan on hold now until I find out what quarto is doing with built-in glossaries. I'd definitely add a way to easily make _glossary.yml files to it, if that's the direction quarto goes.

Interactives ideas:
- https://dash.plotly.com/julia/interactive-graphing

## Teaching Notes

- I really like how Stephen Boyd breaks down the components of a matrix and matrix multiplication.
- https://introduction-to-autonomous-robots.github.io/resources.html
- Socratic "what if" style teaching (in the style of history applied to cs)
https://www.languagetransfer.org/guidebook
can distribute closed source using wasm (ie solutions)
https://code.visualstudio.com/docs/editor/profiles#_what-is-a-temporary-profile (for videos)


## Ideas

- Go into motor dynamics
  - [Build a Simple Electric Motor | Science Project - YouTube](https://www.youtube.com/watch?v=WI0pGk0MMhg)
- [GPS – Bartosz Ciechanowski](https://ciechanow.ski/gps/)
- use revealjs for code slides? (highlight, fade, diff, etc.) using iframe
	- format-links: [reveal]
https://markcannon.github.io/teaching/
- nonlinear systems
- MPC
- dynamical systems
[Team Meetings](https://www.cs.cmu.edu/~rapidproto/handouts/workingingroups.html)

[Meeting Minutes](https://www.cs.cmu.edu/~rapidproto/handouts/meetingnotes.html)

## Resources
[MTH 141 Linear Algebra: Peter Danziger's Sections Handouts](https://math.ryerson.ca/~danziger/professor/MTH141/Handouts/index.html)
- [Embedded: News & Resources For The Electronics Community](https://www.embedded.com/)
- [Components101 - Electronic Components Pinouts, Details & Datasheets](https://components101.com/)
- https://engineeringstatics.org/Chapter_01.html
- https://f1tenth.org/learn.html
- [Introduction To Autonomous Robots](https://introduction-to-autonomous-robots.github.io/)
- books...
[Model Predictive Control: Theory, Computation, and Design](https://sites.engineering.ucsb.edu/~jbraw/mpc/)
[Camera NanoTank : 9 Steps (with Pictures) - Instructables](https://www.instructables.com/Camera-NanoTank/)
[ESP32-CAM Remote Controlled Car Robot Web Server | Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-cam-car-robot-web-server/)
[Saste Jugaad - YouTube](https://www.youtube.com/@SasteJugaad/videos)
[Shubham_bhatt's Projects - Instructables](https://www.instructables.com/member/shubham_bhatt/instructables/)
[OpenBot](https://www.openbot.org/home)
[espressif/esp32-camera](https://github.com/espressif/esp32-camera)
[DiffBot Differential Drive Mobile Robot](https://ros-mobile-robots.com/)

lqr (indyautonomouschallenge)
Astar (f1tenth, indyautonomouschallenge)
mpc (f1tenth)

[SymForce](https://symforce.org/)
- code generation

[pydy/pydy: Multibody dynamics tool kit.](https://github.com/pydy/pydy)


vscode setup
- no profile create video




Lecture QMD format:
- hypothesis link
- goals
- terminology
- video
- interactive
- wrap-up
