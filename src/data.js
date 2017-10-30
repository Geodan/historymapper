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
  let senders = [], receivers = [], locations = [];
  if(data.feed.entry.length == 0) return false;
  data.feed.entry.map(entry => {    
    let d =extractData(entry);
    let sender = {}, receiver = {};
    if(d===null)return false;
    sender.id =+ d.fromid;
    sender.loc = 'la'+d.fromlatitude+'lo'+d.fromlongitude;
    sender.accuracy =+ d.fromaccuracy;
    sender.lon=d.fromlongitude==""?null:+d.fromlongitude;
    sender.lat=d.fromlatitude==""?null:+d.fromlatitude;
    sender.properties = {};
    Object.assign(sender.properties, d);
    sender.type="sender";
    receiver.id =+ d.toid;
    receiver.loc = 'la'+d.tolatitude+'lo'+d.tolongitude;
    receiver.accuracy =+ d.toaccuracy;
    receiver.lon=d.tolongitude==""?null:+d.tolongitude;
    receiver.lat=d.tolatitude==""?null:+d.tolatitude;
    receiver.properties = {};
    Object.assign(receiver.properties, d);
    receiver.type="receiver";
    let sendloc = locations.filter(l=>l.properties.id===sender.loc);
    let recloc = locations.filter(l=>l.properties.id===receiver.loc);
    if(sendloc.length===0) {
      locations.push({"type":"Feature","geometry":{"type":"Point","coordinates":[sender.lon,sender.lat]},properties: {"id":sender.loc,"accuracy":sender.accuracy,cnt:1}})
    }
    else {
      sendloc[0].properties.cnt++;
    }
    if(recloc.length===0) {
      locations.push({"type":"Feature","geometry":{"type":"Point","coordinates":[receiver.lon,receiver.lat]},properties: {"id":receiver.loc,"accuracy":receiver.accuracy,cnt:1}})
    }
    else {
      recloc[0].properties.cnt++;
    }
    senders.push(sender);
    receivers.push(receiver);
  })
  return {"senders":senders,"receivers":receivers,"locations":locations};
}