
import { useState } from 'react'
import axios from 'axios'
import Login from './Login'
import './App.css'

function App() {

  const [isLogin, setIsLogin] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          name,
          email,
          password
        }
      )

      setMessage(response.data.message)

      setName('')
      setEmail('')
      setPassword('')

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }

  if (isLogin) {
    return <Login />
  }

  return (
    <div className="app">

      <div className="register-container">

        <h1>LearnHub</h1>

        <p className="subtitle">
          Create your student account
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <p>{message}</p>

        <p className="login-text">
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsLogin(true)
            }}
          >
            Login
          </a>
        </p>

      </div>

    </div>
  )
}

export default App
