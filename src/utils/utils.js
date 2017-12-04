export function createLocation(record,src,same) {
  let properties =  {
    'id':record[src+'Loc'],
    'accuracy':record[src+'Accuracy'],
    cnt:1,
    tocnt:0,
    fromcnt:0
  }
  properties[src+'cnt'] = 1
  if(same) properties.tocnt = 1
  return {
    'type':'Feature',
    'geometry':
      {'type':'Point',
        'coordinates':[record[src+'Lon'],record[src+'Lat']]
      },
    properties: properties
  }
}

export function createGeojson(record,src) {
  return {
    'type':'Feature',
    'geometry':
      {'type':'Point',
        'coordinates':[record[src+'Lon'],record[src+'Lat']]
      },
    properties: {
      'id':record[src+'Loc'],
      'accuracy':record[src+'Accuracy'],
      'personid': record[src+'Id'],
      'briefid': record.id,
      'src': src,
      'selected': record.selected!==undefined?1:0
    }
  }
}