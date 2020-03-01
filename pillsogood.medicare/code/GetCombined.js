module.exports.function = function getCombined (name, combinedname) {
  const base64 = require('base64')
  var console = require('secret')
  const service_key = secret.get('key')
  base64.decode(service_key)
  
  var http = require('http')
  var console = require('console')
  var config = require('config')
  
  var name_utf=encodeURI(name)
  var combinedname_utf=encodeURI(combinedname)

  const info_a = config.get('urlinfo') + '?serviceKey='+ service_key + '&item_name='+ name_utf
  var res_a=http.getUrl(info_a, {format: 'xmljs'})
  var total_a = res_a.response.body['totalCount']

  const info_b = config.get('urlinfo') + '?serviceKey='+ service_key + '&item_name='+ combinedname_utf
  var res_b=http.getUrl(info_b, {format: 'xmljs'})
  var total_b = res_b.response.body['totalCount']

  if (total_a <= 0 || total_b <= 0) {
    return {
      status: "no result"
    } 
  } else {
    const url_a = config.get('urlcombined') + '?ServiceKey='+ service_key + '&itemName='+ name_utf
    var response_a = http.getUrl(url_a, {format: 'xmljs'})
    var answer_a = response_a
    
    const url_b = config.get('urlcombined') + '?ServiceKey='+ service_key + '&itemName='+ combinedname_utf
    var response_b = http.getUrl(url_b, {format: 'xmljs'})
    var answer_b = response_b
    
    var text=''
    var prohibit=''
    var uniq_a=[]
    var uniq_b=[]
    // 병용 가능 여부 판단
    if(answer_a.response.body.items.item === undefined && answer_b.response.body.items.item === undefined){
      text = '같이 드셔도 괜찮아요.'
      prohibit = '없음'
    }
    
    else if (answer_a.response.body.items.item !== undefined && answer_b.response.body.items.item === undefined){
      var pill_names=[]
      answer_a.response.body.items.item.forEach(function(item){
        pill_names.push(item.MIXTURE_ITEM_NAME)
        prohibit = item.PROHBT_CONTENT
      })
      var uniq_a = pill_names.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
        return a;
      },[]);
      uniq_a.forEach(function(str_a){
        if(str_a.includes(combinedname)){
          text = '같이 드시는 걸 권장하지 않아요. 전문가와 상의하세요.'
        }
        return text
      })
      if (text === '') {
        text ='같이 드셔도 괜찮아요.'
        prohibit = '없음'
      }
    }
    //3
    else if (answer_a.response.body.items.item === undefined && answer_b.response.body.items.item !== undefined){
      var pill_names=[]
      answer_b.response.body.items.item.forEach(function(item){
        pill_names.push(item.MIXTURE_ITEM_NAME)
        prohibit = item.PROHBT_CONTENT
      })
      var uniq_b = pill_names.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
        return a;
      },[]);
      
      uniq_b.forEach(function(str_b){
        if(str_b.includes(name)){
          text = '같이 드시는 걸 권장하지 않아요. 전문가와 상의하세요.'
        }
        return text
      })
      if (text === ''){
        text = '같이 드셔도 괜찮아요.'
        prohibit = '없음'
      }
    }
    //4
    else if (answer_a.response.body.items.item !== undefined && answer_b.response.body.items.item !== undefined){
      var pilla_names=[]
      var pillb_names=[]
      answer_a.response.body.items.item.forEach(function(itema){
        pilla_names.push(itema.MIXTURE_ITEM_NAME)
        prohibit = itema.PROHBT_CONTENT
      })
      answer_b.response.body.items.item.forEach(function(itemb){
        pillb_names.push(itemb.MIXTURE_ITEM_NAME)
        prohibit = itemb.PROHBT_CONTENT
      })
      var uniq_a = pilla_names.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
        return a;
      },[]);
      var uniq_b = pillb_names.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
        return a;
      },[]); 
      uniq_a.forEach(function(str_a){
      if(str_a.includes(combinedname)){
        text = '같이 드시는 걸 권장하지 않아요. 전문가와 상의하세요.'
      }
      return text
      })
      
      if (text === '') {
        uniq_b.forEach(function(str_b){
          if (str_b.includes(name)){
            text = '같이 드시는 걸 권장하지 않아요. 전문가와 상의하세요.'
          }
          return text
        })
        if (text === '') {
          text ='같이 드셔도 괜찮아요.'
          prohibit = '없음'
        }
      }
    }
    return { 
      message: text,
      name: name,
      combinedname: combinedname,
      content: prohibit,
      status: "result"
    }
  }
}