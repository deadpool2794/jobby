import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import SkillItem from '../SkillItem'
import SimilarJobItem from '../SimilarJobItem'
import SomethingWentWrong from '../SomethingWentWrong'
import './index.css'

const jobDetailsPageStatusOptions = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class JobDetails extends Component {
  state = {
    pageStatus: jobDetailsPageStatusOptions.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobDetailsAPIUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const jobDetailsResponse = await fetch(jobDetailsAPIUrl, options)
    if (jobDetailsResponse.ok) {
      const parsedJobDetailsResponse = await jobDetailsResponse.json()
      this.success(
        parsedJobDetailsResponse.job_details,
        parsedJobDetailsResponse.similar_jobs,
      )
    } else {
      this.failed()
    }
  }

  failed = () => {
    this.setState({pageStatus: jobDetailsPageStatusOptions.failed})
  }

  success = (jobDetails, similarJobs) => {
    this.setState({
      jobDetails,
      similarJobs,
      pageStatus: jobDetailsPageStatusOptions.success,
    })
  }

  renderLoadingScreen = () => (
    <div className="loader-container for-job-det" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  formatJobDetail = jobDetail => ({
    companyLogoUrl: jobDetail.company_logo_url,
    companyWebsiteUrl: jobDetail.company_website_url,
    id: jobDetail.id,
    employmentType: jobDetail.employment_type,
    jobDescription: jobDetail.job_description,
    lifeAtCompany: jobDetail.life_at_company,
    location: jobDetail.location,
    packagePerAnnum: jobDetail.package_per_annum,
    rating: jobDetail.rating,
    skills: jobDetail.skills,
    title: jobDetail.title,
  })

  formatSimilarJobs = similarJobs => {
    const formattedSimilarJobs = similarJobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))

    return formattedSimilarJobs
  }

  renderSuccessJobDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const formattedJobDetails = this.formatJobDetail(jobDetails)

    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
      companyWebsiteUrl,
    } = formattedJobDetails

    const formattedSkills = skills.map(each => ({
      name: each.name,
      imageUrl: each.image_url,
    }))

    const formattedLifeAtCompany = {
      imageUrl: lifeAtCompany.image_url,
      description: lifeAtCompany.description,
    }

    const formattedSimilarJobs = this.formatSimilarJobs(similarJobs)

    return (
      <div className="job-details-container c-white">
        <div className="job-list-item">
          <div className="company-logo-name">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-company-logo"
            />
            <div className="name-and-rating">
              <h1 className="job-item-company-name">{title}</h1>
              <div className="star-rating">
                <AiFillStar className="star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-salary-container">
            <div className="location-type-container">
              <div className="location-container">
                <MdLocationOn />
                <p className="location">{location}</p>
              </div>
              <div className="type-container">
                <BsBriefcaseFill />
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <div className="description-visit">
            <h1 className="description-heading inc-fs">Description</h1>
            <a className="company-website-url" href={companyWebsiteUrl}>
              Visit <BsBoxArrowUpRight className="mt-mb" />
            </a>
          </div>

          <p className="job-description mb-inc">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {formattedSkills.map(each => (
              <SkillItem skillDetails={each} key={each.name} />
            ))}
          </ul>
          <h1 className="skills-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="job-description">{lifeAtCompany.description}</p>
            <img
              src={formattedLifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {formattedSimilarJobs.map(each => (
            <SimilarJobItem jobDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetry = () => {
    this.setState(
      {pageStatus: jobDetailsPageStatusOptions.initial},
      this.getJobDetails,
    )
  }

  render() {
    const {pageStatus} = this.state
    let requiredUI
    switch (pageStatus) {
      case jobDetailsPageStatusOptions.initial:
        requiredUI = <>{this.renderLoadingScreen()}</>
        break
      case jobDetailsPageStatusOptions.success:
        requiredUI = this.renderSuccessJobDetailsView()
        break

      case jobDetailsPageStatusOptions.failed:
        requiredUI = (
          <div className="job-details-failure">
            <SomethingWentWrong onRetry={this.onClickRetry} />
          </div>
        )
        break
      default:
        requiredUI = null
    }

    return (
      <>
        <Header />
        {requiredUI}
      </>
    )
  }
}

export default JobDetails
