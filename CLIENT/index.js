document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
});

document.querySelector('table tbody').addEventListener('click', function(event){
    console.log(event.target);
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn"){
        editRowById(event.target.dataset.id, event.target.name);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function(){
    const searchValue1 = document.querySelector('#search-input');
    console.log(searchValue1);
    const searchValue = searchValue1.value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data'])) 

    if(searchValue === ""){
        location.reload();
    }

}

function deleteRowById(_id){
    fetch('http://localhost:5000/delete/' + _id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}

function editRowById(_id, name){
    const updateSection = document.querySelector('#update-row');
    document.querySelector('#update-name-input').value = name;
    document.querySelector('#update-id').innerText = _id + ".";
    updateSection.hidden = false;
    console.log(_id);
    document.querySelector('#update-row-btn').dataset._id = _id;
}

updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input');
    const updateId = document.querySelector('#update-row-btn');


    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            _id: updateId.dataset._id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    })
    updateNameInput.value = "";
}

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({  name : name })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data){
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHTML = "<tr>";

    for (var key in data) {
        if(data.hasOwnProperty(key)) {
            if(key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHTML += `<td>${data[key]}</td>`;
        }
    }

    tableHTML += `<td><button class="delete-row-btn" data-id=${data._id}>DELETE</td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${data._id} name=${data.name}>EDIT</td>`;

    tableHTML += "</tr>";

    if(isTableData){
        table.innerHTML = tableHTML;
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }

}

function loadHTMLTable(data){
    const table = document.querySelector('table tbody');

    console.log(data);

    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        console.log(data);
        return;
    }

    let tableHTML = "";

    data.forEach(function ({_id, name, date_added}){
        tableHTML += "<tr>";
        tableHTML += `<td>${_id}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHTML += `<td><button class="delete-row-btn" data-id=${_id}>DELETE</td>`;
        tableHTML += `<td><button class="edit-row-btn" data-id=${_id} name=${name}>EDIT</td>`;
        tableHTML += "</tr>";
    })
    table.innerHTML = tableHTML;
    
}