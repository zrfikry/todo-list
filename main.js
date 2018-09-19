document.body.onload = init

const todoBox = document.querySelector('#todo')
const onprogressBox = document.querySelector('#onprogress')
const doneBox = document.querySelector('#done')
const taskText = document.querySelector('#taskText')
const formTask = document.querySelector('#formTask')

let tasks = {
  todo: [],
  onprogress: [],
  done: []
}

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
  let text = taskText.value
  tasks.todo.push(text)
  taskText.value = ''
  render()
}

function render () {
  todoBox.innerHTML = ''
  onprogressBox.innerHTML = ''
  doneBox.innerHTML = ''

  Object.keys(tasks).map(( status ) => {
    console.log(`${status} : `, tasks[status])

    if (tasks[status].length !== 0) {
      tasks[status].map(( item, index ) => {
        let newList = document.createElement('li')
        newList.id = `${status}-${index}`
        newList.draggable = true
        newList.addEventListener('dragstart', itemDrag)
  
        // view inside list
        let taskText = document.createElement('span')
        taskText.innerText = item
        newList.appendChild(taskText)
  
        // add delete button
        let deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'X'
        deleteBtn.className = 'btn-delete'
        deleteBtn.id = `delete-${status}-${index}`
        deleteBtn.addEventListener('click', deleteItem)
        newList.appendChild(deleteBtn)
        
        if (status === 'todo') {
          todoBox.appendChild(newList)
        } else if (status === 'onprogress') {
          onprogressBox.appendChild(newList)
        } else {
          doneBox.appendChild(newList)
        }
      })
    }

  })
  console.log('-------------------------------------------')
}

const itemDrag = function (event) {
  const id = event.target.id
  const from = id.split('-')[0]
  const itemId = id.split('-')[1]

  dragged = {
    from,
    itemId
  }
}

const itemDrop = function (event) {
  const targetId = event.target.id

  if (targetId !== dragged.from) {
    tasks[ targetId ].push(tasks[ dragged.from ][ dragged.itemId ])
    tasks[ dragged.from ].splice(dragged.itemId)

    dragged = null
    render()
  }
}

const deleteItem = function (event) {
  const btnId = event.target.id
  const status = btnId.split('-')[1]
  const itemId = btnId.split('-')[2]
  const proceed = confirm('Delete item ?')
  if (proceed) {
    tasks[ status ].splice(itemId)
    render()
  }
}
