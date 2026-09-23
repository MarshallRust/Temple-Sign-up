# Temple Sign-Up

A sign-up page for temple appointments. It's a calendar for one month. You pick a day, fill in your info, and it gets saved to a Google Sheet. If someone already picked that day it shows up in a different color so you know you can go with them.

No backend server. The site is just HTML/CSS/JS on GitHub Pages and a Google Apps Script web app acts as the API in front of the sheet.

## Files

- `index.html` - the page. Calendar on the right, title and color key on the left, and the booking form (hidden until you pick a day).
- `style.css` - all the styling. There's one media query at 768px that stacks the two columns for phones.
- `script.js` - everything that actually does anything, see below.
- `loading.gif` - spinner that shows while it's talking to the sheet.

## script.js

At the top it grabs the calendar, form, and loader elements, and sets `API_URL` (the Apps Script deployment URL), `year`, and `month`. `booked` is an object used as a lookup, day number -> true.

When the page loads it does a GET to `API_URL`. The script sends back a JSON list of day numbers that already have a booking, those go into `booked`, and then it builds the calendar. If the fetch fails it still builds the calendar, it just won't show anything as booked.

**`buildCalendar()`**
Clears the calendar and makes a div for days 1 through 31. Sundays and Mondays get the `disabled` class and no click handler since those days aren't available. Any day in `booked` gets the `booked` class. Every other day gets an onclick that calls `selectDate`.

**`selectDate(date, el)`**
Ignores disabled days. Otherwise it takes the highlight off whatever day was selected before, puts it on the new one, saves the day number in `selectedDate`, and shows the form.

**`confirmBooking()`**
Runs when you hit Confirm Booking. If no day is picked it alerts you. Otherwise it reads the five inputs (names, email, time, ordinance type, number of family names), hides the calendar, shows the loader, and POSTs everything to `API_URL`.

The POST is sent as `application/x-www-form-urlencoded` on purpose. If you send JSON the browser does a CORS preflight first and Apps Script doesn't answer those, so it just fails.

After the POST comes back it marks that day as booked, clears the selection, hides the form, and rebuilds the calendar. It also rebuilds on an error so the page doesn't get stuck on the loader.

## Apps Script side

The script isn't in this repo, it lives in the Google Sheet (Extensions > Apps Script). It needs:

- `doGet` - returns a JSON array of the day numbers that have bookings
- `doPost` - takes the form fields and appends a row to the sheet

Deploy it as a web app with access set to Anyone, then paste the `/exec` URL into `API_URL`.

## Running it

It's static, so just open `index.html`, or:

```
python3 -m http.server 8000
```

## Stuff I know is wrong

- The month is hardcoded. `month = 2` is March because JS months start at 0. Every new month I have to change it.
- `buildCalendar` always draws 31 days, so it's only right for 31-day months. It also doesn't offset the first day to the right weekday.
- There's no login, anyone with the link can book.
