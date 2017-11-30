import {trim} from './trim'

export function isEmptyObject(o) {
  var properties = []
  if (Object.keys) {
    properties = Object.keys(o)
  } else { // all this to support IE 8
    for (var p in o) if (Object.prototype.hasOwnProperty.call(o,p)) properties.push(p)
  }
  for (var i = 0; i < properties.length; i++) {
    var k = properties[i];
    if (o[k] != null && typeof o[k] != 'string') return false
    if (trim(o[k]).length != 0) return false
  }
  return true
}