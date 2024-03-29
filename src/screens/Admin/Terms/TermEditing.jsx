/**
 * Editing Page for Terms
 */

import React from 'react';
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// Vars
import Moment from 'moment';
import { api, links } from 'utils';
import { momentToISOString, updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal } from '../Components';

const { initialTerm } = api.initialData;

export default class TermEditing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      term: { ...initialTerm },
      termInfo: { ...initialTerm },
      confirmed: false,
      date: new Date(),
      focusedInput: null,
    };
  }

  componentDidMount() {
    const { id, isNew } = this.state;
    if (!isNew) {
      api.getTermById(id).then((response) =>
        this.setState({
          term: response.data,
          termInfo: {
            ...response.data,
            startDate: Moment(response.data.startDate),
            endDate: Moment(response.data.endDate),
          },
          loading: false,
        }),
      );
    }
  }

  setDate = (date) => {
    this.setState({ date });
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

  onChange = (value, key) => {
    // console.log(value)
    const { termInfo } = this.state;
    termInfo[key] = value;
    this.setState({ termInfo });
  };

  onSubmit = () => {
    const { termInfo, id } = this.state;
    termInfo.universityId = id;

    termInfo.startDate = momentToISOString(termInfo.startDate);
    termInfo.endDate = momentToISOString(termInfo.endDate);

    // console.log(termInfo)
    api.createTerm(termInfo).then(() => this.onClose());
  };

  onUpdate = () => {
    const { term, termInfo, id } = this.state;
    let data = updateJson(termInfo, term);

    data.id = id;
    data.startDate = momentToISOString(termInfo.startDate);
    data.endDate = momentToISOString(termInfo.endDate);

    api.updateTerm(data).then(() => this.onClose());
  };

  onConfirm = () => this.setState({ confirmed: true });

  onInactive = () => {
    api.deleteTerm(this.state.id).then(() => this.onClose());
  };

  onClose = () => {
    window.location = links.admin('terms');
  };

  onCancel = () => {
    this.props.history.back();
  };

  render() {
    const { isNew } = this.state;
    const header = isNew ? 'Create New Term' : 'Edit the Term';
    const button = isNew ? <SubmitButton {...this} /> : <EditButtons {...this} />;
    return (
      <GeneralModal header={header} open onClose={this.onCancel} button={button}>
        <TermForm {...this} />
      </GeneralModal>
    );
  }
}

function TermForm({ state: { isNew, termInfo, focusedInput, loading }, onChange, onFocusChange }) {
  return (
    <Form className="ap-form">
      {!loading || isNew ? (
        <Grid columns="equal" verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                id="term-name-edit"
                control={Input}
                label="Term Name"
                placeholder="E.g. Spring 2019"
                defaultValue={termInfo.name}
                onChange={({ target: { value } }) => onChange(value, 'name')}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <p className="font-weight-bold mb-1">
                Term Range
              </p>
              <DateRangePicker
                noBorder
                openDirection="up"
                isOutsideRange={() => false}
                startDate={termInfo.startDate || new Moment()} // momentPropTypes.momentObj or null,
                startDateId="startDate" // PropTypes.string.isRequired,
                endDate={termInfo.endDate || new Moment()} // momentPropTypes.momentObj or null,
                endDateId="endDate" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => {
                  onChange(startDate, 'startDate');
                  onChange(endDate, 'endDate');
                }} // PropTypes.func.isRequired,
                focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={onFocusChange} // PropTypes.func.isRequired,
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
