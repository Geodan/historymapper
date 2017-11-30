export function getUrlVars() {
  let varobj = {}, url_vars = [], uv
  
  url_vars = window.location.href.slice(window.location.href.indexOf('?') + 1)

  if (url_vars.match('#')) {
    url_vars = url_vars.split('#')[0]
  }
  url_vars = url_vars.split('&')

  for(let i = 0; i < url_vars.length; i++) {
    uv = url_vars[i].split('=')
    varobj[uv[0]] = uv[1]
  }

  return varobj
}