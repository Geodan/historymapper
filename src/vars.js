let sleutelTime = 0, dataTime = 0, form, recordid =0;
let SEARCHBRIEF,SEARCHSLEUTEL;


let colors = d3.scaleOrdinal(d3.schemeCategory20),
svg = d3.select("#graph"),
 width = +svg.attr("width"),
 height = +svg.attr("height"),
 map = L.map('map').setView([0,0], 2),
 
 LINKS = [],
 div = d3.select("#tooltip"),
 simulation = d3.forceSimulation()
 .force("link", d3.forceLink().id(function(d) { return d.id; }))
 .force("charge", d3.forceManyBody())
 .force("radial", d3.forceRadial(height/16 , width / 2, height / 2))
 .force("link", d3.forceLink(LINKS).strength(0.5).distance(20).iterations(10))
 .force("collide",d3.forceCollide( function(d){return d.linkCount*1.5 + 2 }).iterations(10)) ;