/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import TinderCard from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import Nav from '../components/Nav'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [specificUsers, setSpecificUsers] = useState(null)
  const [lastDirection, setLastDirection] = useState()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const userId = cookies.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId },
      })
      setUser(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const getSpecificUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/specific-users', {
        params: { domain: user?.domain_interest, userId },
      })

      setSpecificUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      getSpecificUsers()
    }
  }, [user])

  // console.log(specificUsers)

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put('http://localhost:8000/addmatch', {
        userId,
        matchedUserId,
      })
      getUser()
    } catch (e) {
      console.log(e)
    }
  }

  // console.log(user)

  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
      updateMatches(swipedUserId)
    }
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  if (user === null) {
    return (
      <div className="home">
        {/* <h1 className="loading">Loading...</h1> */}
        <img
          className="loading-animation"
          alt="Loading..."
          src="https://64.media.tumblr.com/9ca4a2538e8fb61842aeebcbef3d9435/50fb637a17cfb891-a1/s640x960/c5aaef27140a7acb5442a25f5891d8d3afb0e9f4.gif"
        ></img>
      </div>
    )
  }

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId)

  // console.log(matchedUserIds)
  const filteredSpecificUsers = specificUsers?.filter(
    (specificUser) => !matchedUserIds.includes(specificUser.user_id)
  )

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container overlay2">
            <div className="card-container">
              {specificUsers?.map((specificUser) => (
                <TinderCard
                  className="swipe"
                  key={specificUser.user_id}
                  onSwipe={(dir) => swiped(dir, specificUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(specificUser.first_name)}
                >
                  <div
                    style={{ backgroundImage: 'url(' + specificUser.url + ')' }}
                    className="card"
                  >
                    <h3>{specificUser.first_name}</h3>
                    <h4>{specificUser.about}</h4>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Dashboard
