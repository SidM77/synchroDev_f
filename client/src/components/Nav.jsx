import whiteLogo from '../images/sDlogo_white.png'
import colorLogo from '../images/sDlogo_colour.png'

const Nav = ({ minimal, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true)
    setIsSignUp(false)
  }
  const authToken = false
  return (
    <nav>
      <div className="logo-container">
        <img
          className="logo"
          src={minimal ? colorLogo : whiteLogo}
          alt="logo"
        />
      </div>
      {!authToken && !minimal && (
        <button
          onClick={handleClick}
          disabled={showModal}
          className="nav-button"
        >
          LOGIN
        </button>
      )}
    </nav>
  )
}

export default Nav
