const v = localStorage.getItem('tt-global-state'); // достаем данные из localStorage
console.log(v)
const v2 = JSON.parse(v)['chats']['byId']; // парсинг данных
console.log(v2)
let mas = new Array(); // создание массива каналов
for (var i in v2){
    if (v2[i]['id']<0){
        mas.push(v2[i]['id']);
    }
    
}
console.log(mas);
chrome.runtime.sendMessage({oper:'sendMessage', listToServer: mas},function (response){})