const entry = document.getElementById('entry')
const form = document.getElementById('form')
const ul = document.getElementById('todo-list')
const alertP = document.querySelector('.alert')

const clearBtn = document.querySelector('.clear-btn')
const submitBtn = document.querySelector('.submit-btn')
const cancelBtn = document.querySelector('.cancel-btn')


let LSkey= 'items';
let editFlag = false
let editElement; 
let editID; 

window.addEventListener('DOMContentLoaded', setupItems) 
form.addEventListener("submit", addItem);  // submit form
clearBtn.addEventListener('click', clearItems); // clearAll button
cancelBtn.addEventListener('click', setBackToDefault); //cancel button

function addItem(e) {
  e.preventDefault()
  let val = entry.value;
  let id = new Date().getTime().toString();   

  if(val && !editFlag){ 
    createLIS(val,id)
    displayAlert('Новая запись добавлена','alert-success')
    clearBtn.classList.remove('d-none')
    addToLS(val,id)
  }
  else if(val && editFlag){
    editElement.innerText = val
    displayAlert("Запись изменена", "alert-success");
    editLS(val,editID)
    setBackToDefault()
  }
  else{
    displayAlert('Пустая запись','alert-danger')
  }

  entry.value = null
}

function createLIS(val,id) {
  const li = document.createElement('li');
  li.className = 'list-item';
  li.setAttribute('data-id', id); 
  li.innerHTML = `
    <p class="text">${val}</p>
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
  removeFromLS(id)
}

//Display message
function displayAlert(msg,styles) {
  alertP.innerText = msg
  alertP.classList.add(styles)
  setTimeout(()=>{
    alertP.innerText = '';
    alertP.classList.remove(styles)
  }, 1500)
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

  clearBtn.classList.remove('d-none')
  ul.querySelectorAll('.bx').forEach(icon => {
    icon.classList.toggle('d-none')
  });
}

// LocalStorage 
function addToLS(val,id) {
  let obj = {id, val}
  let items = getLS()
  items.push(obj)
  localStorage.setItem(LSkey, JSON.stringify(items))
}

function getLS() {
  return localStorage.getItem(LSkey) ?
         JSON.parse(localStorage.getItem(LSkey)) :
         []
}

function removeFromLS(id) {
  let items = getLS()
  items = items.filter(item => item.id !== id)
  localStorage.setItem(LSkey, JSON.stringify(items))
  if(items.length === 0){
    localStorage.removeItem(LSkey)
  }
}

function editLS(val,editID) {
  let items = getLS()
  items = items.map(item => {
    if(item.id === editID) item.val = val
    return item
  })
  localStorage.setItem(LSkey, JSON.stringify(items))
}

function setupItems() {
  let items = getLS()
  if(items.length > 0){
    items.forEach(item => {
      createLIS(item.val, item.id)
    })
    clearBtn.classList.remove('d-none')
  }
}