function parseResults(results) {
    let update = false;
    let data = {};
    let sleutel = results.filter(d=>d.feed.title.$t==='Sleutel')[0];
    let st = new Date(sleutel.feed.updated.$t).getTime();
    if(st > sleutelTime || data.sleutel === undefined){
      update = true;
      sleutelTime = st;
      data.sleutel = parseSleutel(sleutel)
    }
    let records = results.filter(d=>d.feed.title.$t==='Data')[0];
    let dt = new Date(records.feed.updated.$t).getTime();
    if(dt > dataTime){
      update = true;
      dataTime = dt;
      data = parseData(records,data)
    }
    
    if(update) {        
     renderGraph(data);
    //  renderMap(data);
  
      var briefOptions = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 40,
        maxPatternLength: 16,
        minMatchCharLength: 1,
        tokenize: false,
        keys: [
          "properties.description",
          "properties.fromname",
          "properties.tags",
          "properties.fromlocation",
          "properties.toname",
          "properties.tolocation"
      ]
      };
      var sleutelOptions = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 40,
        maxPatternLength: 16,
        minMatchCharLength: 1,
        tokenize: false,
        keys: [
          "properties.alternatives",
          "properties.description",
          "properties.name",
          "properties.tags"          
      ]
      };      
      SEARCHBRIEF = new Fuse(data.records, briefOptions); 
      SEARCHSLEUTEL = new Fuse(data.sleutel, sleutelOptions); 
    }
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

  function parseData(records,data) {
    if(records.feed.entry.length === 0 || data.sleutel === undefined) return false;
    let brieven = [], locations = [];
    records.feed.entry.map(entry => {    
      let d =extractData(entry);
      if(d===null)return false;      
      let record = {};
      record.id = recordid++;
    
      record.fromId =+ d.fromid;
      let from = data.sleutel.filter(l=>l.id===record.fromId)[0];
      if(from && d.fromname !== from.properties.name) {
        d.fromname !== ""?from.properties.alternatives += " "+d.fromname:false;
        d.fromname = from.properties.name;
      }
      record.fromLoc = 'la'+d.fromlatitude+'lo'+d.fromlongitude;
      record.fromAccuracy =+ d.fromaccuracy;
      record.fromLon=d.fromlongitude==""?null:+d.fromlongitude;
      record.fromLat=d.fromlatitude==""?null:+d.fromlatitude;
    
      record.toId =+ d.toid;
      let to = data.sleutel.filter(l=>l.id===record.toId)[0];
      if(to && d.toname !== to.properties.name) {
        d.toname !== ""?to.properties.alternatives += " "+d.toname:false;
        d.toname = to.properties.name;
      }
      record.toLoc = 'la'+d.tolatitude+'lo'+d.tolongitude;
      record.toAccuracy =+ d.toaccuracy;
      record.toLon=d.tolongitude==""?null:+d.tolongitude;
      record.toLat=d.tolatitude==""?null:+d.tolatitude;
    
      record.properties = {};
      Object.assign(record.properties, d);

      let sendloc = locations.filter(l=>l.properties.id===record.fromLoc);
      let recloc = locations.filter(l=>l.properties.id===record.toLoc);
      if(sendloc.length===0) {
        locations.push({"type":"Feature","geometry":{"type":"Point","coordinates":[record.fromLon,record.fromLat]},properties: {"id":record.fromLoc,"accuracy":record.fromAccuracy,cnt:1}})
      }
      else {
        sendloc[0].properties.cnt++;
      }
      if(recloc.length===0) {
        locations.push({"type":"Feature","geometry":{"type":"Point","coordinates":[record.toLon,record.toLat]},properties: {"id":record.toLoc,"accuracy":record.toAccuracy,cnt:1}})
      }
      else {
        recloc[0].properties.cnt++;
      }
      brieven.push(record);      
    })
    return {"sleutel":data.sleutel,"records":brieven,"locations":locations};
  }