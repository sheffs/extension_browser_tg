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
      let posts = []
      let post = document.getElementsByClassName('text-content clearfix with-meta')
      for (let i = 0; i<post.length; i++){
        let text = post[i].innerText
        posts.push(text)
      }
      console.log(posts)
      function cleanText(text) {
        // Удаляем символы переноса строки
        text = text.replace(/\n+/g, ' ');
        // Удаляем лишние пробелы в начале и конце строки
        text = text.trim();
        // Удаляем специальные символы, оставляя пробелы между словами
        text = text.replace(/\s+/g, ' ');
        return text;
      }
      const cleanedArray = posts.map(text => cleanText(text));
      console.log(cleanedArray);
      chrome.runtime.sendMessage({oper: 'Scan_posts', listToServer: cleanedArray},function(response) {})
      setTimeout(()=>{chrome.runtime.sendMessage({ oper: 'Complited'});},5000);
      
      break
    }
    default: {console.log('def')}
  }
})