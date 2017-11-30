function initMap(el) {
  let map = L.map(el+'map').setView([0,0], 2);
  L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  let markers = L.geoJson(null, {
    opacity: 0.3,
    pointToLayer: createClusterIcon
  }).addTo(map);
  let results = L.geoJson(null, {
    pointToLayer: createSearchIcon
  }).addTo(map);

  return {map:map, markers: markers, src:el, results: results}
}

let maps = ['from','to'].map(d=>initMap(d))



function createClusterIcon(feature, latlng) {
  var count = feature.properties.point_count!==undefined?feature.properties.point_count:1;
  var size =
      count < 100 ? 'small' :
      count < 1000 ? 'medium' : 'large';
  var icon = L.divIcon({
      html: '<div><span></span></div>',
      className: 'marker-cluster marker-cluster-' + size,
      iconSize: L.point(40, 40)
  });
  return L.marker(latlng, {icon: icon});
}

function createSearchIcon(feature, latlng) {
  var count = feature.properties.point_count!==undefined?feature.properties.point_count:1;
  var size =
      count < 100 ? 'small' :
      count < 1000 ? 'medium' : 'large';
  var icon = L.divIcon({
      html: '<div><span>' + count + '</span></div>',
      className: 'search-cluster search-cluster-' + size,
      iconSize: L.point(40, 40)
  });
  return L.marker(latlng, {icon: icon,forceZIndex: 1000});
}

let clusters;
function createMapData(data) {
  //data in -> filter punten from/to
  //if search -> create select/noselect
  // loop door search resultaten en voeg een search = 1 toe aan DATA
  // maak to/from geojsons
  // maak clusters, met count en searchcount
  
  maps.map(m=>{
    var features = [];
    data.records.forEach(r=> {
      features.push(createGeojson(r,m.src))        
    });
    createCluster(m.map,m.markers,features)
    
  })


}
function createMapResult(data) {
  //data in -> filter punten from/to
  //if search -> create select/noselect
  // loop door search resultaten en voeg een search = 1 toe aan DATA
  // maak to/from geojsons
  // maak clusters, met count en searchcount
  
  maps.map(m=>{
    var features = [];
    data.forEach(r=> {
      features.push(createGeojson(r,m.src))        
    });
    createCluster(m.map,m.results,features,m.src)    
  })


}

function createCluster(map,markers,features,search) {
  
  if (search && map._events.moveend.length>4)  map.off("moveend", map._events.moveend[4].fn);   
  let index = supercluster({
    radius: 40,
    maxZoom: 20
  });
  index.load(features);
  map.on("moveend", e=>update(search));    
  update(search);
  
  function update(search) {	
    console.log(search)
		//svgmap.selectAll('g').remove();
    let bbox = map.getBounds();
    let c = index.getClusters([-180,-90,180,90],map.getZoom())
		//let c = index.getClusters([bbox.getWest(),bbox.getSouth(),bbox.getEast(),bbox.getNorth()],map.getZoom())
		markers.clearLayers();
    
    let wb = bbox.getWest();
    let eb = bbox.getEast();
    let nb = bbox.getNorth();
    let sb = bbox.getSouth();

    let nw=[],n=[],ne=[],w=[],u=[],e=[],sw=[],s=[],se=[];
    c.forEach(p=>{
      let x = p.geometry.coordinates[0];
      let y = p.geometry.coordinates[1];
      if (x==0 && y==0) { //null island
        u.push(p)
      }
      else if(x<wb) { //west
        if (y > nb) { //north
          nw.push(p)
        }
        else if (y < sb) { //south
          sw.push(p)
        }
        else { //middle
          w.push(p)
        }

      }
      else if (x>eb) { //east
        if (y > nb) { //north
          ne.push(p)
        }
        else if (y < sb) { //south
          se.push(p)
        }
        else { //middle
          e.push(p)
        }
      }
      else { //middle
        if (y > nb) { //north
          n.push(p)
        }
        else if (y < sb) { //south
          s.push(p)
        }
        else { //middle
          //nothing
        }
      }

    })
    if(search) {
    let mapdiv =d3.select('#'+search+'-map');
    mapdiv.select('.n').select('span').text(n.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.nw').select('span').text(nw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.ne').select('span').text(ne.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.w').select('span').text(w.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.e').select('span').text(e.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.sw').select('span').text(sw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.s').select('span').text(s.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.se').select('span').text(se.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.unknown').select('span').text(u.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    }
    markers.addData(c.filter(d=>(d.geometry.coordinates[0]!=0&&d.geometry.coordinates[1]!=0)));
    //    let fixed = c.filter(d=>!d.properties.cluster);
     //   createChildren(fixed,data.records,map);
        
        //todo  create lijsten met locaties: zowel de fixed points als de personen
        //maak links tussen fixed points en personen
    
  }
  return index;
}




/*


function createMap(map,src,data) {
  L.svg().addTo(map);	
  L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
 

  let svgmap = d3.select('#'+src+'map').select("svg");
  svgmap.attr('pointer-events',null)

  createClust(data,map,svgmap,src)
	
}


function renderMap(data) {
  L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(frommap);
L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(tomap);	
  createMap(frommap,"from",data);
  createMap(tomap,"to",data);

	
}

function createClust(data,map,svgmap,src) {
  let markers = L.geoJson(null, {
    pointToLayer: createClusterIcon
}).addTo(map);
  let index = supercluster({
    radius: 40,
    maxZoom: 20
  });
  index.load(data[src]);
  map.on("moveend", update);    
	update();
  
  function update() {	
		//svgmap.selectAll('g').remove();
    let bbox = map.getBounds();
    let c = index.getClusters([-180,-90,180,90],map.getZoom())
		//let c = index.getClusters([bbox.getWest(),bbox.getSouth(),bbox.getEast(),bbox.getNorth()],map.getZoom())
		markers.clearLayers();
    
    let wb = bbox.getWest();
    let eb = bbox.getEast();
    let nb = bbox.getNorth();
    let sb = bbox.getSouth();

    let nw=[],n=[],ne=[],w=[],u=[],e=[],sw=[],s=[],se=[];
    c.forEach(p=>{
      let x = p.geometry.coordinates[0];
      let y = p.geometry.coordinates[1];
      if (x==0 && y==0) { //null island
        u.push(p)
      }
      else if(x<wb) { //west
        if (y > nb) { //north
          nw.push(p)
        }
        else if (y < sb) { //south
          sw.push(p)
        }
        else { //middle
          w.push(p)
        }

      }
      else if (x>eb) { //east
        if (y > nb) { //north
          ne.push(p)
        }
        else if (y < sb) { //south
          se.push(p)
        }
        else { //middle
          e.push(p)
        }
      }
      else { //middle
        if (y > nb) { //north
          n.push(p)
        }
        else if (y < sb) { //south
          s.push(p)
        }
        else { //middle
          //nothing
        }
      }

    })
    if(this._container) {
    let mapdiv =d3.select(this._container.parentNode.parentNode);
    mapdiv.select('.n').select('span').text(n.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.nw').select('span').text(nw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.ne').select('span').text(ne.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.w').select('span').text(w.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.e').select('span').text(e.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.sw').select('span').text(sw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.s').select('span').text(s.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.se').select('span').text(se.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    mapdiv.select('.unknown').select('span').text(u.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0));
    }
    markers.addData(c.filter(d=>(d.geometry.coordinates[0]!=0&&d.geometry.coordinates[1]!=0)));
    //    let fixed = c.filter(d=>!d.properties.cluster);
     //   createChildren(fixed,data.records,map);
        
        //todo  create lijsten met locaties: zowel de fixed points als de personen
        //maak links tussen fixed points en personen
      
	}
}



function createClusterIcon(feature, latlng) {
    var count = feature.properties.point_count!==undefined?feature.properties.point_count:1;
    var size =
        count < 100 ? 'small' :
        count < 1000 ? 'medium' : 'large';
    var icon = L.divIcon({
        html: '<div><span>' + count + '</span></div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(40, 40)
    });
    return L.marker(latlng, {icon: icon});
}

function createChildren(locations,data,map) {	
	let results = locations.reduce((a,c)=>a.concat(filterActive(data,c,map)),[]);
//	createGraph(results,locations)
}

function filterActive(data,loc,map) {	
	let point = map.latLngToLayerPoint(new L.LatLng(loc.geometry.coordinates[1],loc.geometry.coordinates[0]));	
	let result = data.filter(d=>d.loc==loc.properties.id);
	
	return result.map(d=>{d.xp=point.x,d.yp=point.y;return d})
}

function createGraph(nodes,loc) {

	let sim = d3.forceSimulation(nodes)
	.velocityDecay(0.2)
    .force("x", d3.forceX(d=>d.xp).strength(0.2))
    .force("y", d3.forceY(d=>d.yp).strength(0.2))
    .force("collide", d3.forceCollide().radius(8).iterations(2))
   
	    .on("tick", ticked);
	
	
	let g = svgmap.append("g"),
	    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");


	function ticked() {
	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })

	 
	}
	// Apply the general update pattern to the nodes.
	  node = node.data(nodes, function(d) { return d.id;});
	  node.exit().remove();
	  node = node.enter().append("circle").attr("fill","blue").attr("r", 8).merge(node);

	
	  // Update and restart the simulation.
	  sim.nodes(nodes);
	  sim.restart();
	}
/*
function projectPoint(latlon) {	
	var point = map.latLngToLayerPoint(new L.LatLng(latlon[1],latlon[0]));	
	return point;
}


function createVLinks(data,locs) {	
	let links = [];
	
	data.records.receivers.map(s=>{
		let source = locs.filter(l=>{return l.id === s.loc})[0];
		links.push({source:source,target:s});
	})
	return links;
}
*/

/*
	 fromsimulation
      .nodes(swirly)
      .on("tick", drawSwirly);
     fromsimulation
      .force("geos",function(a,b,c){
    	for (var i = 0, n = swirly.length, node; i < n; ++i) {
    		node = swirly[i];
    		if(node.geometry.coordinates[0] != null) {
    			let pt = projectPoint(node.geometry.coordinates);
    			node.fx= pt.x;
    			node.fy = pt.y;
    		}    		
    	}
    })
	fromsimulation.force("link")
      .links(links)


        links = createVLinks(data,c)
        node = node.data(swirly, function(d) { return d.id;});
  		node.exit().remove();
  		node = node.enter().append("circle").attr("fill", 'blue').attr("r", 8).merge(node);
  		fromsimulation.restart()
function drawSwirly(d){
		node.attr('cx',d=>{
			// if(d.type==="location")
			return projectPoint(d.geometry.coordinates).x
			// else return d.x
			//return d.x
		  })
		  .attr('cy',d=>{
		 //  	if(d.type==="location")
			  return projectPoint(d.geometry.coordinates).y
			// else return d.y
			//return d.y
		  })
		 
		
	}
  		*/


// let locations = data.records.locations.map(p=>projectPoint(p));
		// locations.sort((a,b)=>b.cnt-a.cnt)		
		// let index =  kdbush(locations, (p) => p.x, (p) => p.y, 32, Int32Array);	 
		// let results = locations.map(l=>index.within(l.x,l.y,l.cnt/total*20).map(id=>locations[id]))
		