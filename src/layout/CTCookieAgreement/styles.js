import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  cookieAgreementButton: {
    background: '#328383',
    marginLeft : '5px',
    marginRight : '5px',
    border: 0,
    fontSize: '15px',
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 10px',
    '&:hover' : {
        background : '#4d9191'
    }
  },
});
