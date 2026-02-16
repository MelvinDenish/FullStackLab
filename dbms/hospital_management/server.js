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

// Routes

// --- Doctors ---
app.get("/doctors", (req, res) => res.json(readJSON("doctors.json")));

app.post("/doctors", (req, res) => {
    const doctors = readJSON("doctors.json");
    const { name, department } = req.body;
    const id = Date.now();
    doctors.push({ id, name, department });
    saveJSON("doctors.json", doctors);
    res.json({ message: "Doctor added", doctor: { id, name, department } });
});

// --- Patients ---
app.get("/patients", (req, res) => res.json(readJSON("patients.json")));

app.post("/patients", (req, res) => {
    const patients = readJSON("patients.json");
    const { name, age, doctorId } = req.body;
    const id = Date.now();
    patients.push({ id, name, age, doctorId });
    saveJSON("patients.json", patients);
    res.json({ message: "Patient added", patient: { id, name, age, doctorId } });
});

app.delete("/patients/:id", (req, res) => {
    const patients = readJSON("patients.json");
    const id = parseInt(req.params.id);
    const newPatients = patients.filter(p => p.id !== id);
    saveJSON("patients.json", newPatients);
    res.json({ message: "Patient discharged" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
