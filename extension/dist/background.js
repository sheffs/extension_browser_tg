(async () => {
let userChannel = '';
let tg_channel = [];
let done_scan = true;

async function reloadTab(newUrl, date){
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
                                    chrome.tabs.sendMessage(tab.id, {oper: "Scan", listToServer: date});
                                }
                            });
                        });
                        }, 5000);
                })
            }
        });
    });
}

chrome.runtime.onMessage.addListener(async ({oper, listToServer, dateInterval}, sendResponse) => {
    switch (oper) {
        case "sendMessageBack": {
            console.log('Я работаю sendMessageBack')
            userChannel = listToServer;
            break;
        }
        case "sendMessagePop": {
            console.log('Я работаю sendMessagePop')
            chrome.runtime.sendMessage({oper: 'sendMessageToPop', my_variable: userChannel}, function (response) {});
            break;
        }
        case "CheckBox_Channel": {
            console.log('Я работаю CheckBox_Channel')
            let date = dateInterval
            console.log('Полученная дата CheckBox', date)
            tg_channel = listToServer;
            console.log("Полученные тг :", tg_channel);
            await reloadTab('https://web.telegram.org/z/#' + tg_channel[0], date);
            chrome.runtime.sendMessage({oper:'scanComplited' , my_variable : tg_channel[0]  })
            break;
        }
        case "Complited":{
            const date_1 = dateInterval
            tg_channel.shift()
            if (tg_channel.length == 0 && done_scan){
                chrome.tabs.create({ url: "http://127.0.0.1:3000/results" })
                done_scan = false
                break
            }
            else {
                await reloadTab('https://web.telegram.org/z/#' + tg_channel[0], date_1);
            }
            chrome.runtime.sendMessage({oper:'scanComplited' , my_variable : tg_channel[0]  })
            break;
        }
        case "Date":{
            console.log(listToServer)
            const date_begin = listToServer[0]
            const date_end = listToServer[1]
            chrome.tabs.query({currentWindow: true}, function (tabs) {
                tabs.forEach(async function (tab) {
                    if (tab.url.indexOf('telegram') !== -1) {
                        chrome.tabs.sendMessage(tab.id, {oper: "DateSend", listToServer: [date_begin , date_end] });
                    }
                });
            });
            break;
            }
            
        case "Scan_posts":{
           let scan_channel = listToServer
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
        case 'post_channel':{
            const post_from_channel = listToServer
            console.log(post_from_channel)
        }
        default:
            console.log('default');
    }
    return true
});
})();