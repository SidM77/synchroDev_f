/* eslint-disable no-unused-vars */
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = ({ setShowModal, setIsnSignUp, isSignUp }) => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)
  const [cookie, setCookie, removeCookie] = useCookies(['user'])

  let navigate = useNavigate()
  const handleClick = () => {
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isSignUp && password !== confirmPassword) {
        setError('Passwords need to match!')
        return
      }
      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? 'signup' : 'login'}`,
        {
          email,
          password,
        }
      )
      setCookie('AuthToken', response.data.token)
      setCookie('UserId', response.data.userId)

      const success = response.status === 201

      if (success && isSignUp) navigate('/onboarding')
      if (success && !isSignUp) navigate('/dashboard')

      window.location.reload()
    } catch (error) {
      console.log('Error')
    }
  }

  return (
    <div className="auth-modal">
      <div className="close-button" onClick={handleClick}>
        ❌
      </div>
      <h2>{isSignUp ? 'createAccount()' : 'signIn()'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="eMail"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            placeholder="confirmPassword"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit" />
        <p>{error}</p>
      </form>
      <hr />
      <h3>appComingSoon</h3>
      AUTH MODAL
    </div>
  )
}
export default AuthModal
