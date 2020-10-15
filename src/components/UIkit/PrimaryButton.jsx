import React from 'react'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
    "button": {
        backgroundColor: "var(--twitter-color)",
        color: "white",
        fontSize: 16,
        height: 48,
        marginButtom : 16,
        width: 256,
        borderRadius: "20px"
    }
})


const PrimaryButton = (props) => {
    const classes = useStyles();
    return (
        <Button className={classes.button} variant="contained" onClick={() => props.onClick()}>
            {props.label}
        </Button>
    )
}

export default PrimaryButton
