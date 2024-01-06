/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import Nav from '../components/Nav'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    show_domain: false,
    domain_identity: '',
    domain_interest: '',
    email: '',
    url: '',
    about: '',
    matches: [],
  })
  let navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:8000/user', {
        formData,
      })
      const success = response.status === 200
      if (success) navigate('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }
  const handleChange = (e) => {
    const value =
      e.target.value === 'checkbox' ? e.target.checked : e.target.value
    const name = e.target.name
    console.log(e)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    console.log(formData)
  }
  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />
      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">First Name</label>

            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="firstName"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />
            <label>Birthday</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>domain</label>
            <div className="multiple-input-container">
              <input
                id="webDevelopmentIdentity"
                type="radio"
                name="domain_identity"
                value="webDevelopment"
                onChange={handleChange}
                checked={formData.domain_identity === 'webDevelopment'}
              />
              <label htmlFor="webDevelopmentIdentity">webDevelopment</label>
              <input
                id="appDevelopmentIdentity"
                type="radio"
                name="domain_identity"
                value="appDevelopment"
                onChange={handleChange}
                checked={formData.domain_identity === 'appDevelopment'}
              />
              <label htmlFor="appDevelopmentIdentity">appDevelopment</label>
              <input
                id="aimlIdentity"
                type="radio"
                name="domain_identity"
                value="aiml"
                onChange={handleChange}
                checked={formData.domain_identity === 'aiml'}
              />
              <label htmlFor="aimlIdentity">AI/ML</label>
              <input
                id="blockIdentity"
                type="radio"
                name="domain_identity"
                value="block"
                onChange={handleChange}
                checked={formData.domain_identity === 'block'}
              />
              <label htmlFor="blockIdentity">blockchain</label>
            </div>
            {/* <label htmlFor="show_domain">Show domain on Profile</label>
            <input
              id="show_domain"
              type="checkbox"
              name="show_domain"
              onChange={handleChange}
              checked={formData.show_domain}
            /> */}
            <label>showMeFollowingDomains</label>
            <div className="multiple-input-container">
              <input
                id="webDevelopmentInterest"
                type="radio"
                name="domain_interest"
                value="webDevelopment"
                onChange={handleChange}
                checked={formData.domain_interest === 'webDevelopment'}
              />
              <label htmlFor="webDevelopmentInterest">webDevelopment</label>
              <input
                id="appDevelopmentInterest"
                type="radio"
                name="domain_interest"
                value="appDevelopment"
                onChange={handleChange}
                checked={formData.domain_interest === 'appDevelopment'}
              />
              <label htmlFor="appDevelopmentInterest">appDevelopment</label>
              <input
                id="aimlInterest"
                type="radio"
                name="domain_interest"
                value="aiml"
                onChange={handleChange}
                checked={formData.domain_interest === 'aiml'}
              />
              <label htmlFor="aimlInterest">AI/ML</label>
              <input
                id="blockInterest"
                type="radio"
                name="domain_interest"
                value="block"
                onChange={handleChange}
                checked={formData.domain_interest === 'block'}
              />
              <label htmlFor="blockInterest">blockchain</label>
            </div>
            <label htmlFor="about">aboutMe</label>
            <input
              type="text"
              id="about"
              name="about"
              required={true}
              placeholder="A bit about yourself and your coding skills"
              value={formData.about}
              onChange={handleChange}
            />
            <input type="submit" />
          </section>
          <section>
            <label htmlFor="url">Profile Profile</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              {formData.url && <img src={formData.url} alt="profile pic" />}
            </div>
          </section>
        </form>
      </div>
    </>
  )
}

export default Onboarding
