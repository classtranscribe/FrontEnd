import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    ExpansionSummay: {
        background: '#4c4c4c',
        color: 'white',
        position: 'sticky',
        top: '0px',
        '&:hover': {
            background: '#717171',
        }
    },
    ExpandMoreIcon: {
        color: 'white'
    },
    Typography: {
        fontSize: '140%',
    }

});


const ExpansionPanel = withStyles({
    root: {
        // border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        // backgroundColor: 'rgba(0, 0, 0, .03)',
        border: '1px solid rgba(49, 49, 49, 0.60)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},

})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        background: '#2a2a2a',
        // padding: theme.spacing(1),
    },
}))(MuiExpansionPanelDetails);

export default function Accordion({ resultsEachItems, title }) {
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon classes={{ root: classes.ExpandMoreIcon }}/>}
                aria-controls="panel1d-content"
                id="panel1d-header"
                classes={{ root: classes.ExpansionSummay }}
            >
            <Typography 
                classes={{ root: classes.Typography }}
            >
                {title}
            </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <Typography>{resultsEachItems}</Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )

}




