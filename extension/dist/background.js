(async () => {
let userChannel = '';
let tg_channel = [];
async function reloadTab(newUrl){
    let part = newUrl.split('#')
    console.log(part)
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.url.indexOf('telegram') !== -1) {
                console.log(tab.id);
                console.log(tab.url);
                chrome.tabs.remove(tab.id);
                chrome.tabs.create({ url: newUrl, pinned:true }, ()=>{
                    setTimeout(()=>{
                        console.log('Отправка скан');
                        chrome.tabs.query({currentWindow: true}, function (tabs) {
                            tabs.forEach(async function (tab) {
                                if (tab.url.indexOf('telegram') !== -1) {
                                    chrome.tabs.sendMessage(tab.id, {oper: "Scan"});
                                }
                            });
                        });
                        }, 5000);
                })
            }
        });
    });
}
chrome.runtime.onMessage.addListener(async ({oper, listToServer}, sendResponse) => {
    switch (oper) {
        case "sendMessageBack": {
            userChannel = listToServer;
            break;
        }
        case "sendMessagePop": {
            chrome.runtime.sendMessage({oper: 'sendMessageToPop', my_variable: userChannel}, function (response) {});
            break;
        }
        case "CheckBox_Channel": {
            tg_channel = listToServer;
            console.log("Полученные тг :", tg_channel);
            await reloadTab('https://web.telegram.org/z/#' + tg_channel[0]);
            chrome.runtime.sendMessage({oper:'scanComplited' , my_variable : tg_channel[0]  })
            break;
        }
        case "Complited":{
            tg_channel.shift()
            if (tg_channel.length == 0){break}
            else {
                await reloadTab('https://web.telegram.org/z/#' + tg_channel[0]);
            }
            chrome.runtime.sendMessage({oper:'scanComplited' , my_variable : tg_channel[0]  })
            break;
        }
        case "Date":{
            console.log(listToServer)
            const date_begin = listToServer[0]
            const date_end = listToServer[1]
            console.log(date_begin)
            console.log(date_end)
            chrome.runtime.sendMessage({oper: 'date', my_variable : date_begin})
              break;
            }
            
        case "Scan_posts":{
           let scan_channel = listToServer
            console.log(scan_channel);
             // Отправка массива на сервер
            fetch('http://localhost:3000/savedMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
            body: JSON.stringify(scan_channel),
                })
            .then(response => {
            if (response.ok) {
                console.log('Массив успешно отправлен на сервер');
            } else {
                console.error('Произошла ошибка при отправке массива на сервер');
            }
            })
            .catch(error => {
                console.error('Произошла ошибка при отправке массива на сервер:', error);
            });
            break
        }
        default:
            console.log('default');
    }
});
})();