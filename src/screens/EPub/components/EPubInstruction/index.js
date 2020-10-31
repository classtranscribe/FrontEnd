import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CTHeading } from 'layout';
import './index.scss'

function EPubInstruction({ expanded, title, children, onToggle }) {
  return (
    <Accordion
      expanded={expanded} 
      defaultExpanded 
      className="ct-epb instruction" 
      onChange={onToggle}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="ct-epb-inst-content"
        id="ct-epb-inst-header"
      >
        <CTHeading as="h4" compact icon="help_outline">{title}</CTHeading>
      </AccordionSummary>
      <AccordionDetails id="ct-epb-inst-content">
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export default EPubInstruction;
