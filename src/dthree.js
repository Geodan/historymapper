function formatPopup(data){
  let html = '';
  html+='<h4>'+data.name+'</h4>';
  for(key in data) {
    if(key!=='name'&&key!=='color'&&key!=='colorLabel'&&data[key]!==undefined&&data[key]!=='') {
      html+='<p>'+key+': '+data[key]+'</p>';
    }
  }
  return html;
}


function renderGraph(data) {
  links = createLinks(data);  
  let link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", 1);

  let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.sleutel)
    .enter().append("circle")
      .attr("r", d=>d.linkCount/4+3)
      .attr("fill", function(d){return colors(d.properties.color)})
      .on("dblclick", dblclick)
      .on("mouseover",d=>{
        div.transition()
         .duration(200)
         .style("opacity", .9);
        div.html(formatPopup(d.properties))
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       })
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
  
  simulation
      .nodes(data.sleutel)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x = Math.max(6, Math.min(width - 6, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(6, Math.min(height - 6, d.y)); });
  }
}

function createLinks(data) {
  let ppl = data.sleutel;
  let links = [];
  data.records.records.map(r=>{
    let source = ppl.filter(p=>p.id === r.toid)[0],
    target = ppl.filter(p=>p.id === r.fromid)[0];
    if(source!==undefined && target !== undefined) {
      source.linkCount++;
      target.linkCount++;
      links.push({source:source,target:target,color: '#000'})
    }
  })
  return links;
}


function dragstarted(d) {
  d3.select(this).classed("fixed", d.fixed = true);
  if (!d3.event.active) simulation.alphaTarget(1).restart();
  d.fx = d.x;
  d.fy = d.y;
  
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  
}
function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
  d.fx = null;
  d.fy = null;
}

