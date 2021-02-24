/**
 * Editing Page for Departments
 */

import React from 'react';
import _ from 'lodash';
import { api, links } from 'utils';
import { Grid, Form, Input } from 'semantic-ui-react';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components';

const { initialDepart } = api.initialData;

export default class DepartmentEditing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      depart: _.clone(initialDepart),
      departInfo: _.clone(initialDepart),
      confirmed: false,
    };
    this.path = 'Departments';
  }

  componentDidMount() {
    const { id, isNew } = this.state;
    if (!isNew) {
      api.getDepartById(id).then(({ data }) => this.setState({ depart: data, loading: false }));
    }
  }

  onChange = (value, key) => {
    const { departInfo } = this.state;
    departInfo[key] = value;
    this.setState({ departInfo });
  };

  onSubmit = () => {
    const { id, departInfo } = this.state;
    departInfo.universityId = id;
    api.createDepartment(departInfo).then(() => this.onClose());
  };

  onUpdate = () => {
    const { depart, departInfo, id } = this.state;
    let data = updateJson(departInfo, depart);
    data.id = id;
    api.updateDepartment(data).then(() => this.onClose());
  };

  onConfirm = () => this.setState({ confirmed: true });

  onInactive = () => {
    api.deleteDepartment(this.state.id).then(() => this.onClose());
  };

  onClose = () => {
    window.location = links.admin('departments');
  };

  onCancel = () => {
    this.props.history.back();
  };

  render() {
    const { isNew } = this.state;
    const header = isNew ? 'Create New Department' : 'Edit the Department';
    const button = isNew ? <SubmitButton {...this} /> : <EditButtons {...this} />;
    return (
      <GeneralModal header={header} open onClose={this.onCancel} button={button}>
        <DepartForm {...this} />
      </GeneralModal>
    );
  }
}

function DepartForm({ state: { isNew, depart, loading }, onChange }) {
  if (isNew) depart = initialDepart;

  return (
    <Form className="ap-form">
      {!loading || isNew ? (
        <Grid columns="equal" verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                id="depart-name-edit"
                control={Input}
                label="Department Name"
                placeholder="E.g. Mathematics"
                defaultValue={depart.name}
                onChange={({ target: { value } }) => onChange(value, 'name')}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid
                id="depart-acronym"
                control={Input}
                label="Acronym"
                placeholder="E.g. MATH"
                defaultValue={depart.acronym}
                onChange={({ target: { value } }) => onChange(value, 'acronym')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <GeneralLoader inverted height="10rem" />
      )}
    </Form>
  );
}
