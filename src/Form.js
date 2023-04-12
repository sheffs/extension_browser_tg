import React, {useEffect, useState, } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

var channels  = "";
function Searchform() {
    const [counter, setCounter] = useState(0)
    useEffect(() => {
        // Отправка сообщения в фоновую страницу при монтировании компонента
        chrome.runtime.sendMessage({ oper: 'sendMessagePop' }, function(response) {});
        let value = '';
        // Функция для обработки полученных сообщений
        const handleMessage = ({ oper, my_variable }) => {
            switch (oper) {
                case 'sendMessageToPop': {
                    // Обработка полученных данных
                    value = my_variable;
                    channels = value;
                    console.log('Получены данные из фоновой страницы:', value);
                    setCounter(counter + 1);
                    break;
                }
                default:
                    console.log(channels);
            }
        };
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);
    const test = () =>{
        console.log('1')
    }
    let map = new Map(Object.entries(channels));

    function clickButton(event){
        var checkbox_channel = []; // Объявляем массив
        var all_inputs = document.getElementsByTagName('input');
        for (let i = 0; i < all_inputs.length; ++i){
            if (all_inputs[i].type == 'checkbox'){
                if (all_inputs[i].checked == true) {
                    checkbox_channel.push(all_inputs[i].id); // Добавляем данные в массив
                }
            }
        }
        chrome.runtime.sendMessage({oper:'CheckBox_Channel', listToServer: checkbox_channel}); // Отправляем массив в сообщении
    }
    

// Получаем название по id, полученному из таблицы(ClickButton)
    // document.getElementsByTagName('input')
    //     var all_inputs = document.getElementsByTagName('input')
    //     for (let i = 0; i < all_inputs.length; ++i){
    //         if (all_inputs[i].type == 'checkbox'){
    //             if (all_inputs[i].checked == true) {
    //                 var parentCell2 = all_inputs[i].parentElement.parentElement.parentElement;
    //                 var trColl = parentCell2.cells
    //                 var tdColl = parentCell2.cells [1]
    //                 console.log(tdColl.innerText)
    //             }
    //         }
    //     }

    function handleClick(event) {
        // Получаем целевой элемент (чекбокс)
        const checkbox = event.target;
        // Получаем значение свойства id чекбокса
        const checkboxId = checkbox.id;
        if (checkbox.checked) {
            // Если чекбокс выбран, выводим значение id в консоль
            console.log('Выбран чекбокс с id:', checkboxId);
          } else {
            // Если чекбокс снят с выбора, выводим сообщение об отмене выбора
            console.log('Выбор чекбокса с id:', checkboxId, 'отменен');
          }
      }
    return(
        <div style={{ margin: "10px" }}>
            {test}
            <Form>
            <Form.Group className="bg-light" style={{ marginBottom: "10px" }}>
                <Form.Label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Поиск</Form.Label>
                <Form.Control placeholder="Введите слово или словосочетание" />
            </Form.Group>
            <Button variant="outline-secondary" onClick={clickButton}>
                Поиск
            </Button>
            </Form>
            <Table striped>
                <thead>
                    <tr>
                        <th>Выбрать</th>
                        <th>Название канала</th>
                    </tr>
                </thead>
                <tbody>
                {Array.from(map).map(([key, value]) => (
                <tr key={key}>
                    <td> <Form.Check 
                        onClick={handleClick}
                        id={value[0]}
                        type={'checkbox'}
                />
                    </td>
                    <td>{value[1]}</td>
                </tr>
            ))}
                </tbody>
            </Table>
        </div>
    )
}
export default Searchform