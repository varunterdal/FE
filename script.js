// Base URL of your backend on Render
const API = "https://backend-kdsh.onrender.com";

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email.endsWith('@kletech.ac.in')) {
    return alert('Email must end with @kletech.ac.in');
  }
  if (!password) return alert('Password required');

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('userEmail', email);
      window.location.href = 'home.html';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed');
  }
}

// ---------------- NAVIGATION ----------------
function goToWrite() { window.location.href = 'write.html'; }
function goToView()  { window.location.href = 'view.html'; }
function goToHome()  { window.location.href = 'home.html'; }

// ---------------- BLOG MANAGEMENT ----------------
const blogList = document.getElementById('blogList');
const addBtn = document.getElementById('addBtn');

if (addBtn) {
  addBtn.addEventListener('click', addBlog);
  fetchBlogs();
} else if (blogList) {
  fetchBlogs();
}

// Fetch blogs from MongoDB backend
async function fetchBlogs() {
  try {
    const res = await fetch(`${API}/blogs`);
    const blogs = await res.json();

    if (!blogList) return;
    blogList.innerHTML = '';

    blogs.forEach(blog => {
      const div = document.createElement('div');
      div.classList.add('blog');
      div.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.content}</p>
        <small>${blog.author} | ${new Date(blog.date).toLocaleString()}</small>
        <br>
        <button class="delete-btn" onclick="deleteBlog('${blog._id}')">Delete</button>
      `;
      blogList.appendChild(div);
    });
  } catch (err) {
    console.error('Error fetching blogs:', err);
  }
}

// Add a new blog
async function addBlog() {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !content || !author) return alert('All fields required');

  try {
    const res = await fetch(`${API}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
      document.getElementById('author').value = '';
      fetchBlogs();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error adding blog:', err);
    alert('Failed to add blog');
  }
}

// Delete a blog
async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog?')) return;

  try {
    const res = await fetch(`${API}/blogs/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      fetchBlogs();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error deleting blog:', err);
    alert('Failed to delete blog');
  }
}
