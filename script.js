const input_key = document.querySelector('#input_key')
const input_value = document.querySelector('#input_value')
const input_btn = document.querySelector('#input_btn')

const table = document.querySelector('#table') 



function connectDB(action, values = null) {
    let openRequest = indexedDB.open("db3", 2);
    openRequest.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('table_values')) {
            db.createObjectStore('table_values', { keyPath: 'key' });
        }
    };
    openRequest.onsuccess = event => {
        const database = event.target.result
        const transaction = database.transaction("table_values", "readwrite");
        const newValues = transaction.objectStore("table_values");
        if (action === 'write') {
            // console.log(values);
            const newValue = { key, value } = values;
            const request = newValues.add(newValue);
            request.onsuccess = () => {
                connectDB('getDB')
                alert("значение добавлено в хранилище", request.result);
            };
            request.onerror = () => {
                alert("Ошибка, значение не добавлено в хранилище", request.error);
            };
        } else if(action === 'update'){
            // console.log(values);
            const newValue = { key, value } = values;
            const request = newValues.put(newValue);
            request.onsuccess = () => {
                connectDB('getDB')
                alert("значение обновлено в хранилище", request.result);
            };
            request.onerror = () => {
                alert("Ошибка, значение не обновлено в хранилище", request.error);
            };
        } else if(action === 'delete'){
            // console.log(values);
            const key = values;
            const request = newValues.delete(key);
            request.onsuccess = () => {
                connectDB('getDB')
                alert("значение удалено из хранилища");
            };
            request.onerror = () => {
                alert("Ошибка, значение не удалено из хранилища", request.error);
            };
        } else if (action === 'getDB') {
            const request = newValues.getAll();
            request.onsuccess = () => updateTable(request.result)
            request.onerror = () => console.error("Ошибка", request.error);
        }
    };
    openRequest.onerror = db => console.error('Ошибка при открытии базы данных', db.target.error);
}



input_btn.addEventListener('click', () => {
    input_key.value && input_value.value && connectDB('write', { key: input_key.value, value: input_value.value })
})



function updateItem(key){
    const newValue = prompt('введите новое значение')
    newValue && connectDB('update', { key, value: newValue })
}

function deleteItem(key){
    connectDB('delete', key)
}

function updateTable(valuesFromDB){
    table.innerHTML = valuesFromDB.map(valueFromDB => (`<tr id="table_tr">
        <td>${valueFromDB.key}</td>
        <td>${valueFromDB.value}</td>
        <td><button>изменить</button></td>
        <td><button>удалить</button></td>
    </tr>`)).join('')

    const table_rows = document.querySelectorAll('#table_tr')
    table_rows.forEach(table_row => {
        const table_row_key = table_row.firstChild.nextSibling
        // const table_row_value = table_row.firstChild.nextSibling.nextSibling.nextSibling
        const update_table_row_btn = table_row.lastChild.previousSibling.previousSibling.previousSibling
        const delete_table_row_btn = table_row.lastChild.previousSibling
        // console.log(table_row_key, table_row_value, update_table_row_btn, delete_table_row_btn);
        update_table_row_btn.addEventListener('click', () => updateItem(table_row_key.innerText))
        delete_table_row_btn.addEventListener('click', () => deleteItem(table_row_key.innerText))
    })
}



connectDB('getDB')