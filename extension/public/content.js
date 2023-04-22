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
chrome.runtime.onMessage.addListener( ({oper, listToServer}, sendResponse) => {
  switch(oper){
    case "Scan" : {
      // let posts = []
      // let post = document.getElementsByClassName('text-content clearfix with-meta')
      // for (let i = 0; i<post.length; i++){
      //   let text = post[i].innerText
      //   posts.push(text)
      // }
      // console.log(posts)
      // // Канонизация текста
      // function cleanText(text) {
      //   // Удаляем символы переноса строки
      //   text = text.replace(/\n+/g, ' ');
      //   // Удаляем лишние пробелы в начале и конце строки
      //   text = text.trim();
      //   // Удаляем специальные символы, оставляя пробелы между словами
      //   text = text.replace(/\s+/g, ' ');
      //   return text;
      // }
      // const cleanedArray = posts.map(text => cleanText(text));
      // console.log(cleanedArray);
      // Получаем текущую дату
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // добавляем 1, так как месяцы в JavaScript начинаются с 0
      const day = currentDate.getDate();
      const currentDateObj = { year, month, day }; // создаем объект с отдельными частями даты
      const currentDateJson = JSON.stringify(currentDateObj); // конвертируем объект в JSON-строку
      console.log(currentDateJson);






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
      console.log(posts)
    const time_post = document.getElementsByClassName('message-time')
      for (let i = 0; i<time_post.length; i++){
        console.log(time_post[i].innerText)
      }












    let targetElement = document.querySelector('.message-date-group');

    if (targetElement) {
      let sp_from = "Wednesday"  // data + 1
      let sp_to = "Monday"       // data + 1
      let isSpTo = true          // Костыль
      let isSpFrom = true        // Костыль
        setInterval(function(){
          span_value = targetElement.querySelector('.sticky-date.interactive').innerText
          if(span_value != sp_from && isSpTo){
            targetElement = document.querySelector('.message-date-group');
            targetElement.scrollIntoView({ behavior: 'smooth' });
            isSpTo = false
          }
          else if(span_value != sp_to && isSpFrom){
            targetElement = document.querySelector('.message-date-group');
            console.log("СОБИРАЕМ ДАННЫЕ С КАНАЛА")
            console.log("ОТПРАВЛЯЕМ НА СЕРВЕР")
            console.log(targetElement)
            targetElement.scrollIntoView({ behavior: 'smooth' });
            isSpFrom = true
          }
          else {
            return
          }
        }, 5000);
  }
    // let message_group = document.getElementsByClassName('message-date-group')
    // let span_value = message_group[0].querySelector('.sticky-date.interactive').innerText
    // while (span_value == 'Today') {
    //   message_group.scrollIntoView({ behavior: 'smooth' });
    //      setTimeout(() => {
    //     message_group.scrollIntoView({ behavior: 'smooth' });
    //   }, 5000);
    // }








      chrome.runtime.sendMessage({oper: 'Scan_posts', listToServer: cleanedArray},function(response) {})
      setTimeout(()=>{
        chrome.runtime.sendMessage({ oper: 'Complited'});
      },5000);
      
      break
    }
    default: {console.log('def')}
  }
})