//Shift + Alt + F in VS Code to auto-format
let stationDots = [];
let app = null;
const simplex = new SimplexNoise();

function init(data) {
  app = new PIXI.Application();

  app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0000 , // change back to black later 
  }).then(() => {
    app.ticker.add(() => {
  const time = Date.now() * 0.001; //change for diff flickering 
  stationDots.forEach(({ dot, index, severity }) => {
    const noise = simplex.noise2D(time, index * 0.4);
    const intensity = severityToIntensity(severity);

  const scale = 1 + noise * intensity; 
    dot.scale.set(scale);
  });
});
    
   document.body.appendChild(app.canvas);
  app.canvas.style.pointerEvents = 'none';
  drawLines(data);
  buildLegend(data);
  });
}

//draw tube lines
function drawLines(data) {
  stationDots = [];
  const lineColours = {
    jubilee:            0xa0a5a9,
    central:            0xe32017,
    bakerloo:           0xb36305,
    district:           0x00782a,
    circle:             0xffd300,
    metropolitan:       0x9b0056,
    northern:           0x555555,
    piccadilly:         0x003688,
    victoria:           0x0098d4,
    'hammersmith-city': 0xf3a9bb,
    'waterloo-city':    0x95cdba,
  };

Object.entries(allStations).forEach(([lineId, stations]) => {
    const status = data.find(line => line.id === lineId);
    const colour = lineColours[lineId] || 0xffffff;
    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);

    const bloomFilter = new PIXI.filters.BloomFilter();
    bloomFilter.strength = 2;
    graphics.filters = [bloomFilter];

    // First loop — draws the route line
    graphics.moveTo(0, 0);
    stations.forEach((station, index) => {
      const pos = projects(station.lat, station.lon);
      if (index === 0) {
        graphics.moveTo(pos.x, pos.y);
      } else {
        graphics.lineTo(pos.x, pos.y);
      }
    });
    graphics.stroke({ width: 10, color: colour });

    // Second loop — draws the flickering station dots
    stations.forEach((station, index) => {
      const pos = projects(station.lat, station.lon);
      const dot = new PIXI.Graphics();
      dot.circle(0, 0, 8);
      dot.fill(severityToColour(status.severity, colour));
      dot.x = pos.x;
      dot.y = pos.y;
      app.stage.addChild(dot);
      stationDots.push({ dot, pos, colour, severity: status.severity, index });
      console.log(lineId, station.name, status.severity);
    });
});
    
 }

function redraw(data) {
  app.stage.removeChildren();
  drawLines(data);
  buildLegend(data);
}

//change flickering based on severity of delay 
function severityToIntensity(severity, scale) {
  if (severity === 10) {
    return 0;
  } else if (severity === 9) {
    return 0.6;
  } else if (severity <9 ) {
    return 1.2;
  } else {
    return console.log("error")
  }
}

//change dot colour based on severity 
function severityToColour(severity, colour) {
  if (severity === 10) {
    return colour;
  } else if (severity === 9) {
    return 0xebb563; //light yellow
  } else {
    return 0x4f0e08; //brick red
  }
}

//tube size to make everything to scale 
function projects(lat, lon) {
  const minLat = 51.28;
  const maxLat = 51.70;
  const minLon = -0.55;
  const maxLon = 0.30;

  const x = (lon - minLon) / (maxLon - minLon) * window.innerWidth;
  const y = (maxLat - lat) / (maxLat - minLat) * window.innerHeight;

  return { x, y };
}

// build index using the legend method
function buildLegend(data) {
  const container = document.getElementById('line-list', );
  if (!container) return;
  container.innerHTML = '';
 

  container.innerHTML = '';

  // colour same as tube route 
  const lineColours = {
    jubilee:            '#a0a5a9',
    central:            '#e32017',
    bakerloo:           '#b36305',
    district:           '#00782a',
    circle:             '#ffd300',
    metropolitan:       '#9b0056',
    northern:           '#555555',
    piccadilly:         '#003688',
    victoria:           '#0098d4',
    'hammersmith-city': '#f3a9bb',
    'waterloo-city':    '#95cdba',
  };

  data.forEach(line => {
    const item = document.createElement('div');
    item.className = 'legend-item';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.background = lineColours[line.id] || '#ffffff';

    const label = document.createElement('span');
    label.className = 'legend-label';
    label.textContent = `${line.id} — ${line.description}`;

    item.appendChild(dot);
    item.appendChild(label);
    container.appendChild(item);
  });
}