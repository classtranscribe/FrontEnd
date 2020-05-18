import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';

import './index.scss';

import {
  useStyles,
  getSteps,
  getStepIndexMap,
  isStepComplete
} from './stepper.util';

function EpubStepper({
  step,
  vertical=false,
}) {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <div className="w-100">
      <Stepper 
        nonLinear
        activeStep={getStepIndexMap()[step]}
        orientation={vertical ? "vertical" : "horizontal"}
      >
        {steps.map((stepItem, index) => (
          <Step
            key={stepItem.value}
            completed={isStepComplete(stepItem.value, step)}
          >
            <StepButton 
              className="ee-step-btn"
              onClick={() => epub.state.setStep(stepItem.value)}
            >
              {stepItem.name}
            </StepButton>
            {
              vertical
              &&
              <StepContent>
                <Typography>{stepItem.description}</Typography>
              </StepContent>
            }
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

export default connectWithRedux(
  EpubStepper,
  ['step']
);