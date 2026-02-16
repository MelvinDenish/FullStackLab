const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filePath = path.join(__dirname, "employee.json");

function readInfo() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveInfo(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}


app.post("/register", (req, res) => {
    try {
        const { username, password, gender, email, salary ,dept} = req.body;

        const users = readInfo();

        // check duplicate email (better than name)
        const exists = users.find(u => u.username === username);

        if (exists)
            return res.json({ err: "email already registered" });

        users.push({
            username,
            password,
            gender,
            email,
            dept,
            salary: Number(salary)
        });

        saveInfo(users);

        res.json({ msg: "registration successful",username:username});

    } catch (err) {
        console.error(err);
        res.status(500).json("register failed");
    }
});


app.post("/update/:username",(req,res)=>
{
    const body=req.body;
    const uname=req.params.username;
    const users=readInfo();
users.forEach(u => {
    if (u.username === uname) {
        u.username = body.username;
        u.gender = body.gender;
        u.email = body.email;
        u.salary = body.salary;
        u.dept = body.dept;
        u.password = body.password;
        console.log("hi");
    }
});
    saveInfo(users);
   res.json({ msg: "updated successfully",username:body.username}) ;
});
app.get("/get/:username",(req,res)=>
{

    const uname=req.params.username;
    console.log(uname);
    const users=readInfo();
    const user=users.find(u=>u.username===uname);
    res.json({user});
})
app.post("/login", (req, res) => {
    try {
        const users = readInfo();

        const user = users.find(
            u => u.username === req.body.username

        );

        if (!user)
            return res.json({ err: "invalid user" });

        if (user.password !== req.body.password)
            return res.json({ err: "incorrect password" });

        res.json({ msg: "login successful",username:user.username});

    } catch (err) {
        console.error(err);
        res.status(500).json({err:"login failed"});
    }
});

app.get("/display/:dept",(req,res)=>
{
    const dept=req.params.dept;
    const users=readInfo();
    const u=users.find(u=>u.dept===dept);
    if(!u)
        res.json({employees:"no found"});
    else    
        res.json({employees:u});
})
app.delete("/delete/:id",(req,res)=>
{
    const users=readInfo();
    const user=users.find(u=>u.username===req.params.id);
    const data=users.filter(u=>u.username!==req.params.id);
    saveInfo(data);
    if(!user)
        res.json({err:" user not found"});
    res.json({msg:"user deleted succesfully"});
})
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
