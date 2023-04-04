import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

function Searchform() {
    chrome.runtime.sendMessage({oper:'sendMessagePop',},function (response){})
    chrome.runtime.onMessage.addListener(({oper,my_variable},sendResponse) =>{
    })
    return(
        <div style={{ margin: "10px" }}>
            <Form>
            <Form.Group className="bg-light" style={{ marginBottom: "10px" }}>
                <Form.Label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Поиск1</Form.Label>
                <Form.Control placeholder="Введите слово или словосочетание" />
            </Form.Group>
            <Button variant="outline-secondary">
                Поиск
            </Button>
            </Form>
            <Table striped>
                <thead>
                    <tr>
                    <th>№</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
export default Searchform