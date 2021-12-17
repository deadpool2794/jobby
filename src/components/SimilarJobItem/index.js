import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-item-container">
      <Link className="similar-job-link" to={`/jobs/${id}`}>
        <div className="company-logo-name">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
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
        <h1 className="similar-job-description-heading">Description</h1>
        <p className="similar-job-description-desc">{jobDescription}</p>

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
      </Link>
    </li>
  )
}

export default SimilarJobItem
