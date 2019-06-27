import React from 'react'
import { SubmitButton, EditButtons, GeneralModal } from '../admin-components'
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react'

import { api, handleData } from '../../../util'
const initialTerm = api.initialData.initialTerm;

export default class EditTermPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.id.substring(0,3) === 'new',
      term: null,
      termInfo: handleData.copy(initialTerm),
      confirmed: false,
    }
    this.path = 'Terms';
    this.uniId = this.state.isNew ? this.state.id.substring(4, this.state.id.length) : null;
  }

  componentDidMount() {
    console.log(this.uniId)
    if (this.state.id !== 'new') {
      api.getData(this.path, this.state.id)
        .then( response => this.setState({term: response.data}))
    }
  }

  onChange = (e, key) => {
    const newData = this.state.termInfo;
    newData[key] = e.target.value;
    this.setState({termInfo: newData});
  }

  onSubmit = () => {
    const data = this.state.termInfo;
    data.universityId = this.uniId;
    api.postData(this.path, data, () => this.onClose())
  }

  onUpdate = () => {
    const { term, termInfo, id } = this.state;
    var data = handleData.updateJson(termInfo, term)
    data.id = id;
    api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onInactive = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    this.props.history.goBack()
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'Create New Term' : 'Edit the Term';
    const button = isNew ? <SubmitButton {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onClose}
        button={button}
      >
        <TermForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

function TermForm(props) {
  const { onChange } = props;
  const term = props.isNew ? initialTerm : props.state.term;
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
              onChange={event => onChange(event, 'name')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='start-date-edit'
              control={Input}
              label='Start Date'
              placeholder='E.g. 2199-06-23T18:38:05.281Z'
              defaultValue={term.startDate}
              onChange={event => onChange(event, 'startDate')}
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