import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CTFragment from '../../CTFragment';

const useStyles = makeStyles({
  root: {
    '-webkit-flex-direction': 'row',
    flexDirection: 'row',
    '-webkit-flex-wrap': 'wrap',
    flexWrap: 'wrap',
    '-webkit-justify-content': 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: 'max-content'
  },
  item: {
    // minWidth: '300px',
    marginBottom: '20px'
  }
});

/**
 * The Row component used in `CTForm`
 */
function FormRow(props) {
  let {
    children,
    padding,
  } = props;

  const rowClasses = useStyles();

  const colElements = React.Children.toArray(children);
  const xs = Math.floor(12 / colElements.length);

  return (
    <CTFragment padding={padding}>
      <Grid className={rowClasses.root} container spacing={2}>
        {colElements.map(colElem => (
          <Grid key={colElem.key} item lg={xs} md={xs} sm={12} xs={12} className={rowClasses.item}>
            {colElem}
          </Grid>
        ))}
      </Grid>
    </CTFragment>
  )
}

FormRow.propTypes = {
  /** Primary Contents */
  children: PropTypes.node,

  /** The padding for `CTFragment` */
  padding: CTFragment.propTypes.padding,
};

export default FormRow;