/**
 * Editing Page for Universities
 */

import React from 'react';
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react';
import { api, links } from 'utils';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal } from '../Components';

const { initialUni } = api.initialData;

export default class UniversityEditing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      uni: { ...initialUni },
      uniInfo: { ...initialUni },
      confirmed: false,
    };
  }

  componentDidMount() {
    const { id, isNew } = this.state;
    if (!isNew) {
      api.getUniversityById(id).then((response) => {
        this.setState({ uni: response.data, loading: false });
      });
    }
  }

  onChange = (value, key) => {
    this.setState((preState) => {
      const newData = preState.uniInfo;
      newData[key] = value;
      return { uniInfo: { ...newData } };
    });
  };

  onSubmit = () => {
    const data = this.state.uniInfo;
    api.createUniversity(data).then(() => this.onClose());
  };

  onUpdate = () => {
    const { uni, uniInfo, id } = this.state;
    let data = updateJson(uniInfo, uni);
    data.id = id;
    api.updateUniversity(data).then(() => this.onClose());
  };

  onConfirm = () => this.setState({ confirmed: true });

  onInactive = () => {
    api.deleteUniversity(this.state.id).then(() => this.onClose());
  };

  onClose = () => {
    window.location = links.admin('universities');
  };

  onCancel = () => {
    this.props.history.back();
  };

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'Create New University' : 'Edit University';
    const button = isNew ? <SubmitButton {...this} /> : <EditButtons {...this} />;

    return (
      <GeneralModal header={header} open onClose={this.onCancel} button={button}>
        <UniForm {...this} />
      </GeneralModal>
    );
  }
}

function UniForm({ state: { uni, isNew, loading }, onChange }) {
  if (isNew) uni = initialUni;
  return (
    <Form className="ap-form">
      {!loading || isNew ? (
        <Grid columns="equal" verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                id="uni-name-edit"
                control={Input}
                label="University Name"
                placeholder="E.g. University of Illinois at Urbana Champaign"
                defaultValue={uni.name}
                onChange={({ target: { value } }) => onChange(value, 'name')}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid
                id="uni-domain"
                control={Input}
                label="Domain"
                placeholder="E.g. ..."
                defaultValue={uni.domain}
                onChange={({ target: { value } }) => onChange(value, 'domain')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )}
    </Form>
  );
}
