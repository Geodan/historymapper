form = document.getElementById("spreadsheetForm"); 
form.addEventListener('submit', getData);

function getData(e) {
  e.preventDefault();
  var sourceUrlElement = document.getElementById('source-url');
  var sourceUrl = sourceUrlElement.value == '' ? sourceUrlElement.placeholder:sourceUrlElement.value;
  var url = parseGoogleSpreadsheetURL(sourceUrl);
  var requests =[new Request(buildGoogleFeedURL(url.key,1)),new Request(buildGoogleFeedURL(url.key,2))];
  getResults(requests);
  //auto updating funciton
  /*window.setInterval(e=>{
    getResults(requests)
  },30000)*/
}

function getResults(requests) {
  return Promise.all(requests.map(url =>
    fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(error => error)
  ))
  .then(results => parseResults(results))
}

d3.selectAll('.enableButton').on('click',()=>{
  toggleClass(d3.event.target,'enabled')
  toggleClass('#'+d3.select(d3.event.target).attr('element'),'hidden');
})
d3.selectAll('.resetButton').on('click',()=>{
  let card =  d3.select(d3.event.target).attr('card')
  switch (card) {
    case 'search':
      goSearch('');
      
      break;
    case 'card':
      card.html("");
      break;
    case 'graph':
    d3.selectAll(".fixed")
    .classed('fixed',false)
    .select(d=>d.fx=d.fy=null)
    
      d3.selectAll('.nodes circle').classed('unselected hilight',false)
      d3.selectAll('.links line').classed('unselected hilight',false)
      simulation.alphaTarget(1).restart();
      window.setTimeout( ()=>simulation.alphaTarget(0).restart(),500)
      break;
    case 'from':
      
      break;
    case 'to':
      
      break;
      
    default:
      break;
  }
})

function toggleClass(el, clas) {
  d3.select(el).classed(clas,d3.select(el).classed(clas)?false:true);
}