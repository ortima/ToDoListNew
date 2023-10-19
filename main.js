const entry = document.getElementById('entry')
const form = document.getElementById('form')
const ul = document.getElementById('todoList')
const alertP = document.querySelector('.alert')

const clearBtn = document.getElementById('clear-btn')
const submitBtn = document.getElementById('submit-btn')
const cancelBtn = document.getElementById('cancel-btn')
const clearRowBtn = document.getElementById('clear-row-btn')



let localStorageKey= 'items';
let editFlag = false
let editElement; 
let editID; 

window.addEventListener('DOMContentLoaded', setupItems) 
form.addEventListener("submit", addItem);  // submit form
clearBtn.addEventListener('click', clearItems); // clearAll button
cancelBtn.addEventListener('click', setBackToDefault); //cancel button
entry.addEventListener('input', inputChange); //show clear-row button
clearRowBtn.addEventListener('click', clearRow)

function clearRow(){
  entry.value = null;
  clearRowBtn.classList.add('d-none');
}

function inputChange(){
  if (entry.value){
    clearRowBtn.classList.remove('d-none');
  }
  else{
    clearRowBtn.classList.add('d-none');
  }
}

function addItem(e) {
  e.preventDefault()
  let textInput = entry.value;
  let id = new Date().getTime().toString(); 
    
  if (textInput.trim().length == ''){
    textInput = null;
    displayAlert('Пустая запись','alert-danger')
    clearRowBtn.classList.add('d-none');
  }
  else if(textInput && !editFlag){ 
    createLIS(textInput,id)
    displayAlert('Новая запись добавлена','alert-success')
    clearBtn.classList.remove('d-none')
    clearRowBtn.classList.add('d-none');
    addToLocalStorage(textInput,id)
  }
  else if(textInput && editFlag){
    editElement.innerText = textInput
    displayAlert("Запись изменена", "alert-success");
    editLocalStorage(textInput,editID)
    setBackToDefault()
  }
  entry.value = null
}

function createLIS(textInput,id) {
  const li = document.createElement('li');
  li.className = 'list-item';
  li.setAttribute('data-id', id); 
  li.innerHTML = `
    <p class="text">${textInput}</p>
    <i class='bx bxs-edit bx-sm'></i>
    <i class='bx bx-check bx-sm'></i>
    <i class='bx bxs-trash bx-sm'></i>`;

  //icons 
  li.querySelector('.bx.bxs-edit').addEventListener('click',editItem)
  li.querySelector('.bx.bx-check').addEventListener('click', checkItem)
  li.querySelector('.bx.bxs-trash').addEventListener('click', deleteItem)

  ul.append(li)
}

//Icons functions

function editItem() {
  let pText = this.previousElementSibling 
  editElement = pText;
  entry.value = pText.innerText
  editFlag = true

  editID = this.parentElement.dataset.id
  ul.querySelectorAll('.bx').forEach(icon => {
    icon.classList.toggle('d-none')
  });
  cancelBtn.classList.toggle('d-none');
  submitBtn.innerText = 'Подтвердить'
  clearBtn.classList.add('d-none');
}

function checkItem() {
  this.parentElement.classList.toggle('liChecked')
}

function deleteItem() {
  let id = this.parentElement.dataset.id 
  ul.removeChild(this.parentElement)
  displayAlert('Запись удалена', 'alert-danger')
  if(ul.children.length === 0){
    clearBtn.classList.add('d-none')
  }
  removeFromLocalStorage(id)
}

//Display message
function displayAlert(msg,styles) {
  alertP.innerText = msg
  alertP.classList.add(styles)
  setTimeout(()=>{
    alertP.innerText = null;
    alertP.classList.remove(styles)
  }, 1600)
}

function clearItems() {
  ul.innerHTML = null
  displayAlert('Все записи очищены!', 'alert-danger')
  clearBtn.classList.add('d-none')
  localStorage.clear();
}

function setBackToDefault() {
  entry.value = null;
  editFlag = false;
  editElement = undefined;
  editID = undefined; 
  submitBtn.innerText = 'Записать';
  cancelBtn.classList.add('d-none');
  clearBtn.classList.remove('d-none');
  ul.querySelectorAll('.bx').forEach(icon => {
    icon.classList.toggle('d-none')
  });
}

// LocalStorage 
function addToLocalStorage(textInput,id) {
  let obj = {id, textInput}
  let items = getLocalStorage()
  items.push(obj)
  localStorage.setItem(localStorageKey, JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem(localStorageKey) ?
         JSON.parse(localStorage.getItem(localStorageKey)) :
         []
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage()
  items = items.filter(item => item.id !== id)
  localStorage.setItem(localStorageKey, JSON.stringify(items))
  if(items.length === 0){
    localStorage.removeItem(localStorageKey)
  }
}

function editLocalStorage(textInput,editID) {
  let items = getLocalStorage()
  items = items.map(item => {
    if(item.id === editID) item.textInput = textInput
    return item
  })
  localStorage.setItem(localStorageKey, JSON.stringify(items))
}

function setupItems() {
  let items = getLocalStorage()
  if(items.length > 0){
    items.forEach(item => {
      createLIS(item.textInput, item.id)
    })
    clearBtn.classList.remove('d-none')
  }
}