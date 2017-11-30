import {trim} from './trim'
import {isEmptyObject} from './isEmptyObject'

export function extractData(item) {
  var item_data = {}
  for (let k in item) {
    if (k.indexOf('gsx$') == 0) {
      item_data[k.substr(4)] = trim(item[k].$t)
    }
  }
  if (isEmptyObject(item_data)) return null
  return item_data
}
