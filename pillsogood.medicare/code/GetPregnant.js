module.exports.function = function getPregnant (name) {
  const http = require('http')
  const console = require('console')
  const config = require('config')
  const key = secret.get('key')

  const url_info = config.get('urlinfo') + '?serviceKey='+ key + '&item_name='+ encodeURI(name)
  var res_info=http.getUrl(url_info, {format: 'xmljs'})
  var totalcount = res_info.response.body['totalCount']
  const result = new Array()
  if (totalcount <= 0) {
    result.push({
      status: "no result",
      name: name
    })
  } else {
    const url = config.get('urlpregnant') + '?serviceKey=' + key + '&itemName=' + encodeURI(name)
    var response = http.getUrl(url, {format: 'xmljs'})
    var totalcount = response.response.body['totalCount']
    if (totalcount >= 1) {
      var contents = response.response.body.items.item
      var message = "임산부에게 " + name + "은(는) 위험해요."
    
      if (totalcount > 1) {
        var prohibit = contents[0]['PROHBT_CONTENT']
        contents.forEach(function(content) {
        var imageurl = config.get('urlinfo') + '?serviceKey=' + key + '&item_name=' + encodeURI(content['ITEM_NAME'])
        var imageresponse = http.getUrl(imageurl, {format: 'xmljs'})
        if (imageresponse.response.body.totalCount >= 1) {
          var image = imageresponse.response.body.items.item['ITEM_IMAGE']
        } else {
          var image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
        }
        result.push({
          name: content['ITEM_NAME'],
          image: {url: image},
          class: content['CLASS_NAME'],
          chart: content['CHART'],
          content: prohibit,
          message: message,
          status: "result"
          })
        })
      }
      else {
        var prohibit = contents['PROHBT_CONTENT']
        var imageurl = config.get('urlinfo') + '?serviceKey=' + key + '&item_name=' + encodeURI(contents['ITEM_NAME'])
        var imageresponse = http.getUrl(imageurl, {format: 'xmljs'})
        if (imageresponse.response.body.totalCount >= 1) {
          var image = imageresponse.response.body.items.item['ITEM_IMAGE']
        } else {
          var image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
        }
        result.push({
          name: contents['ITEM_NAME'],
          image: {url: image},
          class: contents['CLASS_NAME'],
          chart: contents['CHART'],
          content: prohibit,
          message: message,
          status: "result"
        })
      }
    } 
    // --------------------------------------------------------------------------
    // 먹어도 괜찮을 때!
    else {
      var message = "임산부가 " + name + "을(를) 먹어도 괜찮아요."
      var imageurl = config.get('urlinfo') + '?serviceKey=' + key + '&item_name=' + encodeURI(name)
      var imageresponse = http.getUrl(imageurl, {format: 'xmljs'})
      var contents = imageresponse.response.body.items.item
      if (typeof(contents[0]) === 'object') {
        contents.forEach(function(content) {
          result.push({
            name: name,
            image: {url: content['ITEM_IMAGE']},
            class: content['CLASS_NAME'],
            chart: content['CHART'],
            content: "없음",
            message: message,
            status: "result"
          })
        })
      } else {
        result.push({
          name: contents['ITEM_NAME'],
          image: {url: contents['ITEM_IMAGE']},
          class: contents['CLASS_NAME'],
          chart: contents['CHART'],
          content: "없음",
          message: message,
          status: "result"
        })
      }
    }
  }
  return result[0]
}
