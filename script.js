const calendar = document.getElementById('calendar')
const slotsDiv = document.getElementById('slots')

let selectedDate = null
let selectedSlot = null
const booked = {}

// ✅ HARD CODED TO MARCH 2026
const year = 2026
const month = 2   // March = 2 because months are 0-indexed

for (let i = 1; i <= 31; i++) {
    const d = document.createElement('div')
    const dateObj = new Date(year, month, i)
    const day = dateObj.getDay() // 0 = Sunday, 1 = Monday

    d.className = 'day'
    d.innerText = i

    // Grey out Sundays & Mondays
    if (day === 0 || day === 1) {
        d.classList.add('booked')
    } else {
        d.onclick = () => selectDate(i, d)
    }

    calendar.appendChild(d)
}

function selectDate(date, el) {
    if (el.classList.contains('booked')) return

    selectedDate = date
    slotsDiv.innerHTML = ''

    const times = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM']

    times.forEach(t => {
        const s = document.createElement('div')
        s.className = 'slot'

        if (booked[date]?.includes(t)) s.classList.add('booked')

        s.innerText = t
        s.onclick = () => {
            if (!s.classList.contains('booked')) selectedSlot = t
        }

        slotsDiv.appendChild(s)
    })
}

function confirmBooking() {
    if (!selectedDate || !selectedSlot) return alert('Select date and time')

    if (!booked[selectedDate]) booked[selectedDate] = []
    booked[selectedDate].push(selectedSlot)

    alert('Booked ' + selectedDate + ' at ' + selectedSlot)
    selectDate(selectedDate, calendar.children[selectedDate - 1])
}