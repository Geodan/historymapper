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
