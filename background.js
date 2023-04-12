//const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    let userChannel = '';
    let tg_channel = [];
    
    async function getTabId(){
        var tabId = -1;
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            tabs.forEach(async function (tab) {
                if (tab.url.indexOf('telegram') !== -1) {
                    //debugger;
                    tabId = tab.id;
                }
            });
        });
        return tabId;
    }
    async function reloadTab(newUrl){
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
                break;
            }
            case "Complited":{
                tg_channel.shift()
                if (tg_channel.length == 0){break}
                else {await reloadTab('https://web.telegram.org/z/#' + tg_channel[0]);}
                break;
            }
            default:
                console.log('default');
        }
    });
    })();