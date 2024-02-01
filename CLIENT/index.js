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

function deleteRowById(id){
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}

function editRowById(id, name){
    const updateSection = document.querySelector('#update-row');
    document.querySelector('#update-name-input').value = name;
    document.querySelector('#update-id').innerText = id + ".";
    updateSection.hidden = false;
    console.log(id);
    document.querySelector('#update-row-btn').dataset.id = id;
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
            id: updateId.dataset.id,
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

    tableHTML += `<td><button class="delete-row-btn" data-id=${data.id}>DELETE</td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${data.id} name=${data.name}>EDIT</td>`;

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

    data.forEach(function ({id, name, date_added}){
        tableHTML += "<tr>";
        tableHTML += `<td>${id}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHTML += `<td><button class="delete-row-btn" data-id=${id}>DELETE</td>`;
        tableHTML += `<td><button class="edit-row-btn" data-id=${id} name=${name}>EDIT</td>`;
        tableHTML += "</tr>";
    })
    table.innerHTML = tableHTML;
    
}