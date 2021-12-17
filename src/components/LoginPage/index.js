import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginAPIUrl = 'https://apis.ccbp.in/login'
    const body = JSON.stringify({username, password})
    const options = {
      body,
      method: 'POST',
    }
    const loginResponse = await fetch(loginAPIUrl, options)
    const parsedLoginResponse = await loginResponse.json()
    if (loginResponse.ok) {
      this.loginSuccess(parsedLoginResponse.jwt_token)
    } else {
      this.loginFailure(parsedLoginResponse.error_msg)
    }
  }

  loginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({errorMsg})
  }

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  renderLoginForm = () => {
    const {username, password} = this.state
    return (
      <>
        <label htmlFor="userNameInput" className="login-form-labels">
          USERNAME
        </label>
        <input
          onChange={this.changeUsername}
          type="text"
          id="userNameInput"
          className="login-input-elements"
          value={username}
          placeholder="Username"
        />
        <label htmlFor="passwordInput" className="login-form-labels">
          PASSWORD
        </label>
        <input
          onChange={this.changePassword}
          type="password"
          id="passwordInput"
          className="login-input-elements"
          value={password}
          placeholder="Password"
        />
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {errorMsg} = this.state
    return (
      <div className="bg-container">
        <form className="login-form" onSubmit={this.submitLoginForm}>
          <div className="app-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="login-app-logo"
              alt="website logo"
            />
          </div>
          {this.renderLoginForm()}
          <button type="submit" className="login-form-submit">
            Login
          </button>
          {errorMsg !== '' ? <p className="error-msg">*{errorMsg}</p> : ''}
        </form>
      </div>
    )
  }
}

export default LoginPage
