import { makeStyles } from '@material-ui/core/styles';

export const useButtonStyles = makeStyles({
  bold: {
    fontWeight: 'bold'
  },
  teal: {
    fontWeight: 'bold',
    marginLeft: 5,
    minWidth: 'max-content',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      },
      '&:disabled': {
        opacity: 0.8
      }
    }
  },
  tealLink: {
    color: 'var(--ct-text-primary) !important',
    fontWeight: 'bold',
    '&:hover': {
      color: 'teal !important'
    },
    '&.MuiButton-root.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.26) !important'
    }
  },
  danger: {
    color: 'red !important',
    fontWeight: 'bold',
  }
});