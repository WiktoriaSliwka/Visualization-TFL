let lineStatus = null;
let allStations = {};


function goTo(id) {

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    // top-page navigation bar routing
    document.querySelectorAll('.topnav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.topnav a[onclick="goTo('${id}')"]`).classList.add('active');

    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
      statusBar.classList.toggle('visible', id === 'project');
}

    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.style.display = id === 'project' ? 'block' : 'none';
    }

    if (id === 'project') {
        buildLegend(lineStatus);
    }

    if (id === 'project' && lineStatus) {
    buildLegend(lineStatus);
}
}

// connecting to the api 
async function fetchLineStatus() {
  const res = await fetch('https://api.tfl.gov.uk/Line/Mode/tube/Status');
  const data = await res.json();

  lineStatus = data.map(line => {
    return {
      id: line.id,
      severity: line.lineStatuses[0].statusSeverity,
      description: line.lineStatuses[0].statusSeverityDescription
    };
});
}

// fetching line names and station locations 

async function fetchAllStations(lineId) {
    const res = await fetch(`https://api.tfl.gov.uk/Line/${lineId}/Route/Sequence/outbound`);
    const data = await res.json();
    
    allStations[lineId] = data.stopPointSequences[0].stopPoint.map(line => {
        return{
            name: line.name,
            lat: line.lat,
            lon: line.lon,   
        }
    });
    console.log(allStations)
}

//fetching status for every line
async function loadAll() {
  await Promise.all([
    fetchLineStatus(),
    fetchAllStations('jubilee'),
    fetchAllStations('central'),
    fetchAllStations('bakerloo'),
    fetchAllStations('district'),
    fetchAllStations('circle'),
    fetchAllStations('metropolitan'),
    fetchAllStations('northern'),
    fetchAllStations('piccadilly'),
    fetchAllStations('victoria'),
    fetchAllStations('hammersmith-city'),
    fetchAllStations('waterloo-city'),
  ]);

  init(lineStatus);
  // countdown till next refresh
    updateStatusBar();
    startCountdown();
}
//global variable countdown
let countdown = 30;
let countdownInterval = null;

//uk time
function updateStatusBar() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB');
    const el = document.getElementById('last-update');
    if (el) el.textContent = timeString;

    setInterval(async () => {
  await fetchLineStatus();
  redraw(lineStatus);
  updateStatusBar();
  startCountdown();
}, 30000); //30 seconds - maybe i'll change to later
}

//countdown creation

function startCountdown() {
    countdown = 30;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        countdown--;
        const el = document.getElementById('next-poll');
        if (el) el.textContent = countdown + 's';
        if (countdown <= 0) {
            countdown = 30;
        }
    }, 1000);
}


loadAll();

//to fix countdown error- need to se3t interval
setInterval(async () => {
  await fetchLineStatus();
  redraw(lineStatus);
}, 30000);
