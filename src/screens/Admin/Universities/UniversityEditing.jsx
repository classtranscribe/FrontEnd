/**
 * Editing Page for Universities (Functional Version)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Form, Input, Dimmer, Loader } from 'semantic-ui-react';
import { api, links } from 'utils';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal } from '../Components';

const { initialUni } = api.initialData;

export default function UniversityEditing() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const isNew = type === 'new';

  const [loading, setLoading] = useState(true);
  const [uni, setUni] = useState({ ...initialUni });
  const [uniInfo, setUniInfo] = useState({ ...initialUni });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      api.getUniversityById(id).then((response) => {
        setUni(response.data);
        setUniInfo({ ...response.data });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const onChange = (value, key) => {
    setUniInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClose = () => {
    window.location = links.admin('universities'); // or navigate('/admin/universities')
  };

  const onSubmit = () => {
    api.createUniversity(uniInfo).then(onClose);
  };

  const onUpdate = () => {
    const data = updateJson(uniInfo, uni);
    data.id = id;
    api.updateUniversity(data).then(onClose);
  };

  const onConfirm = () => setConfirmed(true);

  const onInactive = () => {
    api.deleteUniversity(id).then(onClose);
  };

  const onCancel = () => {
    navigate(-1); // replaces this.props.history.back()
  };

  const header = isNew ? 'Create New University' : 'Edit University';
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
      <UniForm isNew={isNew} uni={uni} loading={loading} onChange={onChange} />
    </GeneralModal>
  );
}

function UniForm({ isNew, uni, loading, onChange }) {
  const effectiveUni = isNew ? { ...initialUni } : uni;

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
                placeholder="E.g. University of Illinois at Urbana-Champaign"
                defaultValue={effectiveUni.name}
                onChange={({ target: { value } }) => onChange(value, 'name')}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid
                id="uni-domain"
                control={Input}
                label="Domain"
                placeholder="E.g. illinois.edu"
                defaultValue={effectiveUni.domain}
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
