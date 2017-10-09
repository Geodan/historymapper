let sleutelTime = 0, dataTime = 0, form;

let colors = d3.scaleOrdinal(d3.schemeCategory20),
 	svg = d3.select("#graph"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    map = L.map('map').setView([0,0], 2),
    
    links = [],
    div = d3.select("#tooltip"),
    simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("radial", d3.forceRadial(height/16 , width / 2, height / 2))
    .force("link", d3.forceLink(links).strength(0.5).distance(20).iterations(10))
    .force("collide",d3.forceCollide( function(d){return d.linkCount*1.5 + 2 }).iterations(10)) ;

	

/*mapboxgl.accessToken = 'pk.eyJ1Ijoid2hlcmVjYW1wZXUiLCJhIjoieHE4bVNuRSJ9.qFTj9L2TMzVXX8G2QwJl_g';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9'
});*/