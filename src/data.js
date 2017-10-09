function parseResults(results) {
  let update = false;
  let data = {};
  results.map(result => {
    switch(result.feed.title.$t) {
      case 'Sleutel':
        let st = new Date(result.feed.updated.$t).getTime();
        if(st > sleutelTime){
          update = true;
          sleutelTime = st;
          data.sleutel = parseSleutel(result)
        }
        break;
      case 'Data':
        let dt = new Date(result.feed.updated.$t).getTime();
        if(dt > dataTime){
          update = true;
          dataTime = dt;
          data.records = parseData(result)
        }
        break;
    }  
  })
  if(update) {        
    renderGraph(data);
    renderMap(data);
  }
}

function extractData(item) {
  var item_data = {}
  for (k in item) {
    if (k.indexOf('gsx$') == 0) {
      item_data[k.substr(4)] = trim(item[k].$t);
    }
  }
   if (isEmptyObject(item_data)) return null;
   return item_data;
}

function parseSleutel(sleutel) {
  let persons = [];
  if(sleutel.feed.entry.length == 0) return false;
  sleutel.feed.entry.map(entry => {
    let d =extractData(entry);
    let person = {};
    if(d===null)return false;
    person.id=+d.id;
    person.linkCount =0;
    d.tags=d3.csvParseRows(d.tags)[0];    
    d.colorLabel = d.color;
    d.color=d.color!==''?d[d.color]:null;
    person.properties =d;
    persons.push(person);
  })
  return persons;
}
function parseData(data) {
  let records = [];
  let rprime = [];
  let links = [];
  if(data.feed.entry.length == 0) return false;
  data.feed.entry.map(entry => {
    let d =extractData(entry);
    if(d===null)return false;
    d.fromid=+d.fromid;
    d.toid=+d.toid;
    d.fromlatitude=+d.fromlatitude;
    d.fromlongitude=+d.fromlongitude;
    d.tolatitude=+d.tolatitude;
    d.tolongitude=+d.tolongitude;
    //TODO: do check op completeness record
    let dprime = Object.assign({},d)
    dprime.fromid = 'p'+dprime.fromid;
    dprime.toid = 'p'+dprime.toid;
    let tolink = {source: d.toid, target: dprime.toid};
    let fromlink = {source: d.fromid, target: dprime.fromid}; 
    records.push(d)
    rprime.push(dprime)
    links.push(tolink)
    links.push(fromlink)
  })

  return {"records":records,"links":links,"recprime":rprime};
}