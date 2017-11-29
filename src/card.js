let card = d3.select('#content-card-text');

function createCard(id,type) {
  switch (type) {
    case 'person':
        let person = DATA.sleutel.filter(d=>d.id == id)[0];
        //TODO: check validity person
        formatPersonCard(person);
      break;
    case 'brief':
        let brief = DATA.records.filter(d=>d.id == id)[0];
        //TODO: check validity brief
        formatBriefCard(brief);
      break;
    default:
      break;
  }
}

function formatPersonCard(data) {
  card.html("");
  let name = checkEmpty(data.properties.name);
  let alternatives = checkEmpty(data.properties.alternatives);
  let tags = checkEmpty(data.properties.tags);
  let description = checkEmpty(data.properties.description);
  let relations = LINKS.filter(d=>(d.source.id==data.id||d.target.id==data.id))  
  card.append('h2').text('Name: ')
    .append('span')
    .classed('search',()=>name?true:false)
    .text(d=>name?name:'unkown')
    .on('click',d=>name?goSearch(name):false)  
    .on('mouseover',d=>{
      d3.select('#person-'+data.id)
      .classed('hilight',true)
    })
    .on('mouseout',d=>{
      d3.select('#person-'+data.id)
      .classed('hilight',false)
    })
  card.append('div').classed('label',true).text('Alternatives');
  card.append('div').classed('labelcontent',true).text(d=>alternatives?alternatives:'-');
  card.append('div').classed('label',true).text('Description');
  card.append('div').classed('labelcontent',true).text(d=>description?description:'-');
  card.append('div').classed('label',true).text('Tags');
  tags?tags.forEach(tag=>card.append('span').classed('tags click',true).text(tag).on('click',d=>goSearch(tag))):card.append('div').classed('labelcontent',true).text(d=>'-');

  card.append('div').classed('label',true).text('Relations');
  let relationDiv = card.append('table');
  relationDiv.append('tr').html('<th>from</th><th>to</th><th>record</th><th>link</th>')
  relations.forEach(d=>{
   
    let rd = relationDiv.append('tr');
    
   let ftd= rd.append('td');
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
    ftd.append('span').classed('search icon',true).text('s').on('click',()=>goSearch(d.target.properties.name))


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
    ttd.append('span').classed('search icon',true).text('s').on('click',()=>goSearch(d.source.properties.name))

    rd.append('td').append('span').classed('click',true).text('details').on('click',()=>createCard(d.recordId,'brief'))
    rd.append('td').append('span').classed('click',checkEmpty(d.properties.url)?true:false).text(checkEmpty(d.properties.url)?'link':'-').on('click',()=>createCard(d.recordId,'brief'))
  })
  
  
 
}

function formatBriefCard(data) {
  card.html("");
  let fromname = checkEmpty(data.properties.fromname);
  let fromlocation = checkEmpty(data.properties.fromlocation);
  let toname = checkEmpty(data.properties.toname);
  let tolocation = checkEmpty(data.properties.tolocation);
  let tags = checkEmpty(data.properties.tags);
  let description = checkEmpty(data.properties.description);
  let url = checkEmpty(data.properties.url)
  let from = card.append('div').classed('frompart',true);
  let to = card.append('div').classed('topart',true);
  from.append('div').classed('label',true).text('From');
  from.append('div')
    .classed('labelcontent',true)
    .classed('click',()=>fromname?true:false)
    .text(d=>fromname?fromname:'unknown')
    .on('click',d=>fromname?goSearch(fromname):false)
    .on('mouseover',d=>{
      d3.select('#person-'+data.fromId)
      .classed('hilight',true)      
      d3.select('#link-'+data.toId+'-'+data.fromId)
      .classed('hilight',true)
    })
    .on('mouseout',d=>{
      d3.select('#person-'+data.fromId)
      .classed('hilight',false)
      d3.select('#link-'+data.toId+'-'+data.fromId)
      .classed('hilight',false)
    })
  
  from.append('div').classed('labelcontent',true).classed('click',()=>fromlocation?true:false).text(d=>fromlocation?fromlocation:'unknown').on('click',d=>fromlocation?goSearch(fromlocation):false)
  to.append('div').classed('label',true).text('To');
  to.append('div').classed('labelcontent',true)
    .classed('click',()=>toname?true:false)
    .text(d=>toname?toname:'unknown')
    .on('click',d=>toname?goSearch(toname):false)
    .on('mouseover',d=>{
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
  to.append('div').classed('labelcontent',true).classed('click',()=>tolocation?true:false).text(d=>tolocation?tolocation:'unknown').on('click',d=>tolocation?goSearch(tolocation):false)
  card.append('div').classed('label',true).text('Description');
  card.append('div').classed('labelcontent',true).text(d=>description?description:'-');
  card.append('div').classed('label',true).text('Tags');
  tags?tags.forEach(tag=>card.append('span').classed('tags click',true).text(tag).on('click',d=>goSearch(tag))):card.append('div').classed('labelcontent',true).text(d=>'-');
  
  
  
}

