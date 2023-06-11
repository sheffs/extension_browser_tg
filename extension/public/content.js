// Получение данных из localStorage
const data = localStorage.getItem('tt-global-state');
const parseData = JSON.parse(data)['chats']['byId'];
// Формирование массива каналов
const channels = [];
let span_value = ''
for (const chatId in parseData) {
  if (parseData[chatId]['id'] < 0) {
    const channel = [parseData[chatId]['id'], parseData[chatId]['title']];
    channels.push(channel);
  }
}
// Отправка сообщения в фоновую страницу
chrome.runtime.sendMessage({ oper: 'sendMessageBack', listToServer: channels }, function(response) {});




// Слушатель сообщений поступающих на content.js
chrome.runtime.onMessage.addListener( ({oper, listToServer}, sender,sendResponse) => {
  switch(oper){
    
    case "Scan" : {
      // Получаем текущую дату
      console.log('Я работаю в case Scan')
      let date = listToServer
      console.log('date:',date)
      let date_low = Date.parse (date[1])
      console.log('date_low',date_low)
      d = new Date()
      d.setTime(Date.parse (date[0])-86400)
      let date_high = d.getTime()
      console.log('date_high',date_high)
      dd = new Date()
      dd.setTime(date_high)
      const day_high = dd.getDate()
      console.log(day_high)
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
      const month_high = dd.getMonth()
      console.log('month_high',months[month_high])




      //const months = ['January ', 'February', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December ' ]
      const currentDate = new Date();
      const current_date_string = currentDate ? currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      const current_date = Date.parse(current_date_string)
      console.log(current_date)
      const messageDateGroupElements = document.getElementsByClassName('message-date-group');
      //Перебираем все элементы коллекции messageDateGroupElements
      for (let i = 0; i < messageDateGroupElements.length; i++) {
      const stickyDateElement = messageDateGroupElements[i].querySelector('.sticky-date.interactive');
      if (stickyDateElement) {
        const stickyDateText = stickyDateElement.innerText;
        console.log(stickyDateText);
      }
      }
      let posts = []
      let post = document.getElementsByClassName('text-content clearfix with-meta')
      for (let i = 0; i<post.length; i++){
        let text = post[i].innerText
        posts.push(text)
      }
     
      let targetElement = document.querySelector('.message-date-group');
      if (targetElement) {
        let delta_time_low = current_date - date_low
        let delta_time_high = current_date - date_high
        let delta_in_days_low = delta_time_low / (1000*3600*24)
        let delta_in_days_high = Math.round((delta_time_high / (1000*3600*24))) // TODO day + 1
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let sp_low = ""  // data + 1
        let sp_high = ""       // data + 1
        if (delta_in_days_low <= 7){
        let k = (currentDate.getDay() - delta_in_days_low + 7) % 7
        sp_low = days[k]
        }
        else {
          sp_low  = (date[1].split(','))[0]
        }
        if (delta_in_days_low == 1){ sp_low = 'Yesterday'}
        if(delta_in_days_low == 0){sp_low = 'Today'}
        if (delta_in_days_high <= 7){
          let k = Math.round((currentDate.getDay() - delta_in_days_high + 7) % 7)
          sp_high = days[k-1] // TODO day + 1
          console.log("84: ", sp_high, k, delta_in_days_high)
        }
        else {
          sp_high  = months[month_high] + ' ' + day_high
          console.log("88: ", sp_high)

        }
        if (delta_in_days_high == 1){ sp_high = 'Yesterday'}
        if(delta_in_days_high == 0){sp_high = 'Today'}
        console.log("sp_high: ", sp_high)
        console.log("sp_low: ", sp_low)

      let isSpTo = true          // Костыль
      let isSpFrom = true        // Костыль
        setInterval(function(){
          span_value = targetElement.querySelector('.sticky-date.interactive').innerText
          if(span_value != sp_low && isSpTo){
            targetElement = document.querySelector('.message-date-group');
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
          else if(span_value != sp_high && isSpFrom){
            isSpTo = false
            targetElement = document.querySelector('.message-date-group');
            const messageDateGroupElements = document.getElementsByClassName('message-date-group');
            //Перебираем все элементы коллекции messageDateGroupElements
            for (let i = 0; i < messageDateGroupElements.length; i++) {
              const stickyDateElement = messageDateGroupElements[i].querySelector('.sticky-date.interactive');
              if (stickyDateElement) {
                const stickyDateText = stickyDateElement.innerText;
              }
            }
            
              let names_allchannels = document.getElementsByClassName('title ysHMmXALnn0fgFRc7Bn7')
              let quantity_channels = names_allchannels.length
              let value_channel = names_allchannels[quantity_channels-1]
              let name_channel = value_channel.innerText
              let post = document.getElementsByClassName('text-content clearfix with-meta')
              const time_post = document.getElementsByClassName('message-time')
              const view_post = document.getElementsByClassName("message-views")
              let mass = []
              for (let i = 0; i<post.length; i++){
                // let text = post[i].innerText
                // let channelName = 'CNANNEL NAME'
                // let date_time = 'DATE AND TIME'
                // let count_view = 'COUNT VISITORS'
                const dictionary = {
                  'text': post[i].innerText,
                  'channelName': name_channel,
                  'time': time_post[i].innerText,
                  'date': span_value,
                  'count_view': view_post[i].innerText
              };
              mass.push(dictionary)
              
 
            
              }
              chrome.runtime.sendMessage({oper: 'Scan_posts', listToServer: mass},function(response) {})
            
            console.log("ЗАПИСЫВАЮ -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
            
            
            targetElement.scrollIntoView({ behavior: 'smooth' });
            
          }
          else {
            isSpFrom = false
            chrome.runtime.sendMessage({ oper: 'Complited', dateInterval: date});
            return
          }
        }, 5000);
    }
    console.log("ОТПРАВЛЯЕМ НА СЕРВЕР")
    
    break;
    }
    default: {console.log('def')}
  }
  return true
})
