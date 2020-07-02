import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { Button } from 'pico-ui';

import CTFragment from '../../CTFragment';
import CTHeading from '../../CTHeading';
import './index.scss';

/**
 * A general collapsible form component
 */
function Form(props) {
  let {
    id,
    padding,
    collapsible = false,
    expanded = false,
    danger,
    warning,
    onSave,
    onCancel,
    onSaveButtonText = 'save',
    onCancelButtonText = 'cancel',
    heading,
    details,
    children,
  } = props;

  const expandIcon = collapsible ? <ExpandMoreIcon /> : null;

  const ExpansionPanelProps = {
    className: cx('ct-form', { danger, warning }),
    defaultExpanded: expanded,
  };

  if (!collapsible) {
    ExpansionPanelProps.expanded = true;
  }

  return (
    <CTFragment padding={padding}>
      <ExpansionPanel square {...ExpansionPanelProps}>
        <ExpansionPanelSummary
          expandIcon={expandIcon}
          aria-controls={`ct-form-content-${id}`}
          id={`ct-form-heading-${id}`}
          tabIndex={collapsible ? 0 : -1}
          className={collapsible ? 'collapsible' : null}
        >
          <CTFragment list>
            <CTHeading as="h3">
              {heading}
            </CTHeading>
            {Boolean(details) && <div className="text-muted">{details}</div>}
          </CTFragment>
        </ExpansionPanelSummary>

        <Divider />

        <form id={id} onSubmit={onSave} autoComplete="off">
          <ExpansionPanelDetails id={`ct-form-content-${id}`}>
            <CTFragment list>
              {children}
            </CTFragment>
          </ExpansionPanelDetails>
            
          <ExpansionPanelActions>
            {
              Boolean(onCancel)
              &&
              <Button uppercase color="transparent" onClick={onCancel}>
                {onCancelButtonText}
              </Button>
            }
            {
              Boolean(onSave)
              &&
              <Button uppercase color="teal" onClick={onSave}>
                {onSaveButtonText}
              </Button>
            }
          </ExpansionPanelActions>
        </form>
      </ExpansionPanel>
    </CTFragment>
  );
}

Form.propTypes = {
  /** An unique id to the form */
  id: PropTypes.string,

  /** CTFragment's padding prop */
  padding: CTFragment.propTypes.padding,

  /** The form can be collapsible */
  collapsible: PropTypes.bool,

  /** Default expanded the form, if collapsible */
  expanded: PropTypes.bool,

  /** This form can be a danger zone */
  danger: PropTypes.bool,

  /** This form can be a warning zone */
  warning: PropTypes.bool,

  /** Function called on submitting the form */
  onSave: PropTypes.func,

  /** Function called on canceling form submission */
  onCancel: PropTypes.func,

  /** Default as 'SAVE' */
  onSaveButtonText: PropTypes.string,

  /** Default as 'CANCEL' */
  onCancelButtonText: PropTypes.string,

  /** Heading of the form */
  heading: PropTypes.node,

  /** Details about the form */
  details: PropTypes.node,

  /** Form contents */
  children: PropTypes.node,
};

export default Form;