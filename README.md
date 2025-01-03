# Node.js/Express + React + Tailwind EV Charging System

This is a simple EV charging system that allows users to view charging stations, reserve a charging station, and view their reservations. The system is built using Node.js/Express, React, and Tailwind CSS.

# How to start the app

Start Backend:

1. open terminal instance
2. cd server
3. npm install
4. npm start

Start Frontend:

1. open terminal instance
2. cd client
3. npm install
4. npm start
5. open browser
6. type localhost:3000

# How to use:

- Check "User" section for available user ids
- Use user id (Numbers 1-5) in the "Create New Reservation" section to queue new user for charging
- In the "Reservations" section, use buttons to "Start", "Complete" or "Cancel" reservation
- Use "Chargers" section to check for "in use" or "available" chargers and the time spent charging

# Considerations for improvement

- Login sessions using JWT
- Store user data in a database to persist data over page refreshes

# Tech stack

- Node.js/Express
- React
- Tailwind

# Deployed

Use the following link to check the app if you don't want to start it locally:

Deployed to Railway: [EV Charging System App](https://nodejs-react-ev-charging-station-production-abd5.up.railway.app/)
