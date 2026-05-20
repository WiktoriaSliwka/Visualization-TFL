let lineStatus = null;
let Stations = null; 

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
    
    stations = data.stopPointSequences[0].stopPoint.map(line => {
        return{
            name: line.name,
            lat: line.lat,
            lon: line.lon,   
        }
    });
    console.log(stations)
}
async function loadAll() {
  await Promise.all([
    fetchLineStatus(),
    fetchAllStations('jubilee')  
  ]);

  init(lineStatus);
}

loadAll();

