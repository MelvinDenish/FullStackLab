const API = 'http://localhost:3000/api';

// Navigation
function show(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Toggle button style
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById('btn-' + pageId).classList.add('active-btn');

    if (pageId === 'fac') {
        fetchCourses();
        fetchStudents();
    }
}

// Helpers
async function post(endpoint, data) {
    const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

// 1. Register Student
async function registerStudent(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const response = await post('/students', data);
    alert(response.message || 'Error registering');
    e.target.reset();
}

// 2. Add Course
async function addCourse(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const response = await post('/courses', data);
    alert(response.message);
    e.target.reset();
    fetchCourses();
}

async function fetchCourses() {
    const res = await fetch(`${API}/courses`);
    const courses = await res.json();
    const list = document.getElementById('courseList');
    list.innerHTML = courses.map(c => `
        <div class="course-item">
            <span>${c.name} (${c.code})</span>
            <button class="del-btn" onclick="deleteCourse('${c.id}')">Delete</button>
        </div>
    `).join('');
}

async function deleteCourse(id) {
    if (!confirm('Delete this course?')) return;
    await fetch(`${API}/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
}

// 3. Marks Management
async function fetchStudents() {
    const res = await fetch(`${API}/students`);
    const students = await res.json();
    const select = document.getElementById('studentSelect');
    select.innerHTML = '<option value="">Select Student</option>' +
        students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
}

function resetMarks() {
    document.getElementById('marksArea').innerHTML = '';
    document.getElementById('total').innerText = 'Total Marks: 0';
}

async function loadMarks() {
    const sid = document.getElementById('studentSelect').value;
    if (!sid) return alert('Please select a student');

    const [stRes, coRes] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/courses`)
    ]);

    const students = await stRes.json();
    const courses = await coRes.json();
    const student = students.find(s => s.id == sid);

    const marksArea = document.getElementById('marksArea');
    marksArea.innerHTML = courses.map(c => `
        <div class="marks-row">
            <label>${c.name}:</label>
            <input type="number" class="mark-input" data-cid="${c.id}" 
                   value="${student.marks[c.id] || ''}" placeholder="0" oninput="calcTotal()">
        </div>
    `).join('') + '<button class="primary-btn" onclick="saveMarks()">Save Marks</button>';

    calcTotal();
}

function calcTotal() {
    let total = 0;
    document.querySelectorAll('.mark-input').forEach(inp => total += Number(inp.value));
    document.getElementById('total').innerText = 'Total Marks: ' + total;
}

async function saveMarks() {
    const sid = document.getElementById('studentSelect').value;
    const marks = {};
    document.querySelectorAll('.mark-input').forEach(inp => {
        marks[inp.dataset.cid] = inp.value;
    });

    const res = await post('/marks', { sid, marks });
    alert(`Saved! Total: ${res.total}`);
}
