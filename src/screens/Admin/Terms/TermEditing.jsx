/**
 * Editing Page for Terms
 */

import React from 'react'
// UI
import { SubmitButton, EditButtons, GeneralModal } from '../Components'
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// Vars
import moment from 'moment'
import { api, handleData, util } from 'utils'
const { initialTerm } = api.initialData


export default class TermEditing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      term: handleData.copy(initialTerm),
      termInfo: handleData.copy(initialTerm),
      confirmed: false,
      date: new Date(),
      focusedInput: null
    }
    this.path = 'Terms'
    this.uniId = this.state.isNew ? this.state.id.substring(4, this.state.id.length) : null
  }

  componentDidMount() {
    const { id, isNew } = this.state
    if (!isNew) {
      api.getData(this.path, id)
        .then( response => this.setState({
          term: response.data, 
          termInfo: {
            ...response.data, 
            startDate: moment(response.data.startDate),
            endDate: moment(response.data.endDate)
          },
          loading: false,
        }))
    }
  }

  setDate = (date) => {
    console.log(date)
    this.setState({ date: date})
  }

  onFocusChange = focusedInput => {
    this.setState({ focusedInput })
  }

  onChange = (value, key) => {
    // console.log(value)
    const { termInfo } = this.state
    termInfo[key] = value
    this.setState({ termInfo })
  }

  onSubmit = () => {
    const { termInfo, id } = this.state
    termInfo.universityId = id

    termInfo.startDate = handleData.momentToISOString(termInfo.startDate)
    termInfo.endDate = handleData.momentToISOString(termInfo.endDate)

    // console.log(termInfo)
    api.postData(this.path, termInfo, () => this.onClose())
  }

  onUpdate = () => {
    const { term, termInfo, id } = this.state
    var data = handleData.updateJson(termInfo, term)

    data.id = id
    data.startDate = handleData.momentToISOString(termInfo.startDate)
    data.endDate = handleData.momentToISOString(termInfo.endDate)

    api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onInactive = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    util.toAdminPage()
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  render() {
    const { isNew } = this.state
    const header = isNew ? 'Create New Term' : 'Edit the Term'
    const button = isNew ? <SubmitButton {...this}/>
                         : <EditButtons {...this} />
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <TermForm {...this}/>
      </GeneralModal>
    )
  }
}

function TermForm({ state:{isNew, termInfo, focusedInput, loading}, onChange, onFocusChange}) {
  return (
    <Form className="ap-form">
      {!loading || isNew ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='term-name-edit'
              control={Input}
              label='Term Name'
              placeholder='E.g. Spring 2019'
              defaultValue={termInfo.name}
              onChange={({target: {value}}) => onChange(value, 'name')}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <label><p><strong>Term Range</strong></p></label><br/>
            <DateRangePicker
              noBorder
              openDirection='up'
              isOutsideRange={()=>false}
              startDate={termInfo.startDate || new moment()} // momentPropTypes.momentObj or null,
              startDateId={'startDate'} // PropTypes.string.isRequired,
              endDate={termInfo.endDate || new moment()} // momentPropTypes.momentObj or null,
              endDateId={'endDate'} // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                onChange(startDate, 'startDate')
                onChange(endDate, 'endDate')
              }} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={onFocusChange} // PropTypes.func.isRequired,
            />
          </Grid.Column>
        </Grid.Row>
      </Grid> : 
      (<Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>) }
    </Form>
  )
}