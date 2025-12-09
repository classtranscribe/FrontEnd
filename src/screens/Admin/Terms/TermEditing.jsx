import React, { useState, useEffect } from 'react';
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { api, links } from 'utils';
import { momentToISOString, updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal } from '../Components';

const { initialTerm } = api.initialData;

export default function TermEditing() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const isNew = type === 'new';

  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState({ ...initialTerm });
  const [termInfo, setTermInfo] = useState({ ...initialTerm });
  const [confirmed, setConfirmed] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (!isNew && id) {
      api.getTermById(id).then((response) => {
        const data = response.data;
        setTerm(data);
        setTermInfo({
          ...data,
          startDate: Moment(data.startDate),
          endDate: Moment(data.endDate),
        });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const onChange = (value, key) => {
    setTermInfo((prev) => ({ ...prev, [key]: value }));
  };

  const onFocusChange = (fi) => {
    setFocusedInput(fi);
  };

  const onClose = () => {
    window.location = links.admin('terms');
  };

  const onSubmit = () => {
    const payload = {
      ...termInfo,
      universityId: id,
      startDate: momentToISOString(termInfo.startDate),
      endDate: momentToISOString(termInfo.endDate),
    };
    api.createTerm(payload).then(onClose);
  };

  const onUpdate = () => {
    const data = updateJson(termInfo, term);
    data.id = id;
    data.startDate = momentToISOString(termInfo.startDate);
    data.endDate = momentToISOString(termInfo.endDate);
    api.updateTerm(data).then(onClose);
  };

  const onConfirm = () => setConfirmed(true);

  const onInactive = () => {
    api.deleteTerm(id).then(onClose);
  };

  const onCancel = () => {
    navigate(-1);
  };

  const header = isNew ? 'Create New Term' : 'Edit the Term';
  const button = isNew
    ? <SubmitButton onSubmit={onSubmit} onCancel={onCancel} />
    : <EditButtons
        onUpdate={onUpdate}
        onCancel={onCancel}
        onInactive={onInactive}
        onConfirm={onConfirm}
        confirmed={confirmed}
    />;

  return (
    <GeneralModal header={header} open onClose={onCancel} button={button}>
      <TermForm
        isNew={isNew}
        termInfo={termInfo}
        focusedInput={focusedInput}
        loading={loading}
        onChange={onChange}
        onFocusChange={onFocusChange}
      />
    </GeneralModal>
  );
}

function TermForm({ isNew, termInfo, focusedInput, loading, onChange, onFocusChange }) {
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
              <p className="font-weight-bold mb-1">Term Range</p>
              <DateRangePicker
                noBorder
                openDirection="up"
                isOutsideRange={() => false}
                startDate={termInfo.startDate || Moment()} // moment object or null
                startDateId="startDate"
                endDate={termInfo.endDate || Moment()} // moment object or null
                endDateId="endDate"
                onDatesChange={({ startDate, endDate }) => {
                  onChange(startDate, 'startDate');
                  onChange(endDate, 'endDate');
                }}
                focusedInput={focusedInput}
                onFocusChange={onFocusChange}
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
