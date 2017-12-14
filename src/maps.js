import * as L from 'leaflet'
import supercluster from 'supercluster'
import * as d3 from 'd3'
import {createGeojson} from './utils/utils'

let maps = ['from','to'].map(d=>initMap(d))

export function createMapData(data) {
  maps.map(m=>{
    var features = []
    data.records.forEach(r=> {
      features.push(createGeojson(r,m.src))        
    })
    createCluster(m.map,m.markers,features)
    
  })

}
export function createMapResult(data) {
  //data in -> filter punten from/to
  //if search -> create select/noselect
  // loop door search resultaten en voeg een search = 1 toe aan DATA
  // maak to/from geojsons
  // maak clusters, met count en searchcount
  
  maps.map(m=>{
    var features = []
    data.forEach(r=> {
      features.push(createGeojson(r,m.src))        
    })
    createCluster(m.map,m.results,features,m.src)    
  })


}

function initMap(el) {
  let map = L.map(el+'map').setView([0,0], 1)
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
  return L.marker(latlng, {icon: icon,bubblingMouseEvents:true, forceZIndex:1})
}

function createSearchIcon(feature, latlng) {
  var count = feature.properties.point_count!==undefined?feature.properties.point_count:1
  var cls = feature.properties.id?feature.properties.id:feature.properties.ids.reduce((a,c)=>a+' '+c,'')      
  var size =
    count < 100 ? 'small' :
      count < 1000 ? 'medium' : 'large'
  var icon = L.divIcon({
    html: '<div><span>' + count + '</span></div>',
    className: 'search-cluster search-cluster-' + size+ ' '+cls,
    iconSize: L.point(40, 40)
  })
  return L.marker(latlng, {icon: icon,forceZIndex: 1000,riseOnHover:true})  
}

function createPopup(layer,index) {
  let brieven = [];
  if(layer.feature.properties.cluster) {
    brieven = index.getLeaves(layer.feature.properties.cluster_id,Infinity).map(b=>b.properties.name)
  }
  else {
    brieven.push(layer.feature.properties.name)
  }
  return brieven.filter((v,i,s)=>s.indexOf(v)===i).toString()
}

function createCluster(map,markers,features,search) {  
  if (search && map._events.moveend.length>4)  map.off('moveend', map._events.moveend[4].fn)   
  let index = supercluster({
    radius: 40,
    maxZoom: 20,
    initial: function() { return {ids: []} },
    map: function(props) { return {ids: props.id} },
    reduce: function(accumulated, props) {
      if(typeof(props.ids)==='string' && accumulated.ids.indexOf(props.ids)<0) {
        accumulated.ids.push(props.ids)     
      }
      else if (typeof(props.ids)!=='string') {        
        props.ids.forEach(p=> {
          if(accumulated.ids.indexOf(p)<0) {
            accumulated.ids.push(p)
          }
        })
      }      
      return accumulated
    }
  })
  index.load(features)
  map.on('moveend', ()=>update(search))
  update(search)
  
  function update(search) {	
    let bbox = map.getBounds()
    let c = index.getClusters([-180,-90,180,90],map.getZoom())
    
    markers.clearLayers()
    
    let wb = bbox.getWest()
    let eb = bbox.getEast()
    let nb = bbox.getNorth()
    let sb = bbox.getSouth()

    let nw=[],n=[],ne=[],w=[],u=[],e=[],sw=[],s=[],se=[]
    c.forEach(p=>{
      let x = p.geometry.coordinates[0]
      let y = p.geometry.coordinates[1]
      if ((x==0 || x==null) && (y==0||y==null)) { //null island
        u.push(p)
      }
      else if(x<wb) { //west
        if (y > nb) { //north
          nw.push(p)
        }
        else if (y < sb) { //south
          sw.push(p)
        }
        else { //middle
          w.push(p)
        }

      }
      else if (x>eb) { //east
        if (y > nb) { //north
          ne.push(p)
        }
        else if (y < sb) { //south
          se.push(p)
        }
        else { //middle
          e.push(p)
        }
      }
      else { //middle
        if (y > nb) { //north
          n.push(p)
        }
        else if (y < sb) { //south
          s.push(p)
        }
        else { //middle
          //nothing
        }
      }

    })
    if(search) {
      let mapdiv =d3.select('#'+search+'-card')
      mapdiv.select('.n').on('click',()=>map.panBy([0,-200])).select('span').text(n.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.nw').on('click',()=>map.panBy([-200,-200])).select('span').text(nw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.ne').on('click',()=>map.panBy([200,-200])).select('span').text(ne.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.w').on('click',()=>map.panBy([-200,0])).select('span').text(w.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.e').on('click',()=>map.panBy([200,0])).select('span').text(e.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.sw').on('click',()=>map.panBy([-200,200])).select('span').text(sw.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.s').on('click',()=>map.panBy([0,200])).select('span').text(s.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.se').on('click',()=>map.panBy([200,200])).select('span').text(se.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
      mapdiv.select('.unknown').text('Unknown: '+u.reduce((a,c)=>a+(c.properties.point_count?c.properties.point_count:1),0))
    }
    markers.unbindPopup()
    markers.addData(c.filter(d=>(d.geometry.coordinates[0]!=0&&d.geometry.coordinates[1]!=0)))
   if(search) markers.bindPopup(function(layer){return createPopup(layer,index)})
  }
  return index
}


d3.select('#resetButton-from').on('click',()=>{
  maps[0].map.setView([0,0], 1)
})
d3.select('#resetButton-to').on('click',()=>{
  maps[1].map.setView([0,0], 1)
})