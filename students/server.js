const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const DB = (file) => `${__dirname}/data/${file}.json`;
const readInfo = (file) => {
    try { return JSON.parse(fs.readFileSync(DB(file), 'utf8')); } catch { return []; }
};
const saveInfo = (file, data) => fs.writeFileSync(DB(file), JSON.stringify(data));

// Registration
app.post('/api/students', (req, res) => {
    const students = readInfo('students');
    students.push({ ...req.body, marks: {} });
    saveInfo('students', students);
    res.json({ message: 'Registered!' });
});

app.get('/api/students', (req, res) => res.json(readInfo('students')));
app.get('/api/courses', (req, res) => res.json(readInfo('courses')));

app.post('/api/courses', (req, res) => {
    const courses = readInfo('courses');
    courses.push({ ...req.body, id: Date.now().toString() });
    saveInfo('courses', courses);
    res.json({ message: 'Course Added' });
});

// Delete Course & associated marks
app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const courses = readInfo('courses').filter(c => c.id != id);
    saveInfo('courses', courses);

    // Remove marks for this course from all students
    const students = readInfo('students');
    students.forEach(s => {
        if (s.marks[id]) delete s.marks[id];
    });
    saveInfo('students', students);

    res.json({ message: 'Deleted' });
});

app.post('/api/marks', (req, res) => {
    const { sid, marks } = req.body;
    const students = readInfo('students');
    const student = students.find(s => s.id == sid);
    if (student) {
        student.marks = marks; // Overwrite marks with only current valid ones
        const total = Object.values(student.marks).reduce((a, b) => Number(a) + Number(b), 0);
        saveInfo('students', students);
        res.json({ total });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

app.listen(3000, () => console.log('Server running on 3000'));
