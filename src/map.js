L.svg().addTo(map);	
let svgmap = d3.select("#map").select("svg");
svgmap.attr('pointer-events',null)
L.tileLayer( "https://stamen-tiles-" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function projectPoint(lat,lon) {
	var point = map.latLngToLayerPoint(new L.LatLng(lat,lon));
	return point;
}

function createVLinks(data) {
	let locs = data.records.locations;
	let links = [];
	data.records.senders.map(s=>{
		let source = locs.filter(l=>{return l.id === s.loc})[0];
		links.push({source:source,target:s});
	})
	data.records.receivers.map(s=>{
		let source = locs.filter(l=>{return l.id === s.loc})[0];
		links.push({source:source,target:s});
	})
	return links;
}
function renderMap(data) {
	let links = createVLinks(data);
	let locations = data.records.locations;

	/*let fromsimulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.loc }))
    .force("charge", d3.forceManyBody())
    .force("collide",d3.forceCollide( function(d){return d.accuracy  }).iterations(10)) ;



	let from = svgmap.selectAll('.from')
	  .data(locations)
	  .enter()
	  .append('circle')
	  .attr('class','from')		
	  .attr('r',d=>d.cnt?d.cnt/1330*20+3:3)
	  .attr('fill','blue')
	  .attr('stroke','white')
	  .attr('opacity',0.3);

	 fromsimulation
      .nodes(locations)
      .on("tick", update);
     fromsimulation
      .force("geos",function(a,b,c){
    	for (var i = 0, n = locations.length, node; i < n; ++i) {
    		node = locations[i];
    		if(node.lat != null) {
    			let pt = projectPoint(node.lat,node.lon);
    			node.fx= pt.x;
    			node.fy = pt.y;
    		}
    	}
    })
	fromsimulation.force("link")
      .links(links)*/
      

	map.on("zoomend", update);    
	update();

	function update(e) {	
console.log(e)
		from.attr('cx',d=>{
			// if(d.type==="location")
			//  return projectPoint(d.lat,d.lon).x
			// else return d.x
			return d.x
		  })
		  .attr('cy',d=>{
		 //  	if(d.type==="location")
			//  return projectPoint(d.lat,d.lon).y
			// else return d.y
			return d.y
		  })
		 
		}
	


}