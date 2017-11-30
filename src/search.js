import {Fuse} from 'fuse.js'

let briefOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 40,
  maxPatternLength: 16,
  minMatchCharLength: 1,
  tokenize: false,
  keys: [
    '"properties.description',
    'properties.fromname',
    'properties.tags',
    'properties.fromlocation',
    'properties.toname',
    'properties.tolocation'
  ]
}
let sleutelOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 40,
  maxPatternLength: 16,
  minMatchCharLength: 1,
  tokenize: false,
  keys: [
    'properties.alternatives',
    'properties.description',
    'properties.name',
    'properties.tags'
  ]
}      
export function keySearch (data) {
  return new Fuse(data,sleutelOptions)
}
export function recordSearch (data) {
  return new Fuse(data,briefOptions)
}
