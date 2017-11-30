export function insertParam(key, value)
{
  key = encodeURI(key); value = encodeURI(value)
  let kvp = document.location.search.substr(1).split('&')
  let i=kvp.length; var x; while(i--) {
    x = kvp[i].split('=')
    if (x[0]==key) {
      x[1] = value
      kvp[i] = x.join('=')
      break
    }
  }
  if(i<0) {kvp[kvp.length] = [key,value].join('=')}
  
  return kvp.join('&')
}