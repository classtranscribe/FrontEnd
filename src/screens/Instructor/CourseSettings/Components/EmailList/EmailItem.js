import React from 'react'
import PropTypes from 'prop-types'

function EmailItem(props) {
  const { email } = props;

  // Add scss styles to this component
  // And add delete button to it
  return (
    <div>
      {email}
    </div>
  );
}

EmailItem.propTypes = {
  email: PropTypes.string
};

export default EmailItem;

