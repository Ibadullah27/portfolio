import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import parse from 'html-react-parser';
import './firebase-client';
import legacyMarkup from './legacy-markup.html?raw';
import './app.css';
import '../css/style.css';

function Portfolio() {
  const markup = legacyMarkup
    .replace('href="#contact" class="nav-link">Contact</a>', 'href="#contact" class="nav-link">Contact</a><a href="/blog" class="nav-link">Blog</a>');
  useEffect(() => { import('../js/main.js').then(({ initLegacyPortfolio }) => initLegacyPortfolio()); }, []);
  return <>{parse(markup)}</>;
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/posts').then(r => r.ok ? r.json() : Promise.reject()).then(setPosts).catch(() => setError('Blog posts are not available yet.')); }, []);
  return <main className="app-page"><header className="app-top"><a href="/" className="brand-badge">IBA</a><nav><a href="/">Portfolio</a><a href="/admin">Admin</a></nav></header><section className="app-content"><p className="section-tag">Notes & ideas</p><h1 className="section-title">The Blog</h1><p className="section-subtitle">Thoughts on software, learning, and building useful things.</p>{error && <p>{error}</p>}<div className="post-grid">{posts.map(post => <article className="post-card" key={post.id}>{post.cover && <img src={post.cover} alt=""/>}<p className="post-date">{post.date || ''}</p><h2>{post.title}</h2><p>{post.excerpt}</p><div className="post-body">{post.content}</div></article>)}</div>{!error && posts.length === 0 && <p className="empty-note">New writing is on the way.</p>}</section></main>;
}

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false), [posts, setPosts] = useState([]), [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover: '', published: false });
  const [password, setPassword] = useState('');
  const loadPosts = () => fetch('/api/posts?all=1').then(r => r.ok ? r.json() : Promise.reject()).then(setPosts).catch(() => setMessage('Posts need Firebase Admin credentials configured on the server.'));
  useEffect(() => { fetch('/api/auth/session').then(r => { if (r.ok) { setLoggedIn(true); loadPosts(); } }); }, []);
  async function login(e) { e.preventDefault(); const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ password }) }); if (r.ok) { setLoggedIn(true); setMessage(''); loadPosts(); } else setMessage('Sign in failed. Check your admin password.'); }
  async function save(e) { e.preventDefault(); const r = await fetch('/api/posts', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) }); if (!r.ok) { setMessage('Could not save post. Check server configuration.'); return; } setForm({ title:'',excerpt:'',content:'',cover:'',published:false }); setMessage('Post saved.'); loadPosts(); }
  async function remove(id) { const r = await fetch(`/api/posts/${id}`, { method:'DELETE' }); if (r.ok) loadPosts(); else setMessage('Could not delete this post.'); }
  async function upload(file) { const sign = await fetch('/api/cloudinary-sign', { method:'POST' }).then(r => r.json()); const data = new FormData(); data.append('file',file); data.append('api_key',sign.apiKey); data.append('timestamp',sign.timestamp); data.append('signature',sign.signature); const uploaded = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,{method:'POST',body:data}).then(r=>r.json()); if (uploaded.secure_url) setForm(f=>({...f,cover:uploaded.secure_url})); else setMessage('Image upload failed.'); }
  return <main className="app-page"><header className="app-top"><a href="/" className="brand-badge">IBA</a><nav><a href="/">Portfolio</a><a href="/blog">View blog</a></nav></header><section className="app-content admin-content"><p className="section-tag">Private area</p><h1 className="section-title">Blog Admin</h1>{message && <p className="form-message">{message}</p>}{!loggedIn ? <form onSubmit={login} className="admin-panel narrow"><label>Admin password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="btn btn-primary">Sign in</button></form> : <><form onSubmit={save} className="admin-panel"><h2>Write a post</h2><label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required maxLength="120"/></label><label>Excerpt<input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} required maxLength="240"/></label><label>Article<textarea rows="10" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/></label><label>Cover image <input type="file" accept="image/*" onChange={e=>e.target.files?.[0] && upload(e.target.files[0])}/></label>{form.cover && <img className="cover-preview" src={form.cover} alt="Cover preview"/>}<label className="check-row"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish immediately</label><button className="btn btn-primary">Save post</button></form><div className="admin-panel"><h2>Posts</h2>{posts.map(post=><div className="admin-post" key={post.id}><span>{post.title} · {post.published ? 'Published' : 'Draft'}</span><button onClick={()=>remove(post.id)}>Delete</button></div>)}</div><button className="text-button" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});setLoggedIn(false)}}>Sign out</button></>}</section></main>;
}

function App() { const path = location.pathname; return path.startsWith('/admin') ? <Admin/> : path.startsWith('/blog') ? <Blog/> : <Portfolio/>; }

createRoot(document.getElementById('root')).render(<App/>);
