import * as L from 'leaflet'
import supercluster from 'supercluster'

export function createMapData(data) {

}

function initMap(el) {
  let map = L.map(el+'map').setView([0,0], 2)
  L.tileLayer( 'https://stamen-tiles-' + ['a', 'b', 'c', 'd'][Math.random() * 4 | 0] + '.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  let markers = L.geoJson(null, {
    opacity: 0.3,
    pointToLayer: createClusterIcon
  }).addTo(map)
  let results = L.geoJson(null, {
    pointToLayer: createSearchIcon
  }).addTo(map)

  return {map:map, markers: markers, src:el, results: results}
}

let maps = ['from','to'].map(d=>initMap(d))


function createClusterIcon(feature, latlng) {
  var count = feature.properties.point_count!==undefined?feature.properties.point_count:1
  var size =
    count < 100 ? 'small' :
      count < 1000 ? 'medium' : 'large'
  var icon = L.divIcon({
    html: '<div><span></span></div>',
    className: 'marker-cluster marker-cluster-' + size,
    iconSize: L.point(40, 40)
  })
  return L.marker(latlng, {icon: icon})
}

function createSearchIcon(feature, latlng) {
  var count = feature.properties.point_count!==undefined?feature.properties.point_count:1
  var size =
    count < 100 ? 'small' :
      count < 1000 ? 'medium' : 'large'
  var icon = L.divIcon({
    html: '<div><span>' + count + '</span></div>',
    className: 'search-cluster search-cluster-' + size,
    iconSize: L.point(40, 40)
  })
  return L.marker(latlng, {icon: icon,forceZIndex: 1000})
}
