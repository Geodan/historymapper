let varobj = getUrlVars();

if(varobj.url) getData(varobj.url)
else getData('1tZFtz3UKRoLUzDR26wtcQ4OhQCcK4kL-to-SY-bmW2M',true)

function getData(e,n) {
  if(n) insertParam('url',e);
  var url = parseGoogleSpreadsheetURL(e);
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

(function(global){
  var MarkerMixin = {
    _updateZIndex: function (offset) {
      this._icon.style.zIndex = this.options.forceZIndex ? (this.options.forceZIndex + (this.options.zIndexOffset || 0)) : (this._zIndex + offset);
    },
    setForceZIndex: function(forceZIndex) {
      this.options.forceZIndex = forceZIndex ? forceZIndex : null;
    }
  };
  if (global) global.include(MarkerMixin);
})(L.Marker);