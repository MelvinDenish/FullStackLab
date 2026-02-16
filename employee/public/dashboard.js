const get = async (endpoint) => {
    const res = await fetch(endpoint)
    return await res.json();
}
let data, id;


const updateEmp = (id) => {
    const div = document.getElementById('details');
    div.innerHTML = `<div>
        Name : <input id='name-${id}' value='${data.name}'><br>
        Age : <input id='age-${id}' value='${data.age}'><br>
        Dept : <input id='dept-${id}' value='${data.dept}'><br>
        salary : <input id='salary-${id}' value='${data.salary}'><br>
        email : <input id='email-${id}' value='${data.email}'><br>
        password : <input id='password-${id}' value='${data.password}'><br>
        <button onclick='save(${id})'>save</button>
        `
}

window.onload = async () => {
    id = localStorage.getItem('userId');
    data = await get(`/api/employee/${id}`)

    const div = document.getElementById('details');
    div.innerHTML = `<div>
        Name : ${data.name}<br>
        Age : ${data.age}<br>
        Dept : ${data.dept}<br> 
        Salary : ${data.salary}<br>
        Email : ${data.email}<br>
        Password : ${data.password}<br>
        <button onclick="updateEmp(${data.id})">Update</button>
    </div>`;
}

const cancel = () => {
    location.reload();
}
const save = async (id) => {
    const data = {
        id,
        name: document.getElementById(`name-${id}`).value,
        age: document.getElementById(`age-${id}`).value,
        dept: document.getElementById(`dept-${id}`).value,
        salary: document.getElementById(`salary-${id}`).value,
        email: document.getElementById(`email-${id}`).value,
        password: document.getElementById(`password-${id}`).value,
    }
    const op = await fetch(`/api/employee/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const res = await op.json();
    console.log(res);
    if (res.msg) {
        alert('saved successfully');
        location.reload();
    }
    else {
        alert('cant save');
    }
}
