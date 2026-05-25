Firstly i created my main.js file to connect to the TFL API https://api.tfl.gov.uk/Line/Mode/tube/Status using the async function fetchLineStatus() within my main.js - (data\images\connectingAPI.png).Secondly I created my index.html file and created it basic structure outline. I had issues loading my installation as my project.js has to run before my main.js as within my project.js my functions fetch information from the api and if the files load in the wrong order it produced an error. 

I updated my fetchLineStatus() function to only fetch the information I would require for my installation - line.id, line.lineStatuses[0] and line.lineStatuses[0].statusSeverityDescription. The .map() is looping through all 11 lines in the array and for each one building a new smaller object with only the three fields I need. I now moved lineStatus outside the function to become a global variable and be accessible by project.js. 

Project.js couldn't access my global variables init(data) function   This is because the async fetchLineStatus must fist collect the live data. By creating the init(data) function my project.js file doesn't run until the data has already been collected. main.js fetches the data and processes it, calls the init() in project.js to make the data available to it. Inside my .then() block I created a forEach() method to loop through the data. ForEach() item in data is picked up and displayed in my console.log-(data\images\forEachoutput.png)

Now that all the live data has been fetched correctly I researched what would be the best way to animate the installation. At first I settled on p5.js as It's familiar but unfortunately due to the sheer size of the installation, p5.js 60FPS limit has the potential to cause errors and limitations in the future. The next option was Three.js but as its a 3D library it would be difficult to create a 2D animation. I finally decided on PIXI.js which I have not had much experience using but with many tutorials and public documentation available I was able to use it effectively. I used PIXI.js as my core visual engine and vanilla js for generative logic. 
I added my PIXI script tag to run before anything else. Within css I created a canvas which is where I will display mt PIXI animation. At first I created different shapes and changed their positioning on the canvas to learn how PIXI.js works.

Creating the train routes. fetchAllStations(lineId) function.
Adding the stations by fetching the latitude and longitude coordinates and creating position points - stations = data.stopPointSequences[0].stopPoint.map(). First with one line to check everything works and then returning all via {lineId}. Returning line.name. line.lat and line.lon. 
const res = await fetch(`https://api.tfl.gov.uk/Line/${lineId}/Route/Sequence/outbound`);
Editing within style.css line appearance. 
data\images\allroutes.png

Creating Dots where the stations are located on tube route with dot.circle() and editing appearance within style.css and using PIXI graphics.
Adding the flickering with stationsDots.push
data\images\stationloacation.png

severityToColor() function 
Takes in severity and colour. Change in dot colour represents a change in route severity.
Changing the output of graphics fill to match line severity-graphics.fill(severityToColour(lineStatus.severity, colour));


30 second refresh on API to keep information up to date setInternal()
 error due to not deleting the previous graphics - app.stage.removeChildren(); wipes the canvas to redraw the new data
function redraw(data)

adding a glow effect from PIXI to make the light glow - <script src=<script src="https://cdn.jsdelivr.net/npm/pixi-filters@6/dist/pixi-filters.js"></script>> - create a bloomFilter with graphics

adding a noise effect using <script src="https://cdn.jsdelivr.net/npm/simplex-noise@4/dist/cjs/simplex-noise.js"></script> SimplexNoise()

After adding the effects I fixed Object.entries to handle both loops to cerate the routes using lan and lon co-ordinates, followed by station location and flickering.
stationDots.push()
data\images\stationseverity.png

Changed flickering speed to represent severity along with changing colours. With orange representing a severity of 9 and red >9. The dots stay the same colour and don't flicker if the line has good service.  
function severityToIntensity(severity, scale)
Error again due to not clearing the previous severityToIntensity().
stationDots = []; is added to top of drawLines(). Now every time redraw is called it clears the old dots and draws new up to date dots. 
data\images\screenerror.png 

using function buildLegend(data) i created an index section within the installation. 
const container = document.getElementById('line-list')
Finds the empty <div id="line-list"> in the HTML. This is where the legend items will be injected.  if (!container) return is
a safety check if the loop doesn't work. The function stops instead of throwing an error.
Wipe everything inside the div clean before rebuilding, otherwise it will redraw the the updated legend on top. const lineColours = {...}
A lookup table matching each line ID to its official TfL hex colour. 
data.forEach(line => {} Loops through your lineStatus array and collects the needed information from all 11 routes

Then i called it inside my init()-buildLegend(data);
The index is created but it was very faint and difficult to see against the black background of the installation. 
I styled the legend within my css to make it more visible . the legend- item dot and label 

Now that im happy with the installation, I created sections within my HTML to enable web navigation. 
Within my main.js i created a  function goTo(id){}.
using  document.querySelectorAll('.page') and document.getElementById(id). Section navigation was enabled but within one screen instead of separate pages for each section.

At fist I tried to implement scroll navigation but found it difficult to implement correctly. Instead I add different pages for different sections to space all the content out.

I mounted the installation within the project section so that it wouldn't build in the intro section. document.getElementById('project').appendChild(app.canvas);

to space everything out within the #intro and #bibliography I used .my-element {
    margin-top: 2rem;
    margin-bottom: 2rem;
}
 but later added margin-bottom: 2rem; into my .p as this created less code-clutter 

 I created a navigation bar at the top of the screen and edited it within css. This allows users to navigate the screen using the buttons at the bottom of the page of the navbar at the top. I implemented a .topnav a:hover and .topnav a:active 
 Navigation errors- I updated the nav active stage using document.querySelectorAll and document.getElementById within my function goTo(id)

 unfortunately the bottons and topnav where still causing issues 
 main.js:24 Uncaught TypeError: Cannot read properties of null (reading 'classList')
    at goTo (main.js:24:42)
    at HTMLButtonElement.onclick (VM1708 index.html:1:1) 
This was due to spelling errors and missmatched IDs.

Now the navigation was working the installation and legend wasn't displaying on the canvas. I added a z-index to all elements that were dispalyed on the canvas so that the installation and legend load on top of the canvas instead of underneath it. 

adding fonts and colours  in css

creating a status bar within HTML and css at the bottom of the installation to show when the next update will take place. 

The status bar is displayed at the bottom of the screen but its not active yet. 

function updateStatusBar() and function startCountdown implemented - created a  async set interval to updateStatusBar, startCountdown and redraw(lineStatus)
data\images\statusbar.png

<div class="colour-key"> — a section inside the legend that explains what the station dot colours mean. It's hardcoded HTML because the colours don't change — they're always the same three states.

I wanted to add a colour wheel to represent all stations for the key label "Good Service". Using conic-gradient i added all the tube colours and created a wheel

I changed the website to have TFL colours - blue, white and red but none of the colours suited the installation. It made it difficult to see all tube routes so I changed the background to black 
data\images\bluebackground.png

This project was developed with the assistance of Claude.ai, an AI assistant made by Anthropic. Claude was used as a guided learning tool throughout the development process rather than as a code generator. Concepts including asynchronous JavaScript, the PixiJS rendering pipeline, coordinate projection, simplex noise and API data structuring were explained and worked through interactively. Claude.ai was not used to generate complete solutions but to support understanding and problem solving throughout the build process.

