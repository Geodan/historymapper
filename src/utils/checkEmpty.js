export function checkEmpty(attr) {
  if(attr===undefined) return false
  if(attr===null) return false
  if(attr==='') return false
  return attr
}