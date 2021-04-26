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

const getLocalStorage = () => {
	const data = localStorage.getItem('todo-app')
	if (!(data === null)) { todoApp = JSON.parse(data) }
}

const updateLocalStorage = () => {
	const data = JSON.stringify(todoApp)
	localStorage.setItem('todo-app', data)
}


// visualização

const generateTemplateForTasks = tasks => {
	return tasks.map(({id, content, created}) => {
		const {date, time} = created
		return `
			<li>
				<span class="content">${content}</span>
				<span class="date">${date} - ${time}</span>
				<button
					class="btn btn-delete"
					onClick="deleteTask(${id})"
				>
					<img class="icon" src="img/trash.svg" alt="icon">
				</button>
			</li>
		`
	}).join('')
}

const addTasksAndInfoInToDOM = () => {
	const {tasks, reverse} = todoApp
	
	let allTasks
	
	if (reverse) {
		allTasks = tasks.slice().reverse()
	} else {
		allTasks = tasks
	}
	
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

const update = () => {
	inputEl.value = ''
	todoApp.currentId++
	updateLocalStorage()
	addTasksAndInfoInToDOM()
}

// ordem dos itens


const ordering = event => {
	const {id} = event.target
	todoApp.reverse = id === 'reverse' ? true : false
	update()
}

const checkOrder = () => {
	radioEls.forEach(radioEl => {
		if (radioEl.id === 'reverse') {
			radioEl.checked = todoApp.reverse
		} else {
			radioEl.checked = !todoApp.reverse
		}
	})
}


// controle de tarefas

const createTask = () => {
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
			`${dayName}, ${monthName} ${dayNumber}, ${fullYear}`,
			time: `${hh}:${mm}`
		}
	}
	
	todoApp.tasks.push(task)
	update()
}


// index definido no botão gerado pelo script

const deleteTask = index => {
	const newArray = todoApp.tasks.filter(({id}) => {
		return !(id === index)
	})
	
	todoApp.tasks = newArray
	update()
}

const clearAll = () => {
	todoApp.tasks = []
	todoApp.currentId = 0
	update()
}


// inicializador

const init = () => {
	getLocalStorage()
	checkOrder()
	addTasksAndInfoInToDOM()
}

window.addEventListener('load', init)
btnNew.addEventListener('click', createTask)
btnClear.addEventListener('click', clearAll)
radioEls.forEach(radioEl => 
	radioEl.addEventListener('input',ordering))
