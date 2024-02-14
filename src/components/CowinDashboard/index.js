import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {vaccinationData: {}, status: apiStatus.initial}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationAge: data.vaccination_by_age.map(each => ({
          age: each.age,
          count: each.count,
        })),
        vaccinationGender: data.vaccination_by_gender.map(each => ({
          count: each.count,
          age: each.age,
        })),
      }
      console.log(updatedData)
      this.setState({status: apiStatus.success, vaccinationData: updatedData})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderSuccess = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage abc={vaccinationData.last7DaysVaccination} />
      </>
    )
  }

  renderFailure = () => (
    <div>
      <h1>Something went wrong</h1>
    </div>
  )

  renderInprogress = () => (
    <div>
      <Loader type="ThreeDots" />
    </div>
  )

  renderViewBasedOnApiStatus = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      case apiStatus.inProgress:
        return this.renderInprogress()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <h1>Cowin vaccination in India</h1>
        {this.renderViewBasedOnApiStatus}
      </div>
    )
  }
}
export default CowinDashboard
