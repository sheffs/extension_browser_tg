import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

var channels = "";

function Searchform() {
  const [counter, setCounter] = useState(0);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const local_channels = JSON.parse(localStorage.getItem('selectedChannels'))
  let map = new Map(Object.entries(channels));
  useEffect(() => {
    const storedValue = localStorage.getItem('selectedChannels');
    if (storedValue !== null) {
        setSelectedChannels(JSON.parse(storedValue));
    }
    // Отправка сообщения в фоновую страницу при монтировании компонента
    chrome.runtime.sendMessage({ oper: 'sendMessagePop' }, function (response) { });
    let value = '';
    // Функция для обработки полученных сообщений
    const handleMessage = ({ oper, my_variable }) => {
      switch (oper) {
        case 'sendMessageToPop': {
          // Обработка полученных данных
          value = my_variable;
          channels = value;
          console.log('Получены данные из фоновой страницы:', channels);
          setCounter(counter + 1);
          break;
        }
        case 'scanComplited': {
          const channelId  = my_variable;
          document.getElementById(channelId).click()
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

  const handleCheckboxChange = (event) => {
    const {checked, id} = event.target;
    let updatedSelectedChannels = [...selectedChannels];
    if (checked) {
        // Если чекбокс отмечен, добавляем id канала в массив выбранных каналов
        updatedSelectedChannels.push(id);
      } else {
        // Если чекбокс снят, удаляем id канала из массива выбранных каналов
        updatedSelectedChannels = updatedSelectedChannels.filter(
          channelId => channelId !== id
        );
      };
      setSelectedChannels(updatedSelectedChannels); // Обновляем состояние selectedChannels
      localStorage.setItem('selectedChannels', JSON.stringify(updatedSelectedChannels));
    };

  const clickButton = () => {
    chrome.runtime.sendMessage({ oper: 'CheckBox_Channel', listToServer: selectedChannels });
  }

  return (
    <div style={{ margin: "10px" }}>
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
              <th>Название канала</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(map).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      id={value[0]}
                      checked={selectedChannels.includes(value[0])}
                      onChange={handleCheckboxChange}
                    />
                  </td>
                  <td>{value[1]}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
}
export default Searchform;