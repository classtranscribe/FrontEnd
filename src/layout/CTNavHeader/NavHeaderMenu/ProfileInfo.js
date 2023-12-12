import React from 'react';
import PropTypes from 'prop-types';
import { Typography, MenuItem } from '@material-ui/core';
import { Image } from 'semantic-ui-react';
import { styles } from './styles';

/* Warning,
"Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

Check the render method of `ForwardRef(Menu)`.
    in ProfileInfo (at NavHeaderMenu/index.js:70)
    in ul (created by ForwardRef(List))
    in ForwardRef(List) (created by WithStyles(ForwardRef(List)))
    in WithStyles(ForwardRef(List)) (created by ForwardRef(MenuList))
    in ForwardRef(MenuList) (created by ForwardRef(Menu))
    in div (created by ForwardRef(Paper))..."
    */

function ProfileInfo(props) {
  let {
    uniName = '',
    picture,
    fullName = '',
    emailId = '',
    isLoginAsAccount = false,
    loginAsUserUni = '',
    loginAsEmailId = '',
    ...otherProps
  } = props;

  return (
    <MenuItem disabled id="profile" {...otherProps}>
      <div className="profile">
        {
          picture 
          ? 
            <Image
              circular
              src={picture}  
              alt="Profile picture"
            />
          :
            <div 
              role="img"
              aria-label="Profile picture"
              className="profile-img-alt menu"
            >
              <div>{fullName.slice(0,1).toUpperCase()}</div>
            </div>
        }
        <Typography style={styles.font}>
          <strong>{fullName}</strong><br />
          <span>{emailId}</span><br />
          <span>{uniName}</span>
          {
            isLoginAsAccount
            &&
            <>
              <br />
              <br />
              <span>You are accessing content of <strong>{loginAsEmailId}</strong></span><br />
              <span>{loginAsUserUni}</span>
              <br />
              <br />
            </>
          }
        </Typography>
      </div>
    </MenuItem>
  );
}

ProfileInfo.propTypes = {
  /** University name of the user */
  uniName: PropTypes.string,

  /** Profile image of the user */
  picture: PropTypes.string,

  /** Full name of the user */
  fullName: PropTypes.string,

  /** Email of the user */
  emailId: PropTypes.string,

  /** True if is in the login-as-mode */
  isLoginAsAccount: PropTypes.bool,

  /** The login-as user's univeristy */
  loginAsUserUni: PropTypes.string,

  /** The login-as user's email  */
  loginAsEmailId: PropTypes.string,
};

export default ProfileInfo;
