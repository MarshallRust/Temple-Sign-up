const calendar = document.getElementById('calendar')
const formArea = document.getElementById('formArea')
const loader = document.getElementById('loader')

const API_URL = "https://script.google.com/macros/s/AKfycbyCj0Xg5nV-4m0qsr0N_8uv3mt2LWMjdumXNmXHj6yXzy6Db9_qkX2xnDHvoqtTKhsk/exec"

let selectedDate = null
let selectedElement = null
const booked = {}

const year = 2026
const month = 2

loader.style.display = "flex"

fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    try {
      const data = JSON.parse(text)
      data.forEach(d => booked[d] = true)
    } catch(e){}
    loader.style.display = "none"
    buildCalendar()
  })
  .catch(() => {
    loader.style.display = "none"
    buildCalendar()
  })

function buildCalendar(){
    calendar.innerHTML = ""
    for (let i = 1; i <= 31; i++) {
        const d = document.createElement('div')
        const dateObj = new Date(year, month, i)
        const day = dateObj.getDay()

        d.className = 'day'
        d.innerText = i

        if (day === 0 || day === 1 || booked[i]) {
            d.classList.add('booked')
        } else {
            d.onclick = () => selectDate(i, d)
        }

        calendar.appendChild(d)
    }
}

function selectDate(date, el){
    if(el.classList.contains('booked')) return

    if(selectedElement){
        selectedElement.classList.remove('selected')
    }

    el.classList.add('selected')
    selectedElement = el
    selectedDate = date

    formArea.style.display = 'block'
}

function confirmBooking(){
    if(!selectedDate) return alert('Select a date')

    const name = document.getElementById("nameInput").value
    const email = document.getElementById("emailInput").value
    const time = document.getElementById("timeInput").value
    const ordinance = document.getElementById("ordinanceInput").value
    const family = document.getElementById("familyInput").value

    loader.style.display = "flex"
    calendar.style.display = "none"

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            date: selectedDate,
            name: name,
            email: email,
            time: time,
            ordinance: ordinance,
            family: family
        }).toString()
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "duplicate"){
            loader.style.display = "none"
            calendar.style.display = "grid"
            alert("Sorry, this date was already booked.")
            return
        }

        booked[selectedDate] = true
        selectedElement.classList.remove('selected')
        selectedElement.classList.add('booked')

        selectedDate = null
        selectedElement = null
        formArea.style.display = 'none'

        loader.style.display = "none"
        calendar.style.display = "grid"
        buildCalendar()
    })
    .catch(() => {
        loader.style.display = "none"
        calendar.style.display = "grid"
        buildCalendar()
    })
}