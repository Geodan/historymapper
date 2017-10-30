L.svg().addTo(map);	
let svgmap = d3.select("#map").select("svg");
svgmap.attr('pointer-events',null)
L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
let markers = L.geoJson(null, {
    pointToLayer: createClusterIcon
}).addTo(map);

function renderMap(data) {	
	let index = supercluster({
	    radius: 40,
	    maxZoom: 16,
	    initial: function() { return {cnt: 0}; },
    	map: function(props) { return {cnt: props.cnt}; },
   		reduce: function(accumulated, props) { accumulated.cnt += props.cnt; }
	});
	index.load(data.records.locations);
	map.on("moveend", update);    
	update();
	function update() {	
		svgmap.selectAll('g').remove();
		let bbox = map.getBounds();
		let c = index.getClusters([bbox.getWest(),bbox.getSouth(),bbox.getEast(),bbox.getNorth()],map.getZoom())
		markers.clearLayers();
        markers.addData(c);
        let fixed = c.filter(d=>!d.properties.cluster);
        createChildren(fixed,data.records);
        
        //todo  create lijsten met locaties: zowel de fixed points als de personen
        //maak links tussen fixed points en personen
      
	}
}

function createClusterIcon(feature, latlng) {
    var count = feature.properties.cnt;
    var size =
        count < 100 ? 'small' :
        count < 1000 ? 'medium' : 'large';
    var icon = L.divIcon({
        html: '<div><span>' + feature.properties.cnt + '</span></div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(40, 40)
    });
    return L.marker(latlng, {icon: icon});
}

function createChildren(locations,data) {	
	let results = locations.reduce((a,c)=>a.concat(filterActive(data,c)),[]);
	createGraph(results,locations)
}

function filterActive(data,loc) {	
	let point = map.latLngToLayerPoint(new L.LatLng(loc.geometry.coordinates[1],loc.geometry.coordinates[0]));	
	let rec = data.receivers.filter(d=>d.loc==loc.properties.id);
	let result = rec.concat(data.senders.filter(d=>d.loc==loc.properties.id));	
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
		