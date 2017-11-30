
form = document.getElementById("searchForm"); 
form.addEventListener('submit', submitSearch);
form.addEventListener('input', submitSearch);

let brieven = [], sleutels =[];

function submitSearch(e) {
  e.preventDefault();
  goSearch(e.target.value,true);
}

function goSearch(e,search) {
  if(!search)document.getElementById('search-text').value = e;
  //todo: update searchfield
  brieven = SEARCHBRIEF.search(e);
  sleutels = SEARCHSLEUTEL.search(e);  
  
  d3.selectAll('.nodes circle').classed('unselected',true)
  d3.selectAll('.links line').classed('unselected',true)
  brieven.forEach(d=>{
    d3.select('#person-'+d.fromId).classed('unselected',false);
    d3.select('#person-'+d.toId).classed('unselected',false);
    d3.select('#link-'+d.toId+'-'+d.fromId).classed('unselected',false)
  });
  sleutels.forEach(d=>d3.select('#person-'+d.id).classed('unselected',false))
  let briefdata  =  briefresults
  .selectAll('div').data(brieven,function(d) { return d.id; })
  
  let bel = briefdata.enter()
  .append('div')
  .classed('searchrecord',true)
  .merge(briefdata)  
  .on('mouseover',d=>{
    d3.select('#person-'+d.fromId)
    .classed('hilight',true)
    d3.select('#person-'+d.toId)
    .classed('hilight',true)
    d3.select('#link-'+d.toId+'-'+d.fromId)
    .classed('hilight',true)
  })
  .on('mouseout',d=>{
    d3.select('#person-'+d.fromId)
    .classed('hilight',false)
    d3.select('#person-'+d.toId)
    .classed('hilight',false)
    d3.select('#link-'+d.toId+'-'+d.fromId)
    .classed('hilight',false)
  })
  .html(d=>'<span class="fromname">'+d.properties.fromname+'</span><span class="toname">'+d.properties.toname+'</span>')
  .on('click',d=>createCard(d.id,'brief'))

  briefdata.exit().html('').remove()
  
  let persondata  =  personresults
  .selectAll('div').data(sleutels,function(d) { return d.id; })
  
  let pel = persondata.enter()
  .append('div')
  .classed('searchrecord',true)
  .merge(persondata)  
  .on('mouseover',d=>{
    d3.select('#person-'+d.id)
    .classed('hilight',true)
  })
  .on('mouseout',d=>{
    d3.select('#person-'+d.id)
    .classed('hilight',false)
  }).text(d=>d.properties.name).on('click',d=>createCard(d.id,'person'))

  persondata.exit().remove()
  createMapResult(brieven)
}
let briefresults =  d3.select('#searchbrieven')
let personresults =  d3.select('#searchmensen')
