/**
 * Editing Page for Terms
 */

import React from 'react'
// UI
import { SubmitButton, EditButtons, GeneralModal } from '../Components'
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react'
// Vars
import { api, handleData, util } from '../../../util'
const { initialTerm } = api.initialData

export default class TermEditing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      term: null,
      termInfo: handleData.copy(initialTerm),
      confirmed: false,
    }
    this.path = 'Terms'
    this.uniId = this.state.isNew ? this.state.id.substring(4, this.state.id.length) : null
  }

  componentDidMount() {
    const { id, isNew } = this.state
    if (!isNew) {
      api.getData(this.path, id)
        .then( response => this.setState({term: response.data}))
    }
  }

  onChange = (value, key) => {
    const { termInfo } = this.state
    termInfo[key] = value
    this.setState({ termInfo })
  }

  onSubmit = () => {
    const { termInfo, id } = this.state
    termInfo.universityId = id
    api.postData(this.path, termInfo, () => this.onClose())
  }

  onUpdate = () => {
    const { term, termInfo, id } = this.state
    var data = handleData.updateJson(termInfo, term)
    data.id = id
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

function TermForm({ state:{isNew, term}, onChange}) {
  if (isNew) term = initialTerm
  return (
    <Form className="ap-form">
      {term ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='term-name-edit'
              control={Input}
              label='Term Name'
              placeholder='E.g. Spring 2019'
              defaultValue={term.name}
              onChange={({target: {value}}) => onChange(value, 'name')}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Field
              fluid
              id='start-date-edit'
              control={Input}
              label='Start Date'
              placeholder='E.g. 2199-08-26T18:38:05.281Z'
              defaultValue={term.startDate}
              onChange={({target: {value}}) => onChange(value, 'startDate')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='start-date-edit'
              control={Input}
              label='End Date'
              placeholder='E.g. 2199-12-23T18:38:05.281Z'
              defaultValue={term.endDate}
              onChange={({target: {value}}) => onChange(value, 'endDate')}
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