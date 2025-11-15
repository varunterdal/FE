// Base URL of your backend on Render
const API = "https://backend-123-ecor.onrender.com";

// ---------------- BLOG MANAGEMENT ----------------
const blogList = document.getElementById('blogList');
const addBtn = document.getElementById('addBtn');

if (addBtn) {
  addBtn.addEventListener('click', addBlog);
  fetchBlogs();
} else if (blogList) {
  fetchBlogs();
}

// Fetch all blogs
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
    if (!res.ok) return alert(data.message);

    // Clear fields after adding
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('author').value = '';

    fetchBlogs();
  } catch (err) {
    console.error('Error adding blog:', err);
  }
}

// Delete a blog
async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog?')) return;

  try {
    const res = await fetch(`${API}/blogs/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return alert(data.message);

    fetchBlogs();
  } catch (err) {
    console.error('Error deleting blog:', err);
  }
}
