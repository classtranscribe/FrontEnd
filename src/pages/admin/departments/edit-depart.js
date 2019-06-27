import React from 'react'
import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../admin-components'
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react'

import { api, handleData } from '../../../util'
const initialDepart = api.initialData.initialDepart;

export default class EditDepartPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.id.substring(0,3) === 'new',
      depart: null,
      departInfo: handleData.copy(initialDepart),
      confirmed: false,
    }
    this.path = 'Departments';
    this.uniId = this.state.isNew ? this.state.id.substring(4, this.state.id.length) : null;
  }

  componentDidMount() {
    console.log(this.uniId)
    if (this.state.id !== 'new') {
      api.getData(this.path, this.state.id)
        .then( response => this.setState({depart: response.data}))
    }
  }

  onChange = (e, key) => {
    const newData = this.state.departInfo;
    newData[key] = e.target.value;
    this.setState({departInfo: newData});
  }

  onSubmit = () => {
    const data = this.state.departInfo;
    data.universityId = this.uniId;
    api.postData(this.path, data, () => this.onClose())
  }

  onUpdate = () => {
    const { depart, departInfo, id } = this.state;
    var data = handleData.updateJson(departInfo, depart)
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
    const header = isNew ? 'Create New Department' : 'Edit the Department';
    const button = isNew ? <SubmitButton {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onClose}
        button={button}
      >
        <DepartForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

function DepartForm(props) {
  const { onChange } = props;
  const depart = props.isNew ? initialDepart : props.state.depart;
  return (
    <Form className="ap-form">
      {depart ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='depart-name-edit'
              control={Input}
              label='Department Name'
              placeholder='E.g. Mathematics'
              defaultValue={depart.name}
              onChange={event => onChange(event, 'name')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='depart-acronym'
              control={Input}
              label='Acronym'
              placeholder='E.g. MATH'
              defaultValue={depart.acronym}
              onChange={event => onChange(event, 'acronym')}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid> : <GeneralLoader inverted height='10rem'/>  
      }
    </Form>
  )
}