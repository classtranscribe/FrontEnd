import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { useButtonStyles } from '../../CTButtons';
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
    className,
    collapsible = false,
    expanded = false,
    danger,
    warning,
    onSave,
    onCancel,
    onDelete,
    onSaveButtonText = 'save',
    onCancelButtonText = 'cancel',
    onDeleteButtonText = 'delete',
    heading,
    details,
    children,
  } = props;

  const btn = useButtonStyles();

  const expandIcon = collapsible ? <ExpandMoreIcon /> : null;

  const AccordionProps = {
    className: cx('ct-form', className, { danger, warning }),
    defaultExpanded: expanded,
  };

  if (!collapsible) {
    AccordionProps.expanded = true;
  }

  return (
    <Accordion square {...AccordionProps}>
      <AccordionSummary
        expandIcon={expandIcon}
        aria-controls={`ct-form-content-${id}`}
        id={`ct-form-heading-${id}`}
        tabIndex={collapsible ? 0 : -1}
        className={collapsible ? 'collapsible' : null}
      >
        <CTFragment dFlexCol>
          <CTHeading as="h3">
            {heading}
          </CTHeading>
          {Boolean(details) && <div className="text-muted">{details}</div>}
        </CTFragment>
      </AccordionSummary>

      <Divider />

      <form id={id} autoComplete="off" autoSave="off">
        <AccordionDetails id={`ct-form-content-${id}`}>
          <CTFragment dFlexCol>
            {children}
          </CTFragment>
        </AccordionDetails>
          
        <AccordionActions>
          {
            Boolean(onCancel)
            &&
            <Button onClick={onCancel}>
              {onCancelButtonText}
            </Button>
          }
          {
            Boolean(onSave)
            &&
            <Button type="button" className={btn.teal} variant="contained" onClick={onSave}>
              {onSaveButtonText}
            </Button>
          }
          {
            Boolean(onDelete)
            &&
            <Button type="button" color="secondary" className={btn.bold} onClick={onDelete}>
              {onDeleteButtonText}
            </Button>
          }
        </AccordionActions>
      </form>
    </Accordion>
  );
}

Form.propTypes = {
  /** An unique id to the form */
  id: PropTypes.string,

  /** CTFragment's padding prop */
  padding: CTFragment.propTypes.padding,

  /** Additional classes */
  className: PropTypes.string,

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