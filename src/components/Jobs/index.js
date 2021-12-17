import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Profile from '../Profile'
import JobListItem from '../JobListItem'
import SomethingWentWrong from '../SomethingWentWrong'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsListStatusOptions = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Jobs extends Component {
  state = {
    employmentTypes: [],
    salaryRange: 0,
    searchInput: '',
    jobsListStatus: jobsListStatusOptions.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {employmentTypes, salaryRange, searchInput} = this.state
    let employmentFilters
    if (employmentTypes === []) {
      employmentFilters = ''
    } else {
      employmentFilters = employmentTypes.join()
    }
    const getJobsAPIUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilters}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobDetailsListResponse = await fetch(getJobsAPIUrl, options)
    const parsedJobDetailsList = await jobDetailsListResponse.json()
    if (jobDetailsListResponse.ok) {
      this.success(parsedJobDetailsList.jobs)
    } else {
      this.failed()
    }
  }

  failed = () => {
    this.setState({jobsListStatus: jobsListStatusOptions.failed})
  }

  success = jobsList => {
    const formattedJobsList = jobsList.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    this.setState({
      jobsList: formattedJobsList,
      jobsListStatus: jobsListStatusOptions.success,
    })
  }

  onChangeEmploymentFilters = event => {
    const {employmentTypes} = this.state
    let newEmploymentTypes
    if (event.target.checked) {
      newEmploymentTypes = [...employmentTypes, event.target.value]
      this.setState(
        {
          employmentTypes: newEmploymentTypes,
          jobsListStatus: jobsListStatusOptions.initial,
        },
        this.getJobs,
      )
    } else {
      newEmploymentTypes = employmentTypes.filter(
        each => each !== event.target.value,
      )
      this.setState(
        {
          employmentTypes: newEmploymentTypes,
          jobsListStatus: jobsListStatusOptions.initial,
        },
        this.getJobs,
      )
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.setState({jobsListStatus: jobsListStatusOptions.initial}, this.getJobs)
  }

  changeSalaryRange = event => {
    this.setState(
      {
        salaryRange: event.target.value,
        jobsListStatus: jobsListStatusOptions.initial,
      },
      this.getJobs,
    )
  }

  renderEmploymentFilters = () => {
    const employmentFilters = employmentTypesList.map(each => (
      <li className="filter-item-employment" key={each.employmentTypeId}>
        <input
          type="checkbox"
          id={each.employmentTypeId}
          value={each.employmentTypeId}
          onChange={this.onChangeEmploymentFilters}
        />
        <label htmlFor={each.employmentTypeId} className="filter-label">
          {each.label}
        </label>
      </li>
    ))
    return employmentFilters
  }

  renderSearchBar = () => (
    <div className="search-bar-container">
      <input
        type="search"
        className="jobs-search-bar-input"
        placeholder="Search"
        onChange={this.onChangeSearchInput}
      />
      <button
        type="button"
        testid="searchButton"
        className="search-icon-container"
        onClick={this.onClickSearch}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  renderSalaryFilters = () =>
    salaryRangesList.map(each => (
      <li className="salary-range-item" key={each.salaryRangeId}>
        <input
          type="radio"
          id={each.salaryRangeId}
          name="salaryRange"
          value={each.salaryRangeId}
          onChange={this.changeSalaryRange}
        />
        <label htmlFor={each.salaryRangeId} className="filter-label">
          {each.label}
        </label>
      </li>
    ))

  renderLoadingScreen = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-items-found-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-items-found"
          />
          <h1 className="no-items-found-heading">No Jobs Found</h1>
          <p className="no-items-found-desc">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    return (
      <>
        {jobsList.map(each => (
          <JobListItem jobDetails={each} key={each.id} />
        ))}
      </>
    )
  }

  onClickRetry = () => {
    this.setState({jobsListStatus: jobsListStatusOptions.initial}, this.getJobs)
  }

  renderFailedJobsListView = () => (
    <SomethingWentWrong onRetry={this.onClickRetry} />
  )

  render() {
    const {jobsListStatus} = this.state
    let requiredUI
    switch (jobsListStatus) {
      case jobsListStatusOptions.initial:
        requiredUI = this.renderLoadingScreen()
        break
      case jobsListStatusOptions.success:
        requiredUI = this.renderJobsList()
        break
      case jobsListStatusOptions.failed:
        requiredUI = this.renderFailedJobsListView()
        break
      default:
        requiredUI = null
    }
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="left-md">
            <div className="profile-card">
              <Profile />
            </div>

            <h1 className="filters-heading">Type of Employment</h1>
            <ul className="employment-filters-container">
              {this.renderEmploymentFilters()}
            </ul>
            <h1 className="filters-heading">Salary Range</h1>
            <ul className="employment-filters-container">
              {this.renderSalaryFilters()}
            </ul>
          </div>
          <div className="search-and-jobslist">
            {this.renderSearchBar()}
            <ul className="jobs-list-container">{requiredUI}</ul>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
