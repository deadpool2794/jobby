const SomethingWentWrong = props => {
  const {onRetry} = props

  const onClickRetry = () => {
    onRetry()
  }

  return (
    <div className="no-items-found-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="no-items-found"
      />
      <h1 className="no-items-found-heading">Oops! Something Went Wrong</h1>
      <p className="no-items-found-desc">
        We cannot seem to find the page you are looking for
      </p>
      <div className="retry-jobs-button">
        <button type="button" className="retry-button " onClick={onClickRetry}>
          Retry
        </button>
      </div>
    </div>
  )
}

export default SomethingWentWrong
