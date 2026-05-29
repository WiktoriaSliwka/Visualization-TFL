//insert button in VS Code to stop auto delete when typing
let stationDots = [];
let app = null;
const simplex = new SimplexNoise();

function init(data) {
  app = new PIXI.Application();

  app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
  }).then(() => {

    document.addEventListener('mousemove', (e) => {
      const tooltip = document.getElementById('tooltip');
      if (tooltip) {
        tooltip.style.left = e.clientX + 15 + 'px';
        tooltip.style.top = e.clientY + 15 + 'px';
      }
    });

    app.ticker.add(() => {
      const time = Date.now() * 0.001;
      stationDots.forEach(({ dot, index, severity }) => {
        const noise = simplex.noise2D(time, index * 0.4);
        const intensity = severityToIntensity(severity);
        const scale = 1 + noise * intensity;
        dot.scale.set(scale);
      });
    });

    document.body.appendChild(app.canvas);
    app.canvas.style.pointerEvents = 'auto';
    drawLines(data);
    buildLegend(data);
  });
}

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

    // Draw route line using ordered stops
    graphics.moveTo(0, 0);
    stations.route.forEach(sequence => {
    graphics.moveTo(0, 0);
    sequence.stopPoint.forEach((station, index) => {
        const pos = projects(station.lat, station.lon);
        if (index === 0) {
            graphics.moveTo(pos.x, pos.y);
        } else {
            graphics.lineTo(pos.x, pos.y);
        }
    });
    graphics.stroke({ width: 4, color: colour });
});

    // Draw dots using all stops
    stations.stops.forEach((station, index) => {
        const pos = projects(station.lat, station.lon);
        const dot = new PIXI.Graphics();
        dot.circle(0, 0, 6);
        dot.fill(severityToColour(status.severity, colour));
        dot.x = pos.x;
        dot.y = pos.y;
        dot.eventMode = 'static';
        dot.cursor = 'pointer';

        dot.on('pointerover', () => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.textContent = `${station.name} — ${lineId}`;
            }
        });

        dot.on('pointerout', () => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) tooltip.style.display = 'none';
        });

        app.stage.addChild(dot);
        stationDots.push({ dot, pos, colour, severity: status.severity, index });
    });
});
}

function redraw(data) {
  app.stage.removeChildren();
  drawLines(data);
  buildLegend(data);
}

function severityToIntensity(severity) {
  if (severity === 10) {
    return 0;
  } else if (severity === 9) {
    return 0.6;
  } else if (severity < 9) {
    return 1.2;
  } else {
    return 0;
  }
}

function severityToColour(severity, colour) {
  if (severity === 10) {
    return colour;
  } else if (severity === 9) {
    return 0xebb563;
  } else {
    return 0x4f0e08;
  }
}

function projects(lat, lon) {
  const minLat = 51.28;
  const maxLat = 51.70;
  const minLon = -0.55;
  const maxLon = 0.30;

  const x = (lon - minLon) / (maxLon - minLon) * window.innerWidth;
  const y = (maxLat - lat) / (maxLat - minLat) * window.innerHeight;

  return { x, y };
}

function buildLegend(data) {
  const container = document.getElementById('line-list');
  if (!container) return;
  container.innerHTML = '';

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