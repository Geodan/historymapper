
form = document.getElementById("searchForm"); 
form.addEventListener('submit', goSearch);
form.addEventListener('input', goSearch);

let brieven = [], sleutels =[];

function goSearch(e) {
  e.preventDefault();
  brieven = SEARCHBRIEF.search(e.target.value);
  sleutels = SEARCHSLEUTEL.search(e.target.value);  
  
  
  let briefdata  =  briefresults
  .selectAll('div').data(brieven,function(d) { return d.id; })
  
  briefdata.enter()
  .append('div')
  .merge(briefdata)
  .text(d=>d.properties.fromname+ " - " + d.properties.toname)
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

  briefdata.exit().remove()
  
  let persondata  =  personresults
  .selectAll('div').data(sleutels,function(d) { return d.id; })
  
  persondata.enter()
  .append('div')
  .merge(persondata)
  .text(d=>d.properties.name+ " - " + d.properties.alternatives)
  .on('mouseover',d=>{
    d3.select('#person-'+d.id)
    .classed('hilight',true)
  })
  .on('mouseout',d=>{
    d3.select('#person-'+d.id)
    .classed('hilight',false)
  })
  persondata.exit().remove()

}
let briefresults =  d3.select('#searchbrieven')
let personresults =  d3.select('#searchmensen')

