import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

class Profile extends Component {
  state = {
    profileDetails: {},
    apiFailed: false,
    isLoading: true,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const profileAPIUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileDetailsResponse = await fetch(profileAPIUrl, options)
    const parsedProfileData = await profileDetailsResponse.json()

    if (profileDetailsResponse.ok) {
      this.success(parsedProfileData.profile_details)
    } else {
      this.failure()
    }
  }

  failure = () => {
    this.setState({apiFailed: true, isLoading: false})
  }

  success = profileDetails => {
    this.setState({profileDetails, apiFailed: false, isLoading: false})
  }

  renderProfileCard = () => {
    const {profileDetails} = this.state
    const {name} = profileDetails
    let shortBio
    let imageUrl
    if (name !== undefined) {
      shortBio = profileDetails.short_bio
      imageUrl = profileDetails.profile_image_url
    }

    return (
      <div className="profile-container">
        <img src={imageUrl} alt="profile" className="profile-avatar" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-role">{shortBio}</p>
      </div>
    )
  }

  onClickGetProfileDetails = () => {
    this.setState({isLoading: true}, this.getProfileDetails)
  }

  renderFailureView = () => (
    <div className="retry-button-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickGetProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingScreen = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiFailed, isLoading} = this.state
    let required
    if (isLoading) {
      required = this.renderLoadingScreen()
    } else if (apiFailed) {
      required = this.renderFailureView()
    } else {
      required = this.renderProfileCard()
    }
    return required
  }
}

export default Profile
