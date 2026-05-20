function init(data) {
  const app = new PIXI.Application();

  app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x080810,

  }).then(() => {

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

// add a clear starting point 
graphics.moveTo(0, 0);

stations.forEach((station, index) => {
  const pos = projects(station.lat, station.lon);

  if (index === 0) {
    // Stanmore
    graphics.moveTo(pos.x, pos.y);
  } else {
    graphics.lineTo(pos.x, pos.y);
  }
});

graphics.stroke({ width: 2, color: 0xa0a5a9 });

stations.forEach((station) => {
  const pos = projects(station.lat, station.lon);
  graphics.circle(pos.x, pos.y, 6);
  graphics.fill(0xa0a5a9);
});

    document.body.appendChild(app.canvas);
    //console.log('PixiJS ready');
  });
}
// edit to add all stations 
function projects(lat, lon) {
  const minLat = 51.28;
  const maxLat = 51.70;
  const minLon = -0.55;
  const maxLon = 0.30;

  const x = (lon - minLon) / (maxLon - minLon) * window.innerWidth;
  const y = (maxLat - lat) / (maxLat - minLat) * window.innerHeight;

  return { x, y };
}






// function projects(latitude, longitude){
//     let lat = latitude = Math.PI * latitude / 180;
//     let  lon = longitude = Math.PI * longitude / 180;
//     return {x: lan, y: lat};
// }