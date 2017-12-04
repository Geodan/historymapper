import * as d3 from 'd3'

import {setCardData,createCard} from './card'

let width = 600 //TODO: make this dynamic
let height = 600
let LINKS, node
let svg = d3.select('#graph')
let colors = d3.scaleOrdinal(d3.schemeCategory10)
let tooltip = d3.select('#tooltip')
let simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(function(d) { return d.id }))
  .force('charge', d3.forceManyBody())
  .force('radial', d3.forceRadial(height/16 , width / 2, height / 2))
  .force('link', d3.forceLink(LINKS).strength(0.5).distance(20).iterations(10))
  .force('collide',d3.forceCollide( function(d){return d.linkCount*1.5 + 2 }).iterations(10))

export function renderGraph(data) {
  LINKS = createLinks(data)
  setCardData(data,LINKS)
  let link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(LINKS)
    .enter().append('line')
    .attr('stroke-width', 1)
    .attr('id',d=>'link-'+d.source.id+'-'+d.target.id)

  node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data.sleutel)
    .enter().append('circle')
    .attr('r', d=>d.linkCount/4+3)
    .attr('id', d=>'person-'+d.id)
    .attr('fill', function(d){return colors(d.properties.color)})
    .on('click',d=>createCard(d.id,'person'))
    .on('dblclick', dblclick)      
    .on('mouseover',d=>{
      tooltip.transition()
        .duration(200)
        .style('opacity', .9)
      tooltip.html(formatPopup(d.properties))
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)

      node.style('opacity', 1)
      link.style('opacity', 1)    
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
  
  simulation
    .nodes(data.sleutel)
    .on('tick', ticked)

  simulation.force('link')
    .links(LINKS)

  function ticked() {
    link
      .attr('x1', function(d) { return d.source.x })
      .attr('y1', function(d) { return d.source.y })
      .attr('x2', function(d) { return d.target.x })
      .attr('y2', function(d) { return d.target.y })

    node
      .attr('cx', function(d) { return d.x = Math.max(6, Math.min(width - 6, d.x)) })
      .attr('cy', function(d) { return d.y = Math.max(6, Math.min(height - 6, d.y)) })
  }
}

function createLinks(data) {
  let ppl = data.sleutel
  let links = []
  data.records.map(r=>{
    let source = ppl.filter(p=>p.id === r.toId)[0],
      target = ppl.filter(p=>p.id === r.fromId)[0]
    if(source!==undefined && target !== undefined) {
      source.linkCount++
      target.linkCount++
      links.push({source:source,target:target,color: '#000',properties:r.properties,recordId:r.id})
    }
  })
  return links
}

function dragstarted(d) {
  d3.select(this).classed('fixed', d.fixed = true)
  if (!d3.event.active) simulation.alphaTarget(1).restart()
  d.fx = d.x
  d.fy = d.y
  
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0)
  
}
function dblclick(d) {
  d3.select(this).classed('fixed', d.fixed = false)
  d.fx = null
  d.fy = null
}

function formatPopup(data){
  let html = ''
  html+='<b>'+data.name+'</b><br/>'
  for(let key in data) {
    if(key!=='name'&&key!=='id'&&key!=='color'&&key!=='colorLabel'&&data[key]!==undefined&&data[key]!=='') {
      html+='<i>'+key+'</i>: '+data[key]+'<br/>'
    }
  }
  return html
}
