//Shift + Alt + F in VS Code to auto-format
let app = null;

function init(data) {
  app = new PIXI.Application();

  app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x080810,
  }).then(() => {
    document.body.appendChild(app.canvas);
    drawLines(data);
  });
}

function drawLines(data) {
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
    bloomFilter.strength = 8;
    graphics.filters = [bloomFilter];
    graphics.moveTo(0, 0);

    stations.forEach((station, index) => {
      const pos = projects(station.lat, station.lon);
      if (index === 0) {
        graphics.moveTo(pos.x, pos.y);
      } else {
        graphics.lineTo(pos.x, pos.y);
      }
    });

    graphics.stroke({ width: 2, color: colour });

    
    stations.forEach(station => {
      

      
    });
  });
}

function redraw(data) {
  app.stage.removeChildren();
  drawLines(data);
}

function severityToColour(severity, colour) {
  if (severity === 10) {
    return colour;
  } else if (severity === 9) {
    return 0xffa500;
  } else {
    return 0xe32017;
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