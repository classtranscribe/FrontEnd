/**
 * Offering Editing Page
 * - used for creating a offering or editing the info of a offering
 */

import React from 'react'
// Layouts
import { GeneralModal } from '../../components'
import OfferingForm from './edit-form'
import { SaveButtons, EditButtons } from './buttons'
// Vars
import { api, handleData, util } from '../../util'
const initialOffering = api.initialData.initialOffering;

export default class OfferingSettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',

      departments: [],
      courses: [],
      terms: [],

      currUni: null,
      currDepart: null,
      offering: null,
      offeringInfo: handleData.copy(initialOffering),
      confirmed: false,
    }
    this.path = 'Offerings';
  }

  componentDidMount() {
    api.getAll(['Departments', 'Terms'], 
      (responce, name) => {
        // console.log(responce.data)
        // console.log(name)
        this.setState({[name]: responce.data})
      })
  }

  getCoursesByDepartId = id => {
    api.getCoursesByDepartId(id)
      .then(response => {
        this.setState({courses: response.data})
      })
  }

  onChange = (value, key) => {
    const newData = this.state.offeringInfo;
    if (key === 'currDepart') {
      api.getData('Departments', value)
        .then(response => {
          this.setState({
            currDepart: response.data, 
            offeringInfo: handleData.copy(initialOffering)
          });
        })
      this.getCoursesByDepartId(value);
    } else if (handleData.includes(['termId', 'accessType', 'sectionName'], key)) {
        newData.offering[key] = value;
    } else {
      newData[key] = value;
    }
    this.setState({offeringInfo: newData});
    // console.log(newData);
  }

  onCreate = () => {
    const { offeringInfo, isNew, id } = this.state;
    if (isNew) {
      offeringInfo.instructorId = id;
    }
    api.postData(this.path, offeringInfo, response => {
      console.log(response.data)
      this.onClose()
    })
    console.log(offeringInfo);
  }

  onUpdate = () => {
    const { offering, offeringInfo, id } = this.state;
    var data = handleData.updateJson(offeringInfo, offering)
    data.id = id;
    console.log(data);
    api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onDelete = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    if (this.state.isNew) util.toInstructorPage();
    else util.toOfferingPage(this.state.id)
  }

  onCancel = () => {
    this.props.history.goBack();
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'New Offering' : 'Edit Offering';
    const button = isNew ? <SaveButtons {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <OfferingForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

