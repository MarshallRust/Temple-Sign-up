# Temple Sign-Up

A small booking site where family members pick a date to go to the temple together. It shows a month calendar, lets someone claim a day and fill in their details, and saves every booking to a Google Sheet. There's no server to run or pay for.

## Features

- **Month calendar** that marks each day as open, already booked (you can still join someone), or unavailable (Sundays and Mondays).
- **Multiple sign-ups per day.** Booking a date that's already taken adds you to it instead of blocking you.
- **Booking form:** names, email, appointment time, ordinance type, and number of family names.
- **Collects an email** with each booking so people can get a confirmation.
- **Loading state** while bookings are fetched and saved.
- **Responsive layout** that works on phones.

## How it works

```
index.html / style.css / script.js   (static site, GitHub Pages)
            │  GET  → list of booked dates
            │  POST → new booking (form-encoded)
            ▼
Google Apps Script web app  ──►  Google Sheet (one row per booking)
```

- On page load, `script.js` fetches the booked dates from the Apps Script endpoint and draws the calendar.
- On confirm, the booking is POSTed as `application/x-www-form-urlencoded`. That avoids a CORS preflight, which Apps Script web apps don't handle.
- The Sheet is the database, so bookings can be viewed or edited directly in Google Sheets.

## Tech

Plain HTML, CSS and JavaScript (no framework or build step), Google Apps Script, Google Sheets, GitHub Pages.

## Running it

It's a static site, so open `index.html` in a browser or serve the folder:

```bash
python3 -m http.server 8000
```

To point it at your own Sheet, deploy an Apps Script web app that handles `doGet` (return booked dates as JSON) and `doPost` (append a row), then set `API_URL` at the top of `script.js`.

## Notes / limitations

- The month shown is set in code (`year` / `month` in `script.js`), so it has to be updated for each new month.
- There's no authentication. Anyone with the link can book, which is fine for a family link.
