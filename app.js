const todolistEl = document.querySelector('.todolist')
const inputEl = document.querySelector('#text-box')
const infoEl = document.querySelector('.amt')
const btnNew = document.querySelector('.btn-new-task')
const btnClear = document.querySelector('.btn-clear-all')
const btnDelete = document.querySelector('.btn-delete')
const radioEls = document.querySelectorAll('[name=radio]')

// construtor 

const customPrototypeOfTheDatetime = {
	getNowDateFormated: function() {
		const dayNumber = this.now.getDate()
		const dayName = this.dayNames[this.now.getDay()]
		const monthName = this.monthNames[this.now.getMonth()]
		const fullYear = this.now.getFullYear()
		
		return {dayName, dayNumber, monthName, fullYear}
	},
	getNowTime: function() {
		const hours = this.now.getHours()
		const seconds = this.now.getMinutes()
		
		return {
			hh: this.getUnit(hours),
			mm: this.getUnit(seconds)
		}
	}
}

function DateTime() {
	this.now = new Date()
	
	this.dayNames = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturnday'
	]
	
	this.monthNames = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
	]
	
	this.getUnit = unit => unit <= 10 ? `0${unit}` : unit
}

DateTime.prototype = customPrototypeOfTheDatetime


// objeto de principal

let todoApp = {
	tasks: [],
	reverse: true,
	currentId: 0,
}


// local storage

function getLocalStorage() {
	const data = localStorage.getItem('todo-app')
	if (!(data === null)) { todoApp = JSON.parse(data) }
}

function updateLocalStorage() {
	const data = JSON.stringify(todoApp)
	localStorage.setItem('todo-app', data)
}


// visualização

function generateTemplateForTasks(tasks) {
return tasks.map(({id, content, created, pending}) => {
	const {date, time} = created
	
	const inputCheck = `
		<input 
			type="checkbox"
			name="task"
			id="radio-${id}"
			onInput="changePending(this, ${id})"
			${pending ? '' : 'checked'}
		/>
		<label for="radio-${id}" class="check"></label>
	`
	
		return `
			<li>
				${inputCheck}
				<div class="content-box">
					<span class="content">${content}</span>
					<span class="date">${date} - ${time}</span>
				<button
					class="btn btn-delete"
					onClick="deleteTask(${id})"
				>
					<img class="icon" src="img/trash.svg" alt="icon">
				</button>
				</div>
			</li>
		`
	}).join('')
}

function addTasksAndInfoInToDOM() {
	const {tasks, reverse} = todoApp
	
	const allTasks = reverse ? 
		tasks.slice().reverse() : tasks
	
	const template = 
		generateTemplateForTasks(allTasks)
	
	infoEl.textContent = tasks.length
	
	if (tasks.length == 0) {
		todolistEl.innerHTML = `
			<li><span class="no-tasks">No tasks</span></li>
		`
		return
	}
	
	todolistEl.innerHTML = template
}


// atualização informações

function update() {
	inputEl.value = ''
	todoApp.currentId++
	updateLocalStorage()
	addTasksAndInfoInToDOM()
}


// ordem dos itens

function ordering(event) {
	const {id} = event.target
	todoApp.reverse = id === 'reverse' ? true : false
	update()
}

function checkOrder() {
	radioEls.forEach(radioEl => {
		radioEl.checked = radioEl.id === 'reverse' ?
			todoApp.reverse : !todoApp.reverse
	})
}


// controle de tarefas

function createTask() {
	const {currentId} = todoApp
	const content = inputEl.value.trim()
	
	if (!content) {
		alert('Task field cannot be empty')
		throw new Error('Task field cannot be empty')
	}
	
	const date = new DateTime()
	
	const {
		dayName,
		dayNumber,
		monthName,
		fullYear
	} = date.getNowDateFormated()
	
	const {hh, mm} = date.getNowTime()
	
	const task = {
		id: currentId + 1,
		content: content,
		created: {
			date: 
			`${dayName}, ${monthName} ${dayNumber} ${fullYear}`,
			time: `${hh}:${mm}`
		},
		pending: true
	}
	
	todoApp.tasks.push(task)
	update()
}


// index definido no botão gerado pelo script

function deleteTask(index) {
	const newArray = todoApp.tasks.filter(({id}) => {
		return !(id === index)
	})
	
	todoApp.tasks = newArray
	update()
}

function clearAll() {
	todoApp.tasks = []
	todoApp.currentId = 0
	update()
}

function changePending(inputRadioEl, ID) {
	const task = todoApp.tasks.filter(({id}) => id === ID)[0]
	task.pending = !inputRadioEl.checked
	updateLocalStorage()
}


// inicializador

function init() {
	getLocalStorage()
	checkOrder()
	addTasksAndInfoInToDOM()
}

window.addEventListener('load', init)
btnNew.addEventListener('click', createTask)
btnClear.addEventListener('click', clearAll)
radioEls.forEach(radioEl => 
	radioEl.addEventListener('input',ordering))
