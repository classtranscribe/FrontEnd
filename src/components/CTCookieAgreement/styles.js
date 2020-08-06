import {makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  loginButton: {
    background: '#328383',
    marginLeft : '10px',
    marginRight : '10px',
    marginTop: '2px',
    marginBottom: '1px', 
    border : 0,
    borderRadius: '3px',
    color: 'white',
    height: '60px',
    padding: '10px 30px',
    cursor: 'pointer',
    display : 'flex',
    flexDirection : 'column',
    alignItems: 'start',
    [theme.breakpoints.down('xs')] : {
      height: '50px',
      padding: '10px 20px',
    },
    },
  policyButton : {
    color: '#328383',
    marginLeft: '4px',
    marginRight: '4px',
    paddingBottom: '2px'
  },
}));
