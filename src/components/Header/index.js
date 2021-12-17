import {Link, withRouter} from 'react-router-dom'
import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutUser = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <Link to="/" className="logo-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
          className="nav-bar-website-logo"
          alt="website logo"
        />
      </Link>
      <ul className="nav-links-md ">
        <li className="header-nav-link-item">
          <Link to="/" className="nav-links">
            <p>Home</p>
          </Link>
        </li>

        <li className="header-nav-link-item">
          <Link to="/jobs" className="nav-links">
            <p>Jobs</p>
          </Link>
        </li>

        <li className="header-nav-link-item">
          <button type="button" className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </li>
      </ul>
      <ul className="nav-links-sm">
        <Link to="/" className="nav-bar-icons">
          <AiFillHome />
        </Link>
        <Link to="/jobs" className="nav-bar-icons">
          <BsBriefcaseFill />
        </Link>

        <button
          type="button"
          className="logout-logo-button"
          onClick={logoutUser}
        >
          <FiLogOut className="nav-bar-icons" />
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
