const formulario = document.getElementById('formulario')
const input = document.getElementById('input')
const listaTarea = document.getElementById('lista-tareas')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()

// Info date
const dateNro = document.getElementById('dateNro');
const dateDia = document.getElementById('dateDia');
const dateMes = document.getElementById('dateMes');
const dateAño = document.getElementById('dateAño');
const setDate = () => {
    const date = new Date();
    dateNro.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateDia.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMes.textContent = date.toLocaleString('es', { month: 'short' });
    dateAño.textContent = date.toLocaleString('es', { year: 'numeric' });
};

let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    setDate()
    mostrarTareas()
})

listaTarea.addEventListener('click', e => {
    btnAccion(e)
})

// console.log(Date.now())

formulario.addEventListener('submit', e => {
    e.preventDefault()

    setTarea(e)
})

const setTarea = e => {
    if (input.value.trim() === '') {
        console.log('está vacio')
        return
    } 
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }
    tareas[tarea.id] = tarea
    // console.log(tareas)
    formulario.reset()
    input.focus()
    mostrarTareas()
}

const mostrarTareas = () => {

    localStorage.setItem('tareas', JSON.stringify(tareas))

    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas pendientes
        </div>
        `
        return
    }

    listaTarea.innerHTML = ''
    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto

        if (tarea.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    listaTarea.appendChild(fragment)
}

const btnAccion = e => {
    if (e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true
        mostrarTareas()
    }

    if (e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id]
        mostrarTareas()
    }

    if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        mostrarTareas()
    }

    e.stopPropagation()
}
