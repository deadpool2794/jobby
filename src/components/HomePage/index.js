import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const HomePage = () => (
  <>
    <Header />
    <div className="home-page-container">
      <h1 className="home-page-heading">Find The Job That Fits Your Life</h1>
      <p className="home-page-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="home-page-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default HomePage
