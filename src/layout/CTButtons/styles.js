import { makeStyles } from '@material-ui/core/styles';

export const useButtonStyles = makeStyles({
  teal: {
    fontWeight: 'bold',
    marginLeft: 5,
    minWidth: 'max-content',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  },
  tealLink: {
    fontWeight: 'bold',
    '&:hover': {
      color: 'teal'
    }
  }
});