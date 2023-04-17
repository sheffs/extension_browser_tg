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
        case "Scan_posts":{
           let scan_channel = listToServer
            console.log(scan_channel);
            // let xhr = new XMLHttpRequest();
            // xhr.open('GET', 'http://45.136.51.185:4444/');
            // xhr.send([scan_channel]);
            // xhr.onload = function() {
            //     if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            //       alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
            //     } else { // если всё прошло гладко, выводим результат
            //       alert(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
            //     }
            //   };
             // Отправка массива на сервер
            fetch('http://45.136.51.185:4444/', {
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