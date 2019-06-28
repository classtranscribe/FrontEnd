import React from 'react'
import { SubmitButton, EditButtons, GeneralModal } from '../admin-components'
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react'

import { api, handleData } from '../../../util'
const initialUni = api.initialData.initialUni;

export default class EditUniPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.id.substring(0,3) === 'new',
      uni: null,
      uniInfo: handleData.copy(initialUni),
      confirmed: false,
    }
    this.path = 'Universities';
  }

  componentDidMount() {
    if (this.state.id !== 'new') {
      api.getData(this.path, this.state.id)
        .then( response => this.setState({uni: response.data}))
    }
  }

  onChange = (e, key) => {
    const newData = this.state.uniInfo;
    newData[key] = e.target.value;
    this.setState({uniInfo: newData});
  }

  onSubmit = () => {
    const data = this.state.uniInfo;
    api.postData(this.path, data, () => this.onClose())
  }

  onUpdate = () => {
    const { uni, uniInfo, id } = this.state;
    var data = handleData.updateJson(uniInfo, uni)
    data.id = id;
    api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onInactive = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    window.location='/admin'
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'Create New University' : 'Edit University';
    const button = isNew ? <SubmitButton {...this}/>
                          : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <UniForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

function UniForm(props) {
  const {onChange} = props;
  const university = props.isNew ? initialUni : props.state.uni;
  return (
    <Form className="ap-form">
      {university ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='uni-name-edit'
              control={Input}
              label='University Name'
              placeholder='E.g. University of Illinois at Urbana Champaign'
              defaultValue={university.name}
              onChange={event => onChange(event, 'name')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='uni-domain'
              control={Input}
              label='Domain'
              placeholder='E.g. ...'
              defaultValue={university.domain}
              onChange={event => onChange(event, 'domain')}
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