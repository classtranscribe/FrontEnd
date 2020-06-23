import React, { useState } from 'react';
import { CTForm, CTInput, CTFormRow } from 'layout/CTForm';

export const ExampleForm = () => (
  <CTForm
    collapsible
    padding={[10, 35]} 
    id="ctform-basics" 
    heading="Example Form" 
    details="This is a description for the Example Form"
    onSave={() => alert('save')}
    onCancel={() => alert('cancel')}
  >
    <CTFormRow>
      <CTInput
        required
        id="input-name"
        label="Name"
        placeholder="Course Number"
        defaultValue="Shawn"
      />

      <CTInput
        id="input-gender"
        label="Gender"
        defaultValue="Male"
      />
    </CTFormRow>
  </CTForm>
);