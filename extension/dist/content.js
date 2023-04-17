// Получение данных из localStorage
const data = localStorage.getItem('tt-global-state');
const parseData = JSON.parse(data)['chats']['byId'];
// Формирование массива каналов
const channels = [];
for (const chatId in parseData) {
  if (parseData[chatId]['id'] < 0) {
    const channel = [parseData[chatId]['id'], parseData[chatId]['title']];
    channels.push(channel);
  }
}
// Отправка сообщения в фоновую страницу
chrome.runtime.sendMessage({ oper: 'sendMessageBack', listToServer: channels }, function(response) {});

chrome.runtime.onMessage.addListener( ({oper, listToServer}, sendResponse) => {
  switch(oper){
    case "Scan" : {
      const posts =[]
      let scan_text = document.getElementsByClassName("text-content clearfix with-meta")
      for ( let i = 0; i<scan_text.length; i++){
        const text_post = scan_text[i].innerText
        posts.push(text_post)
      }
      console.log(posts)
      const result = [];

      

      for (const post of posts) {
        const regex = /(\d{2}:\d{2})\s*:\s*(.*)/;
        const matches = post.match(regex);
        if (matches) {
          const time = matches[1];
          let message = matches[2];
          message = message.replace(/\n/g, ' '); // удаляем переносы строк
          message = message.replace(/\s+/g, ' '); // удаляем лишние пробелы
          message = message.replace(/"\s*"/g, ''); // удаляем пустые кавычки
          message = message.replace(/:\s*Squawka@chel2eafc\d+,\d+Kизменено/g, ''); // удаляем специальную строку
          result.push(`${time} : "${message}"`);
        }
      }
      console.log(result);
      // setTimeout(()=>{chrome.runtime.sendMessage({ oper: 'Complited'});},10000);
      break
    }
    default: {console.log('def')}
  }
})