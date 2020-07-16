import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import { epub } from '../../controllers';
import { connectWithRedux } from '../../redux';
import './index.scss';

import {
  getSteps,
  getStepIndexMap,
  isStepComplete
} from './stepper.util';

function EPubStepper({
  step,
  vertical=false,
}) {
  const steps = getSteps();

  return (
    <div aria-hidden="true" className="w-100">
      <Stepper 
        nonLinear
        activeStep={getStepIndexMap()[step]}
        orientation={vertical ? "vertical" : "horizontal"}
      >
        {steps.map((stepItem) => (
          <Step
            key={stepItem.value}
            completed={isStepComplete(stepItem.value, step)}
          >
            <StepButton 
              className="ct-epb step-btn"
              onClick={() => epub.ctrl.toStep(stepItem.value)}
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
  EPubStepper,
  ['step']
);