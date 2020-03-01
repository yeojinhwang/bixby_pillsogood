module.exports.function = function getInfo (name) {
  const base64 = require('base64')
  var console = require('secret')
  const service_key = secret.get('key')
  base64.decode(service_key)
  
  var http = require('http')
  var console = require('console')
  var config = require('config')
  
  var name_utf=encodeURI(name)
  // 이후 활용하는 정보가 없으므로 주석처리함
  // const url = config.get('urldetail') + '?ServiceKey='+ service_key + '&itemName='+ name_utf
  // var response = http.getUrl(url, {format: 'xmljs'})
  // var answer = response.response.body.items.item
  
  const url_info = config.get('urlinfo') + '?serviceKey='+ service_key + '&item_name='+ name_utf
  var res_info=http.getUrl(url_info, {format: 'xmljs'})
  var totalcount = res_info.response.body['totalCount']
  var ans_info = res_info.response.body.items.item
 
  const DetailInfo = new Array()
  if (totalcount >= 1){
    //1
    if (typeof(ans_info[0]) === 'object') {
        ans_info.forEach(function(content) {
        const url_detail = config.get('urldetail') + '?ServiceKey='+ service_key + '&itemName='+ encodeURI(content['ITEM_NAME'])
        var res_detail = http.getUrl(url_detail, {format: 'xmljs'})
        var ans_detail = res_detail.response.body.items.item
       
        //detail이 없는경우 1-1
        if(ans_detail === undefined){
           DetailInfo.push({
            pillname: name,
            name: content['ITEM_NAME'],
            image: {url: content['ITEM_IMAGE']},
            chart: content['CHART'],
            class: content['CLASS_NAME'],
            storage:'no result',
            pack: 'no result',
            nburl: 'no result',
            eeurl: 'no result',
            udurl: 'no result',
            material: 'no result'
          })
        }
        //1-2
        else if(ans_detail['ITEM_NAME']=== content['ITEM_NAME']){
          if(ans_detail['MATERIAL_NAME'][0] === undefined){
            material = "no result"
          }
          else {
            material = ans_detail['MATERIAL_NAME'].replace(/,,/gi,' ')
          }
          DetailInfo.push({
            pillname: name,
            name: ans_detail['ITEM_NAME'],
            image: {url: content['ITEM_IMAGE']},
            chart: ans_detail['CHART'],
            class: ans_detail['CLASS_NO'],
            storage : ans_detail['STORAGE_METHOD'],
            pack : ans_detail['PACK_UNIT'],
            nburl: ans_detail['NB_DOC_ID'],
            eeurl: ans_detail['EE_DOC_ID'],
            udurl: ans_detail['UD_DOC_ID'],
            material: material
          })
        }
        //이미지 없는경우 1-3
        else{
          if(ans_detail['MATERIAL_NAME'][0] === undefined){
            material = "no result"
          }
          else {
            material = ans_detail['MATERIAL_NAME'].replace(/,,/gi,' ')
          }
          DetailInfo.push({
            pillname: name,
            name: ans_detail['ITEM_NAME'],
            image: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
            chart: ans_detail['CHART'],
            class: ans_detail['CLASS_NO'],
            storage : ans_detail['STORAGE_METHOD'],
            pack : ans_detail['PACK_UNIT'],
            nburl: ans_detail['NB_DOC_ID'],
            eeurl: ans_detail['EE_DOC_ID'],
            udurl: ans_detail['UD_DOC_ID'],
            material: ans_detail['MATERIAL_NAME']
          })
         }
        })
    }
    //2
    else {
      const url_detail = config.get('urldetail') + '?ServiceKey='+ service_key + '&itemName='+ encodeURI(ans_info['ITEM_NAME'])
      var res_detail = http.getUrl(url_detail, {format: 'xmljs'})
      var ans_detail = res_detail.response.body.items.item
      
      //detail이 없는경우 2-1
      if(ans_detail === undefined){
        DetailInfo.push({
          pillname: name,
          name: ans_info['ITEM_NAME'],
          image: {url: ans_info['ITEM_IMAGE']},
          chart: ans_info['CHART'],
          class: ans_info['CLASS_NAME'],
          storage:'no result',
          pack: 'no result',
          nburl: 'no result',
          eeurl: 'no result',
          udurl: 'no result',
          material: 'no result'
        })
      }
      //2-2
      else if(ans_detail['ITEM_NAME'] === ans_info['ITEM_NAME']){
        if(ans_detail['MATERIAL_NAME'][0] === undefined){
          material = "no result"
        }
        else {
          material = ans_detail['MATERIAL_NAME'].replace(/,,/gi,' ')
        }
        DetailInfo.push({
          pillname: name,
          name: ans_detail['ITEM_NAME'],
          image: {url: ans_info['ITEM_IMAGE']},
          chart: ans_detail['CHART'],
          class: ans_detail['CLASS_NO'],
          storage : ans_detail['STORAGE_METHOD'],
          pack : ans_detail['PACK_UNIT'],
          nburl: ans_detail['NB_DOC_ID'],
          eeurl: ans_detail['EE_DOC_ID'],
          udurl: ans_detail['UD_DOC_ID'],
          material: ans_detail['MATERIAL_NAME']
        })
      }
      //이미지 없는경우 2-3
      else{
        if(ans_detail['MATERIAL_NAME'][0] === undefined){
          material = "no result"
        }
        else {
          material = ans_detail['MATERIAL_NAME'].replace(/,,/gi,' ')
        }
        DetailInfo.push({
          pillname: name,
          name: ans_detail['ITEM_NAME'],
          image: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
          chart: ans_detail['CHART'],
          class: ans_detail['CLASS_NO'],
          storage : ans_detail['STORAGE_METHOD'],
          pack : ans_detail['PACK_UNIT'],
          nburl: ans_detail['NB_DOC_ID'],
          eeurl: ans_detail['EE_DOC_ID'],
          udurl: ans_detail['UD_DOC_ID'],
          material: ans_detail['MATERIAL_NAME']
        })
      }
    }
  }
  //아예 없을경우
  else{
      DetailInfo.push({
            pillname: name,
            name: 'no result',
            image: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
            chart: 'no result',
            class: 'no result',
            storage : 'no result',
            pack : 'no result',
            nburl: 'no result',
            eeurl: 'no result',
            udurl: 'no result',
            material: 'no result',
            message: '명시된 정보가 없네요.'
      })
  }
  
  return DetailInfo
}