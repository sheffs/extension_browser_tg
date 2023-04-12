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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    debugger;
    switch(request.oper){
      case "Scan" : {
        console.log('Пришли в Scan');
        setTimeout(function(){
          chrome.runtime.sendMessage({ oper: 'Complited'});
        }, 10000);
        break;
      }
      default: {console.log('def')}
    }
  }
);