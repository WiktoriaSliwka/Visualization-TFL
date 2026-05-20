let lineStatus = null;
let allStations = {}; 

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
}


loadAll();

setInterval(async () => {
  await fetchLineStatus();
  redraw(lineStatus);
}, 30000);
