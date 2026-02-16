const post = async (endpoint, data) => {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    return await res.json();
}


document.getElementById('formid').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    console.log(e.target)
    console.log(fd);
    console.log(data);
    const msg = await post('/api/employee', data);
    if (msg.msg) {
        alert(msg.msg);
        window.location.replace("/login.html");
    }
    else {
        alert("error");
    }
})
