import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, LogOut, Plus, Heart, MessageSquare, Menu, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AlumniPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    parentEmail: '',
    parentPhone: '',
    rollNumber: '',
  });

  // University Register
  const [universityReg, setUniversityReg] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Post Creation
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'general',
  });

  const [selectedUniversity, setSelectedUniversity] = useState('');

  // ============================================
  // API FUNCTIONS
  // ============================================

  const handleUniversityRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/university/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(universityReg),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.university));
        setCurrentUser(data.university);
        setCurrentPage('admin-dashboard');
        alert('✅ University registered! Login with your credentials.');
        setUniversityReg({ name: '', email: '', password: '' });
      } else {
        alert('❌ ' + (data.error || 'Registration failed'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniSignup = async (e) => {
    e.preventDefault();
    if (!selectedUniversity) {
      alert('❌ Please enter University ID');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signupData, university: selectedUniversity }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setCurrentPage('waiting-approval');
        alert('✅ Signup successful! Waiting for admin approval.');
        setSignupData({
          name: '',
          email: '',
          password: '',
          phone: '',
          parentEmail: '',
          parentPhone: '',
          rollNumber: '',
        });
      } else {
        alert('❌ ' + (data.error || 'Signup failed'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setCurrentPage(data.user.role === 'admin' || data.user.role === 'representative' ? 'admin-dashboard' : 'alumni-dashboard');
        setLoginEmail('');
        setLoginPassword('');
        alert('✅ Login successful!');
      } else {
        alert('❌ ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('❌ Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });
      const data = await response.json();
      if (response.ok) {
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', type: 'general' });
        alert('✅ Post created!');
      } else {
        alert('❌ ' + (data.error || 'Post failed'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setCurrentPage('landing');
    setPosts([]);
  };

  // ============================================
  // NAVIGATION
  // ============================================

  const Navigation = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">A</div>
          <h1 className="text-2xl font-bold">Alumni Portal</h1>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          {currentUser ? (
            <>
              <span className="text-sm">👤 {currentUser.name || currentUser.email}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );

  // ============================================
  // LANDING PAGE
  // ============================================

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-blue-900 mb-6">Alumni Portal ☁️</h2>
            <p className="text-xl text-gray-700">100% Cloud-Based • Always Running • Zero Local Setup</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Login Card */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Alumni Login</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="Password"
                />
                <button 
                  onClick={handleLogin} 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600">New? <button onClick={() => setCurrentPage('alumni-signup')} className="text-blue-600 font-bold hover:underline">Sign Up</button></p>
              </div>
            </div>

            {/* University Registration Card */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-green-600">Register University</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={universityReg.name}
                  onChange={(e) => setUniversityReg({ ...universityReg, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                  placeholder="University Name (no spaces)"
                />
                <input
                  type="email"
                  value={universityReg.email}
                  onChange={(e) => setUniversityReg({ ...universityReg, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={universityReg.password}
                  onChange={(e) => setUniversityReg({ ...universityReg, password: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
                  placeholder="Password"
                />
                <button 
                  onClick={handleUniversityRegister}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>

            {/* Alumni Signup Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 overflow-y-auto max-h-96">
              <h3 className="text-2xl font-bold mb-6 text-center text-purple-600">Alumni Sign Up</h3>
              <div className="space-y-3">
                <input type="text" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Name" />
                <input type="email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Email" />
                <input type="password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Password" />
                <input type="tel" value={signupData.phone} onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Phone" />
                <input type="email" value={signupData.parentEmail} onChange={(e) => setSignupData({ ...signupData, parentEmail: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Parent Email" />
                <input type="tel" value={signupData.parentPhone} onChange={(e) => setSignupData({ ...signupData, parentPhone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Parent Phone" />
                <input type="text" value={signupData.rollNumber} onChange={(e) => setSignupData({ ...signupData, rollNumber: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Roll Number" />
                <input type="text" value={selectedUniversity} onChange={(e) => setSelectedUniversity(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="University ID" />
                <button 
                  onClick={handleAlumniSignup}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded disabled:opacity-50 text-sm"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-blue-100 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🌍 100% Cloud-Based</h3>
            <p className="text-gray-700">No local setup needed. Access from anywhere. Always running 24/7.</p>
            <p className="text-sm text-gray-600 mt-4">API: {API_URL}</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // WAITING APPROVAL PAGE
  // ============================================

  if (currentPage === 'waiting-approval') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Pending Approval</h2>
          <p className="text-gray-700 mb-6">Your account is being reviewed. Check back soon!</p>
          <button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // ALUMNI DASHBOARD
  // ============================================

  if (currentPage === 'alumni-dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">Welcome, {currentUser.name}! 👋</h2>
          
          {/* Post Creation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Share Your Thoughts ✍️</h3>
            <div className="space-y-4">
              <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Post Title" />
              <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2 h-24" placeholder="What's on your mind?" ></textarea>
              <select value={newPost.type} onChange={(e) => setNewPost({ ...newPost, type: e.target.value })} className="w-full border border-gray-300 rounded px-4 py-2">
                <option value="general">General</option>
                <option value="job">Job Opportunity</option>
                <option value="announcement">Announcement</option>
              </select>
              <button 
                onClick={handleCreatePost}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <p>No posts yet. Be the first to share! 🚀</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {post.author?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">{post.author?.name}</h4>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-2 text-red-500 hover:bg-red-50 px-3 py-1 rounded">
                      <Heart size={18} /> Like
                    </button>
                    <button className="flex items-center space-x-2 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded">
                      <MessageSquare size={18} /> Comment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN DASHBOARD
  // ============================================

  if (currentPage === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">Admin Dashboard 📊</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Alumni</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Visitors</p>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                <Plus size={20} className="inline mr-2" /> Create Event
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded">
                <Mail size={20} className="inline mr-2" /> Send Newsletter
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded">
                <User size={20} className="inline mr-2" /> Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
