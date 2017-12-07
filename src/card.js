import * as d3 from 'd3'
import {checkEmpty} from './utils/checkEmpty'
import {capitalizeFirstLetter} from './utils/utils'
import {goSearch} from './search'

let card = d3.select('#content-card-text')
let DATA //TODO: somehow get the data
let LINKS //TODO: somehow get the data

export function setCardData(data,links) {
  DATA = data
  LINKS = links
}

export function createCard(id, type) {  
//TODO check for hilights?
  switch (type) {
  case 'person': {
    let person = DATA.sleutel.filter(d=>d.id == id)[0]
    //TODO: check validity person
    formatPersonCard(person)
    break
  }
  case 'brief': {
    let brief = DATA.records.filter(d=>d.id == id)[0]
    //TODO: check validity brief
    formatBriefCard(brief)
    break
  }    
  }
}

function createLabelContent(card, data, tag, search) {
  let value = checkEmpty(data.properties[tag])
  card.append('div').classed('label',true).text(capitalizeFirstLetter(tag))
  card.append('div').classed('labelcontent',true).text(()=>value?value:'-')

  
}

function formatPersonCard(data) {
  card.html('')
  let name = checkEmpty(data.properties.name)
  let tags = checkEmpty(data.properties.tags)
  let relations = LINKS.filter(d=>(d.source.id==data.id||d.target.id==data.id))  
  card.append('h2')
    .append('span')
    .classed('search',()=>name?true:false)
    .text(()=>name?name:'unkown')
    .on('click',()=>name?goSearch(name):false)  
    .on('mouseover',()=>{
      d3.select('#person-'+data.id)
        .classed('hilight',true)
    })
    .on('mouseout',()=>{
      d3.select('#person-'+data.id)
        .classed('hilight',false)
    })
    .append('span')
    .classed('icon small',true)
    .text(' s')
    for(let key in data.properties) {
      if(key!=='name'&&key!=='id'&&key!=='color'&&key!=='colorLabel'&&key!=='tags') {
        createLabelContent(card,data,key)
      }
    }
    
  card.append('div').classed('label',true).text('Tags')
  tags?tags.forEach(tag=>card.append('span').classed('tags search',true)
    .html(tag+'<span class="icon small"> s</span>').on('click',()=>goSearch(tag))):card.append('div').classed('labelcontent',true)
    .text(()=>'-')
  
  let relationDiv = card.append('table')
  relationDiv.append('tr').html('<th>from</th><th>to</th><th>record</th><th>link</th>')
  relations.forEach(d=>{
   
    let rd = relationDiv.append('tr')
    
    let ftd= rd.append('td')
    ftd.append('span').classed('click',true).text(d.target.properties.name)
      .on('click',()=>createCard(d.target.id,'person'))
      .on('mouseover',()=>{
        d3.select('#person-'+d.target.id)
          .classed('hilight',true)      
        d3.select('#link-'+d.source.id+'-'+d.target.id)
          .classed('hilight',true)
      })
      .on('mouseout',()=>{
        d3.select('#person-'+d.target.id)
          .classed('hilight',false)
        d3.select('#link-'+d.source.id+'-'+d.target.id)
          .classed('hilight',false)
      })
    ftd.append('span').classed('search icon',true)
      .text('s').on('click',()=>goSearch(d.target.properties.name))

    let ttd = rd.append('td');
    ttd.append('span').classed('click',true).text(d.source.properties.name)
      .on('click',()=>createCard(d.source.id,'person'))
      .on('mouseover',()=>{
        d3.select('#person-'+d.source.id)
          .classed('hilight',true)      
        d3.select('#link-'+d.source.id+'-'+d.target.id)
          .classed('hilight',true)
      })
      .on('mouseout',()=>{
        d3.select('#person-'+d.source.id)
          .classed('hilight',false)
        d3.select('#link-'+d.source.id+'-'+d.target.id)
          .classed('hilight',false)
      })
    ttd.append('span').classed('search icon',true)
      .text('s').on('click',()=>goSearch(d.source.properties.name))

    rd.append('td').append('span').classed('click',true)
      .text('details').on('click',()=>createCard(d.recordId,'brief'))
    rd.append('td').append('span').classed('click',checkEmpty(d.properties.url)?true:false)
      .text(checkEmpty(d.properties.url)?'link':'-').on('click',()=>createCard(d.recordId,'brief'))
  })



}

function formatBriefCard(data) {
  card.html('')
  let fromname = checkEmpty(data.properties.fromname)
  let fromlocation = checkEmpty(data.properties.fromlocation)
  let toname = checkEmpty(data.properties.toname)
  let tolocation = checkEmpty(data.properties.tolocation)
  let tags = checkEmpty(data.properties.tags)
  let description = checkEmpty(data.properties.description)
  //let url = checkEmpty(data.properties.url)
  let people = card.append('div').classed('content__people',true)
  let from = people.append('div').classed('frompart',true).classed('content__people-address',true)
  let to = people.append('div').classed('topart',true).classed('content__people-address',true)
  from.append('div').classed('label',true).text('From')
  from.append('div')    
    .classed('click',()=>fromname?true:false)
    .text(()=>fromname?fromname:'unknown')
    .on('click',()=>createCard(data.properties.fromid,'person'))
    .on('mouseover',()=>{
      d3.select('#person-'+data.fromId)
        .classed('hilight',true)      
      d3.select('#link-'+data.toId+'-'+data.fromId)
        .classed('hilight',true)
    })
    .on('mouseout',()=>{
      d3.select('#person-'+data.fromId)
        .classed('hilight',false)
      d3.select('#link-'+data.toId+'-'+data.fromId)
        .classed('hilight',false)
    })
  
  from.append('div').classed('search',true).classed('click',()=>fromlocation?true:false)
    .text(()=>fromlocation?fromlocation:'unknown')
    .on('click',()=>fromlocation?goSearch(fromlocation):false)
  to.append('div').classed('label',true).text('To')
  to.append('div').classed('click',true)
    .classed('click',()=>toname?true:false)
    .text(()=>toname?toname:'unknown')
    .on('click',()=>createCard(data.properties.toid,'person'))
    .on('mouseover',()=>{
      d3.select('#person-'+data.toId)
        .classed('hilight',true)      
      d3.select('#link-'+data.toId+'-'+data.fromId)
        .classed('hilight',true)
    })
    .on('mouseout',d=>{
      d3.select('#person-'+data.toId)
        .classed('hilight',false)
      d3.select('#link-'+data.toId+'-'+data.fromId)
        .classed('hilight',false)
    })
  to.append('div').classed('search',true)
    .classed('click',()=>tolocation?true:false)
    .text(()=>tolocation?tolocation:'unknown')
    .on('click',()=>tolocation?goSearch(tolocation):false)
  card.append('div').classed('label',true).text('Description')
  card.append('div').classed('labelcontent',true).text(()=>description?description:'-')
  card.append('div').classed('label',true).text('Tags')
  tags?tags.forEach(tag=>card.append('span').classed('tags click',true)
    .text(tag).on('click',()=>goSearch(tag))):card.append('div')
    .classed('labelcontent',true).text(()=>'-')
}
