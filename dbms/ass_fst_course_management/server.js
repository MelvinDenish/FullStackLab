const express=require("express");
const fs=require("fs");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
function readStudent()
{
    return   JSON.parse(fs.readFileSync("students.json","utf-8"));
}
function saveStudent(data)
{
    try{
    fs.writeFileSync("students.json",JSON.stringify(data));
    }
    catch(err)
    {
        throw new Error(err);
    }
}
function readCourse()
{
    return   JSON.parse(fs.readFileSync("courses.json","utf-8"));
}
function saveCourse(data)
{
    try{
    fs.writeFileSync("courses.json",JSON.stringify(data));
    }
    catch(err)
    {
        throw new Error(err);
    }
}
app.post("/addStudent",(req,res)=>{
        try{    
    const body=req.body;
        const users=readStudent();
        users.push(body);
        saveStudent(users);
        res.status(201).json({msg:"added sucessfully",user:body.username});
        }
        catch(err)
        {
            throw new Error("Error in file")
        }
});
app.post("/addCourse",(req,res)=>{
    const body=req.body;
    var courses=readCourse();
    courses.push(body);
    saveCourse(courses);
    res.json({msg:"course added",courseid:body.courseid});
});
app.get("/getcourses",(req,res)=>{
    const courses=readCourse();
    res.json({c:courses});
})
app.get("/deletecourse/:id",(req,res)=>{
    const id=req.params.id;
    var courses=readCourse();
    var cc=courses.filter(c=>c.courseid!==id);    
    saveCourse(cc);
    res.json({msg:"deleted successfully"});
})
app.post("/update/:id",(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    var users=readStudent();
    let flag=true;
    console.log(id,body);
    users.forEach(u=>
    {
        if(u.userid==id)
        {
            flag=false;
            u.marks=body.marks;
        }
    }
    );
    if(flag)
    {
        res.json({msg:"user not found"});
    }
    else
    {
        saveStudent(users);
        res.json({msg:"marks updated",userid:id});
    }
});
app.listen(3000,()=>
{
    console.log("server is running on port 3000");
})
