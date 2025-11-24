# Vehicle Hub — Backend

This is the backend for **Vehicle Hub**, a web application where users can log in using their Gmail accounts, add vehicles, book vehicles, and view all vehicles. The backend is built using **Node.js, Express.js**, and **MongoDB**.

## Features

- REST API endpoints for vehicle and booking management
- User authentication (via Gmail/Google OAuth)
- Add, update, delete vehicles
- Book a vehicle and manage bookings
- Fetch all vehicles or filter by user email
- Integration with frontend React app

## API Endpoints

### Vehicles

| Method | Endpoint                | Description                        |
|--------|------------------------|------------------------------------|
| GET    | /allVehicles           | Fetch all vehicles (optional filter by `userEmail`) |
| GET    | /allVehicles/:id       | Fetch a single vehicle by ID       |
| POST   | /allVehicles           | Add a new vehicle                  |
| PUT    | /allVehicles/:id       | Update a vehicle by ID             |
| DELETE | /allVehicles/:id       | Delete a vehicle by ID             |

### Bookings

| Method | Endpoint                | Description                        |
|--------|------------------------|------------------------------------|
| POST   | /bookVehicles          | Book a vehicle                     |
| GET    | /bookVehicles          | Get all bookings (optional filter by `email`) |
| DELETE | /bookVehicles/:id      | Delete a booking by ID             |

## Technologies Used

- **Node.js** — Backend runtime  
- **Express.js** — Web framework for APIs  
- **MongoDB** — Database for storing vehicles and bookings  
- **dotenv** — Manage environment variables  
- **CORS** — Enable cross-origin requests  

## Environment Variables

The backend uses environment variables for security:

