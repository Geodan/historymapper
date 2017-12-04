export function trim(str) {
  if (str && typeof(str.replace) == 'function') {
    return str.replace(/^\s+|\s+$/g, '')
  }
  return ''
}