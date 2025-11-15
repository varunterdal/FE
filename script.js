// Base URL of your backend on Render (no trailing slash)
const API = "https://backend-kdsh.onrender.com";

// ---------------- LOGIN ----------------
function login() {
  const email = document.getElementById('loginEmail').value.trim();

  if (!email.endsWith('@kletech.ac.in')) {
    return alert('Email must end with @kletech.ac.in');
  }

  localStorage.setItem('userEmail', email);
  window.location.href = 'home.html';
}

// ---------------- NAVIGATION ----------------
function goToWrite() { window.location.href = 'write.html'; }
function goToView() { window.location.href = 'view.html'; }
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

async function addBlog() {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !content || !author) {
    return alert('All fields required');
  }

  try {
    await fetch(`${API}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author })
    });

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('author').value = '';

    fetchBlogs();
  } catch (err) {
    console.error('Error adding blog:', err);
  }
}

async function deleteBlog(id) {
  try {
    await fetch(`${API}/blogs/${id}`, { method: 'DELETE' });
    fetchBlogs();
  } catch (err) {
    console.error('Error deleting blog:', err);
  }
}
