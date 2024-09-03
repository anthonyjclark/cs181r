import { video_quiz } from '../lib/main';

// This function will be called when the page loads
function onLoad() {

  const myVideoId = 'R81egpgDzbY'; // Replace this with the desired video ID

  // Initialize the video quiz with the specified video ID
  const myVideoQuiz = new video_quiz(myVideoId);
  
  (window as any).submitAnswer = myVideoQuiz.submitAnswer.bind(myVideoQuiz);
  (window as any).submitWrittenResponse = myVideoQuiz.submitWrittenResponse.bind(myVideoQuiz);
  (window as any).continueVideo = myVideoQuiz.continueVideo.bind(myVideoQuiz);

  // Load quizzes (for demonstration, you can hard-code some input here or fetch it dynamically)
  const input = `
  Q: What color is the sky? (2)
  ( ) Red
  (x) Blue
  ( ) Green
  ( ) Yellow
  
  Q: Select all the fruits: (5)
  (x) Apple
  (x) Banana
  ( ) Carrot
  ( ) Potato

  Q: What is the meaning of life: (7)
  |__|

  E: Quizzes are fun (10)
  `;
  
  const quizTimes = myVideoQuiz.parseQuestions(input);
  console.log(quizTimes);

let currentQuizIndex = 0;

function checkQuizTimes() {
  const currentTime = myVideoQuiz.getCurrentTime();

    if (currentQuizIndex < quizTimes.length && Math.floor(currentTime) >= quizTimes[currentQuizIndex].time) {
        myVideoQuiz.pauseVideo(); // Pause the video
        myVideoQuiz.showPopup(quizTimes[currentQuizIndex]);
        currentQuizIndex++;
    }
}

// Set up an interval to check the quiz times
const checkInterval = setInterval(() => {
    checkQuizTimes();
}, 1000); // Check every second

}

// Call the onLoad function when the window loads
window.onload = onLoad;



const shadamaEvents: [string, number][] = [
  [`Our first example of Shadama is a simple physics simulation of particles and gravity.`, 0],
    [`As in the LOGO programming language, we refer to mobile objects as turtles. Here, we
      declare a breed of turtle such that each turtle will have properties
      "x", "y", "r", "g", "b" and "a".`, 5],
    [`A method is defined with the keyword "def". Methods are executed on
each turtle in a breed. Here, we've defined the "setColor" method to use the turtle's x and y
coordinates to assign them a red and green value.`, 15],
    [`In the static function "setup", we set the number of
turtles in the breed to be 3,000 and then set all turtle's x and y coordinates to be a
random number between 0 and 512. We run "setup" by hitting Cmd-S.`, 27],
    [`Those dots may be hard to see, but we can increase the number of turtles
to 30,000, 300,000 or 1 million.`, 38],
    [`What we want to do next is to move those turtles around. So we define
a method called "move". Move increments the x and y of the turtles. We call
the move method from a static function "step".`, 47],
    [`When we click the "step" clock, "step" is repeatedly executed and the turtles move.`, 58],
    [`Interestingly, while they are moving, we can edit the program on the
fly and the changes take effect as soon as we hit Cmd-S. We can add an
argument to "move", use it in the code, change the call site and the
turtles that went off screen come back.`, 63],
    [`We could even allow each individual turtle to have its own
velocity. So let's add properties "dx" and "dy" to each turtle. Then, we use them in
"move". Here, instead of "n", we increment the "x" and "y" of each turtle
according to their "dx" and "dy".`, 87],
    [`We call the primitive "fillRandom" to set the "dx" and "dy" to be the x and y components
of a randomly-chosen direction vector. Now, all turtles move
in their own individual directions.`, 104],
    [`Let's run it again by executing "setup" manually.`, 116],
    [`Now we'll change this to be a simple gravity simulation. To do so, we add constant
acceleration to the "y" component of the velocity.  Now all turtles are
accelerating toward the bottom.`, 122],
    [`We don't want those particles to go out of bounds. So we modify
the "move" method. First we store "dx" and "dy", as well as the possible
new location of "x" and "y" into local variables.`, 133],
    [`When "newX" is out of bounds, we make the turtle bounce back.`, 143],
    [`When "newY" is out of bounds below, we wrap the value around to the top.`, 149],
    [`After adjusting those variables,
we write the values back to the turtle's properties. Now one million
turtles are falling down, bouncing off the side walls, and wrapping around
to the top.`, 157],
    [`We are now going to create a simulation with large objects. To do so, we use what's called a "patch". A
patch is a 2D grid of cells where turtles can store values. Here,
we create a patch called "Field", and add "r", "g", "b", and "a" properties for each cell.`, 173],
    [`And, we define a breed called "Filler" that operates on the Field.`, 191],
    [`Now we define a method called "fill". The argument for this method is the patch, and
turtles executing this method update the patch cell value at their x and y coordinates.`, 197],
    [`We modify "setup" to use a primitive called
"fillSpace", which creates turtles of the Filler breed and
places them at all integral grid points. When this "setup" is called,
and the "fill" method is called, each "r" and "g" of the patch get values derived from its position, resulting
in this color gradient.`, 208],
    [`Let's make some shapes now. We define
the "fillCircle" method to replace "fill". Let's also add the "clear" method, which clears the field's values.`, 225],
    [`"fillCircle" works by having each Filler turtle
check whether it is within the radius of the circle. If it is, it writes
the value into their corresponding cell.`, 238],
    [`In the "setup" function, we call "fillCircle" and get a circle at (100, 100).`, 256],
    [`Shadama programs can also be interactive. Let's split the "setup" function and
create another one called "loop".`, 265],
    [`Notice to the right that there is a variable
called "mousemove", which changes its value as we move the mouse pointer in the
display. That is an indication that we can use the value in our
program.`, 280],
    [`Now let's tie it all together. This code has methods we used
previously, such as "setColor". "fillCircle" is slightly modified so that
it sets normal vectors for the circle in the patch.`, 297],
    [`In the "move"
method, each turtle checks the normal in the patch cell where the turtle is
located and computes a new direction from the dot product with the normal. When we run
this, particles bounce off the circle and make a beautiful pattern.`, 309],
    [`However, it is a bit hard to see because the colors of the turtles are too
similar. Here, we change the "setColor" method so that instead of using "x"
and "y" position, we use the velocity "dx" and "dy" to determine the turtles'
color.`, 336],
    [`Then we call "setColor" from "loop", so that the colors are updated continuously.`, 349],
    [`Here, horizontal velocity corresponds with reddish color, and vertical
velocity corresponds with greenish color. The visualization can be quickly adjusted
to match how you prefer to view the simulation.`, 354],
    [`For fun, you can make two circles that move symmetrically.`, 364],
    [`Here's an interesting variation of our program. Instead of modeling gravity as pulling downward, gravity follows
the inverse square law in relation to the mouse pointer location. It looks like
there are large structures, but it's actually just a
quarter million particles from regular initial positions, all following the inverse square law.`, 373],
    [`Shadama allows the user to import images. The built-in "fillImage"
takes an image object, creates enough turtles to cover it, and sets the turtle colors
based on the image's pixel values. This looks like an image but it is
actually a bunch of turtles.`, 411],
    [`We reuse our previous "move" method, set the
direction vectors randomly, create the "loop" method that calls "move", and run "loop".`, 431],
    [`For fun,
We can use the turtles' red and green values to determine turtle velocity, causing an
an interesting effect.`, 455],
    [`Let's use those pixels in our gravity simulation.`, 477],
    [`The code checks the timer, and every 10 seconds, it gathers all turtles to their original position.`, 489],
    [`We can also try some mathematical functions. This is a program to
visualize the Mandelbrot set. Notice how we can change the color scheme on the
fly.`, 500],
    [`This is Conway's Game of Life.`, 520],
    [`Again, we can change the program while
the simulation is running, and the code change is reflected in the
simulation right away, without needing to restart.`, 525]
];

const eventsContainer = document.getElementById('caption-container');
if (eventsContainer) {
    // Create HTML content for Shadama events without showing the time
    const eventsHtml = shadamaEvents.map(([text]) => `
        <div>
            <p>${text}</p>
        </div>
    `).join('');

    // Insert the content into the container
    eventsContainer.innerHTML = eventsHtml;
}
// Attach to the window object
(window as any).shadamaEvents = shadamaEvents;
