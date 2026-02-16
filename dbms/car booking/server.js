const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Helper functions
const readJSON = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- Cars ---
app.get("/cars", (req, res) => res.json(readJSON("cars.json")));

app.post("/cars", (req, res) => {
    const cars = readJSON("cars.json");
    const { model, plate } = req.body;
    const id = Date.now();
    cars.push({ id, model, plate, available: true });
    saveJSON("cars.json", cars);
    res.json({ message: "Car added", car: { id, model, plate } });
});

// --- Bookings ---
app.get("/bookings", (req, res) => res.json(readJSON("bookings.json")));

app.post("/bookings", (req, res) => {
    const bookings = readJSON("bookings.json");
    const cars = readJSON("cars.json");
    const { customer, carId, days } = req.body;

    const car = cars.find(c => c.id === carId);
    if (!car) return res.status(400).json({ error: "Car not found" });
    if (!car.available) return res.status(400).json({ error: "Car already booked" });

    car.available = false;
    saveJSON("cars.json", cars);

    const id = Date.now();
    bookings.push({ id, customer, carId, days });
    saveJSON("bookings.json", bookings);

    res.json({ message: "Car booked successfully", booking: { id, customer, carId, days } });
});

app.delete("/bookings/:id", (req, res) => {
    const bookings = readJSON("bookings.json");
    const cars = readJSON("cars.json");
    const id = parseInt(req.params.id);

    const booking = bookings.find(b => b.id === id);
    if (!booking) return res.status(400).json({ error: "Booking not found" });

    const car = cars.find(c => c.id === booking.carId);
    if (car) car.available = true;
    saveJSON("cars.json", cars);

    const newBookings = bookings.filter(b => b.id !== id);
    saveJSON("bookings.json", newBookings);

    res.json({ message: "Booking canceled" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
