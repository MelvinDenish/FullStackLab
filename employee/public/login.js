const post = async (endpoint, data) => {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    const res1 = await res.json();
    console.log(res1);
    return res1;
}
document.getElementById('formid').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    console.log(e.target)
    console.log(fd);
    console.log(data);
    const res = await post('/api/employee/login', data);
    if (!res.emp)
        alert("invalid credentials");
    else {
        console.log(res.emp.id);
        localStorage.setItem('userId', res.emp.id);
        window.location.replace('/dashboard.html');

    }
})
