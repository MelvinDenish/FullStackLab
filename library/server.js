const express=require('express')
const app=express();
const fs=require('fs');
const bodyparser=require('body-parser');
const path=require('path')
app.use(bodyparser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'))
const json_dir=path.join(__dirname,"JSON_FILES");
console.log(json_dir);
function readJson(filepath){
    return JSON.parse(fs.readFileSync(filepath));
}
function writeJson(filepath,data){
    fs.writeFileSync(filepath,JSON.stringify(data));
}
let registereduser=[];
app.post('/register',(req,res)=>{
    registereduser=readJson(json_dir+"/user.json");
    registereduser.push({...req.body,borrow:[]});
    console.log(registereduser)
    writeJson(json_dir+"/user.json",registereduser)
    res.json({message:"registered success"});

})
app.post('/login',(req,res)=>{
    registereduser=readJson(json_dir+"/user.json");
    console.log(registereduser)
    const user = registereduser.find(e => e.user===req.body.user && e.pass === req.body.pass)
    if(!user)
    {
res.json({message:"login failed"})
    }
    if(user.user==='admin')
    {
res.json({message:"admin"})
    }
    else if(user){
        res.json({message:"success"})

    }

})
let books=[];
app.post('/addbook',(req,res)=>{
    books=readJson(json_dir+"/book.json");
    books.push({...req.body});
    console.log(books)
    writeJson(json_dir+"/book.json",books)
    res.json({message:"book added"});

})
app.post('/allbook',(req,res)=>{
    books=readJson(json_dir+"/book.json");
    //console.log(books)
    res.json(books);

})
app.post('/update',(req,res)=>{
    books=readJson(json_dir+"/book.json");
    console.log(books)
    books.forEach(book=> {if(book.bid===req.body.bid){
        book.bname=req.body.bname;
        book.author=req.body.author;


    }
    writeJson(json_dir+"/book.json",books)
    res.json({message:"updated"})
        
    });

    

})

app.post('/borrow',(req,res)=>{
    registereduser=readJson(json_dir+"/user.json");
     books=readJson(json_dir+"/book.json");
     console.log(req.body);
     books.forEach(book=>{
        if(book.bid==req.body.bid){
            console.log("entered")
            if(book.nbk>0)
           { book.nbk-=1;
            console.log(book.nbk)
            writeJson(json_dir+"/book.json",books);
           }
            else
                res.json({message:"cannot borrow"});


        }
     })

    registereduser.forEach(user=>{
        if(user.user===req.body.user){
            user.borrow.push(req.body.bid)
            res.json({message:"borrowed success"});
        }
    })
    
     writeJson(json_dir+"/user.json",registereduser)
    

    
    
})

app.listen(3000,()=>{console.log("hi")});

