/**
 * Editing Page for Departments (functional version)
 */

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { api, links } from 'utils';
import { Grid, Form, Input } from 'semantic-ui-react';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components';

const { initialDepart } = api.initialData;

export default function DepartmentEditing() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isNew = type === 'new';

  const [loading, setLoading] = useState(true);
  const [depart, setDepart] = useState(_.clone(initialDepart));
  const [departInfo, setDepartInfo] = useState(_.clone(initialDepart));
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      api.getDepartById(id).then(({ data }) => {
        setDepart(data);
        setDepartInfo(_.clone(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const onChange = (value, key) => {
    setDepartInfo((prev) => ({ ...prev, [key]: value }));
  };

  const onClose = () => {
    window.location = links.admin('departments'); // or navigate('/admin/departments')
  };

  const onSubmit = () => {
    const data = { ...departInfo, universityId: id };
    api.createDepartment(data).then(() => onClose());
  };

  const onUpdate = () => {
    const data = updateJson(departInfo, depart);
    data.id = id;
    api.updateDepartment(data).then(() => onClose());
  };

  const onConfirm = () => setConfirmed(true);

  const onInactive = () => {
    api.deleteDepartment(id).then(() => onClose());
  };

  const onCancel = () => {
    navigate(-1); // replaces this.props.history.back()
  };

  const header = isNew ? 'Create New Department' : 'Edit the Department';
  const button = isNew
    ? <SubmitButton {...{ onSubmit, onCancel }} />
    : <EditButtons {...{ onUpdate, onCancel, onInactive, onConfirm, confirmed }} />;

  return (
    <GeneralModal header={header} open onClose={onCancel} button={button}>
      <DepartForm
        isNew={isNew}
        depart={depart}
        loading={loading}
        onChange={onChange}
      />
    </GeneralModal>
  );
}

function DepartForm({ isNew, depart, loading, onChange }) {
  const effectiveDepart = isNew ? initialDepart : depart;

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
                defaultValue={effectiveDepart.name}
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
                defaultValue={effectiveDepart.acronym}
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
