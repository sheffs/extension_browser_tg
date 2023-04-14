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
      setTimeout(()=>{chrome.runtime.sendMessage({ oper: 'Complited'});},10000);
      break
    }
    default: {console.log('def')}
  }
})