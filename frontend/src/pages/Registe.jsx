import { useState } from 'react';
import api from '../api/axios';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/register', { name, email, password});
      onRegister(res.data);
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;