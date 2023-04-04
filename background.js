let userChannel = ''

chrome.runtime.onMessage.addListener(({oper,listToServer},sendResponse) =>
{
    //debugger;
    switch(oper){
        case "sendMessageBack":{
            userChannel = listToServer;
            console.log(userChannel)
            break;
        }
        case "sendMessagePop":{
            chrome.runtime.sendMessage({my_variable:userChannel},function (response){})
            break;
        }
    }   
        
})