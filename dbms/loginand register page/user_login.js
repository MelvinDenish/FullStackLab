const form2=document.getElementById("f");

form2.addEventListener("submit",async (e)=>
{
    e.preventDefault();
    const data=new FormData(form2);
    const obj=Object.fromEntries(data.entries());

    try{
        const result=await fetch("http://localhost:3000/register",{
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify(obj)
        });

        const res=await result.json();
           if(res.err)
{
    localStorage.setItem("err",res.err);
    alert("error in regsitering ")
    window.location.href="err.html"   
     
}
else
{
     localStorage.setItem("username",res.username);
    localStorage.setItem("purpose",res.msg);
    alert("registered succcessffully");
    window.location.href="daashboard.html";
}

    }catch(err){
        console.log(err);
    }
});
