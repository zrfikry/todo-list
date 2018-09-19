document.body.onload = init

const todoBox = document.querySelector('#todo')
const onprogressBox = document.querySelector('#onprogress')
const doneBox = document.querySelector('#done')
const taskText = document.querySelector('#taskText')
const formTask = document.querySelector('#formTask')

let tasks = []

let newTaskId = 1

let dragged = null

function init () {
  formTask.addEventListener('submit', addTask)

  todoBox.addEventListener('drop', itemDrop)
  todoBox.addEventListener('dragover', allowDrag)

  onprogressBox.addEventListener('drop', itemDrop)
  onprogressBox.addEventListener('dragover', allowDrag)

  doneBox.addEventListener('drop', itemDrop)
  doneBox.addEventListener('dragover', allowDrag)

  render()
}

const allowDrag = function (event) {
  event.preventDefault()
}

const addTask = function (event) {
  event.preventDefault()
  let inputValue = taskText.value
  let text = inputValue.split(' ')
  let inputCommand = text[0].toLowerCase()
  let id = null

  switch (inputCommand) {
    case 'create':
      tasks.push({ id: newTaskId, content: inputValue.substring(text[0].length + 2, inputValue.length - 1) , status: 'todo'})
      newTaskId++
      break
    case 'move':
      id = text[1]
      let newStatus = text[2]
      tasks.map(( task, index) => {
        if (task.id === Number(id)) {
          tasks[index].status = newStatus
        }
      })
      break
    case 'remove':
      id = text[1]
      tasks.map(( task, index) => {
        if (task.id === Number(id)) {
          tasks.splice(index, 1)
        }
      })
      break
    default:
      alert('Command not found!')
      break
  }

  taskText.value = ''
  render()
}

function render () {
  todoBox.innerHTML = ''
  onprogressBox.innerHTML = ''
  doneBox.innerHTML = ''

    tasks.map(( item ) => {
      let newList = document.createElement('li')
      newList.id = `task-${item.id}`
      newList.draggable = true
      newList.addEventListener('dragstart', itemDrag)

      // view inside list
      let taskText = document.createElement('span')
      taskText.innerText = `[ ${item.id} ] ${item.content}`
      newList.appendChild(taskText)

      // add delete button
      let deleteBtn = document.createElement('button')
      deleteBtn.innerText = 'X'
      deleteBtn.className = 'btn-delete'
      deleteBtn.id = `delete-${item.id}`
      deleteBtn.addEventListener('click', deleteItem)
      newList.appendChild(deleteBtn)
      
      if (item.status === 'todo') {
        todoBox.appendChild(newList)
      } else if (item.status === 'onprogress') {
        onprogressBox.appendChild(newList)
      } else {
        doneBox.appendChild(newList)
      }
    })
}

const itemDrag = function (event) {
  const id = event.target.id
  const itemId = id.split('-')[1]

  dragged = Number(itemId)
}

const itemDrop = function (event) {
  const targetId = event.target.id
  tasks.map(( task, index ) => {
    if (task.id === dragged) {
      tasks[index].status = targetId
    }
  })
  dragged = null
  render()
}

const deleteItem = function (event) {
  const btnId = event.target.id
  const itemId = Number(btnId.split('-')[1])
  const proceed = confirm('Delete item ?')
  if (proceed) {
    tasks.map(( task, index ) => {
      if (task.id === itemId) {
        tasks.splice(index, 1)
      }
    })
    render()
  }
}
