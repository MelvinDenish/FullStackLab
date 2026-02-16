const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());

app.post('/api/employee', (req, res) => {
    try {
        const emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
        emps.push({ ...req.body, id: Date.now() });
        fs.writeFileSync(path.join(__dirname, 'data', 'employees.json'), JSON.stringify(emps));
        res.json({ msg: "fucking successfull" })
        res.end();
    }
    catch (err) {
        console.log(err);
    }
})

app.post('/api/employee/login', (req, res) => {
    try {
        const emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
        const { email, password } = req.body;
        console.log(email, password);
        const emp = emps.find(e => e.email === email && e.password === password);
        // console.log(emp);
        if (!emp) {
            res.status(401).json({ msg: "Invalid login" })
            res.end();
        }
        else {
            res.status(200);
            // console.log(emp);
            res.json({ msg: "USER FOUND", emp: { ...emp } });
        }
        res.end();
    }
    catch (err) {
        console.log(err);
    }
})

app.get('/api/employee/:id', (req, res) => {
    const id = Number(req.params.id);
    const emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
    const emp = emps.find(e => e.id === id);
    if (!emp) {
        res.status(401);
        res.end();
    }
    res.json(emp);
    res.end();
})


app.get('/api/employees', (req, res) => {
    const emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
    console.log(emps);
    res.json(emps);
    res.end();
})



app.delete('/api/employee/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    let emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
    emps = emps.filter(e => e.id !== id);
    fs.writeFileSync(path.join(__dirname, 'data', 'employees.json'), JSON.stringify(emps));
    res.json({ msg: "deleted" });
    res.end();
})

app.put('/api/employee/:id', (req, res) => {
    const id = Number(req.params.id);
    let emps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'employees.json')));
    const udpates = req.body
    const idx = emps.findIndex(e => e.id === id);
    emps[idx] = {
        ...emps[idx],
        ...udpates,
        id: emps[idx].id,
    }
    fs.writeFileSync(path.join(__dirname, 'data', 'employees.json'), JSON.stringify(emps));
    res.json({ msg: "successfull" })
    res.end();
})

app.listen(3000, () => {
    console.log('server started');
})

