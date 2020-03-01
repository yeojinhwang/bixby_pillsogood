module.exports.function = function getCombinedList (name) {
  const http = require('http')
  const console = require('console')
  const config = require('config')
  const key = secret.get('key')

  const url_info = config.get('urlinfo') + '?serviceKey='+ key + '&item_name='+ encodeURI(name)
  var res_info=http.getUrl(url_info, {format: 'xmljs'})
  var totalcount = res_info.response.body['totalCount']
  const TabooInfo = new Array()
  if (totalcount <= 0) {
    TabooInfo.push({
      status: "no result",
      pillname: name
    })
  } else {
    const url = config.get('urlcombined') + '?serviceKey=' + key + '&itemName=' + encodeURI(name)
    var response = http.getUrl(url, {format: 'xmljs'})
    var totalcount = response.response.body['totalCount']
    
    if (totalcount >= 1) {
      var contents = response.response.body.items.item
      var message = name + "은(는) 다음 약들과 함께 먹으면 위험해요."
      
      contents.forEach(function(content) {
        var imageurl = config.get('urlinfo') + '?serviceKey=' + key + '&item_name=' + encodeURI(content['MIXTURE_ITEM_NAME'])
        var imageresponse = http.getUrl(imageurl, {format: 'xmljs'})
        if (imageresponse.response.body.totalCount >= 1) {
          if (TabooInfo.some(item => {return item.name === content['MIXTURE_ITEM_NAME']}) === false) {
            TabooInfo.push({
              pillname: name,
              name: content['MIXTURE_ITEM_NAME'],
              image: {url: imageresponse.response.body.items.item['ITEM_IMAGE']},
              class: content['CLASS_NAME'],
              chart: content['CHART'],
              content: content['PROHBT_CONTENT'],
              message: message
            })}
          else {
            // console.log(content['PROHBT_CONTENT'])
            TabooInfo[TabooInfo.findIndex(item => item.name === content['MIXTURE_ITEM_NAME'])].content += content['PROHBT_CONTENT']
          }
        } else {
          if (TabooInfo.some(item => {return item.name === content['MIXTURE_ITEM_NAME']}) === false) {
            TabooInfo.push({
              pillname: name,
              name: content['MIXTURE_ITEM_NAME'],
              image: {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
              class: content['CLASS_NAME'],
              chart: content['CHART'],
              content: content['PROHBT_CONTENT'],
              message: message
            })} else {
              // console.log(TabooInfo[0])
            }
        }
      })
    } 
    else {
      var message = "함께 먹으면 안 되는 약 검색 결과가 없어요."
      // 병용금기 리스트가 없는 경우에는 발화된 약 정보 출력
      var imageurl = config.get('urlinfo') + '?serviceKey=' + key + '&item_name=' + encodeURI(name)
      var imageresponse = http.getUrl(imageurl, {format: 'xmljs'})
      var contents = imageresponse.response.body.items.item
      if (imageresponse.response.body.totalCount >= 1) {
        if (typeof(contents[0]) === 'object') {
          contents.forEach(function(content) {
            TabooInfo.push({
              pillname: name,
              name: content['ITEM_NAME'],
              image: {url: content['ITEM_IMAGE']},
              class: content['CLASS_NAME'],
              chart: content['CHART'],
              content: "없음",
              message: message
            })
          })
        } else {
          TabooInfo.push({
            pillname: name,
            name: contents['ITEM_NAME'],
            image: {url: contents['ITEM_IMAGE']},
            class: contents['CLASS_NAME'],
            chart: contents['CHART'],
            content: "없음",
            message: message
          })
        }
      } else {
        TabooInfo.push({
          pillname: name,
          name: name,
          image: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
          class: "없음",
          chart: "없음",
          content: "없음",
          message: message
        })
      }
    }
    // const GetInform = new Array()
    // GetInform.push({
    //   tabooinfo: TabooInfo,
    //   pillname: name,
    // })
  }
  return TabooInfo
}