const calendar = document.getElementById('calendar')
const formArea = document.getElementById('formArea')

// ⭐ YOUR GOOGLE SHEETS API
const API_URL = "https://script.google.com/macros/s/AKfycbws6-Fv70GFTiypIncT5Ic19tfjd7ZVLgfud4ECEsSDyBaNhz7eQaML1KABbW87YiXN/exec"

let selectedDate = null
let selectedElement = null
const booked = {}

const year = 2026
const month = 2

// ⭐ Load booked dates from Google Sheet
fetch(API_URL)
  .then(res => res.text())
  .then(text => {
      try {
          const data = JSON.parse(text)
          data.forEach(d => booked[d] = true)
      } catch(e){
          console.log("API returned non JSON:", text)
      }
      buildCalendar()
  })
  .catch(() => buildCalendar())

// ⭐ Build calendar
function buildCalendar(){
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

// ⭐ Select date
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

// ⭐ Confirm booking
function confirmBooking(){
    if(!selectedDate) return alert('Select a date')

    const name = document.getElementById("nameInput").value
    const time = document.getElementById("timeInput").value
    const ordinance = document.getElementById("ordinanceInput").value
    const family = document.getElementById("familyInput").value

    // ⭐ Send booking to Google Sheet
    fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
        date: selectedDate,
        name: name,
        time: time,
        ordinance: ordinance,
        family: family
    }).toString()
})

    alert(`Booked March ${selectedDate}, 2026`)

    booked[selectedDate] = true
    selectedElement.classList.remove('selected')
    selectedElement.classList.add('booked')

    selectedDate = null
    selectedElement = null
    formArea.style.display = 'none'
}