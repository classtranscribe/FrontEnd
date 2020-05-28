import React from 'react';
import PropTypes from 'prop-types';
import { Typography, MenuItem } from '@material-ui/core';
import { Image } from 'semantic-ui-react';
import { styles } from './styles';

function ProfileInfo(props) {
  let {
    uniName = '',
    picture,
    fullName = '',
    emailId = '',
    isLoginAsAccount = false,
    loginAsUserUni = '',
    loginAsEmailId = ''
  } = props;

  return (
    <MenuItem disabled id="profile">
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
              <span>{loginAsUserUni.name}</span>
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
  uniName: PropTypes.string,
  picture: PropTypes.string,
  fullName: PropTypes.string,
  emailId: PropTypes.string,
  isLoginAsAccount: PropTypes.bool,
  loginAsUserUni: PropTypes.string,
  loginAsEmailId: PropTypes.string,
};

export default ProfileInfo;
