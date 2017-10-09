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

function renderMap(data) {
	let from = svgmap.selectAll('.from')
	  .data(data.records.records)
	  .enter()
	  .append('circle')
	  .attr('class','from')		
	  .attr('r',8)
	  .attr('fill','red')
	  .attr('stroke','white')
	  .attr('opacity',0.3);

	let to = svgmap.selectAll('.to')
	  .data(data.records.records)
	  .enter()
	  .append('circle')
	  .attr('class','to')
	  .attr('r',8)
	  .attr('fill','green')
	  .attr('stroke','white')
	  .attr('opacity',0.3)
	  .on('click',d=>console.log(d));

	map.on("moveend", update);    
	update();

	function update() {
		from.attr('cx',d=>projectPoint(d.fromlatitude,d.fromlongitude).x)
		  .attr('cy',d=>projectPoint(d.fromlatitude,d.fromlongitude).y)
		to.attr('cx',d=>projectPoint(d.tolatitude,d.tolongitude).x)
		  .attr('cy',d=>projectPoint(d.tolatitude,d.tolongitude).y)
	}
}