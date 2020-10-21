import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {push} from 'connected-react-router'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/styles'
import Avatar from '@material-ui/core/Avatar'
import {db} from '../../firebase/index'

const useStyles = makeStyles({
    user:{
        display: 'flex',
        padding: '15px',
        borderBottom: '1px solid var(--twitter-background)',
        width: '100%',
    }
})

const MessageList = ({message}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [user, setUser] = useState({})

    const time = (timestamp) => {
        const date = timestamp.toDate()
        return (date.getMonth() + 1) + "/"
        + ('00' + date.getDate()).slice(-2) + " "
        + ('00' + date.getHours()).slice(-2) + ":"
        + ('00' + date.getMinutes()).slice(-2)    
    }

    useEffect(() => {
        db.collection("users").doc(message.uid).get()
        .then((snapshot) => {
            const data = snapshot.data()
            setUser(data)
        })
    },[])

    return (
        <Button 
        className={classes.user} 
        key={message.timestamp}
        onClick={() => dispatch(push('/direct/' + message.uid))}
        >
            <div className="message__user">
                <Avatar src={user.avatar}/>
                <h3>{user.displayname}<span>@{user.username}</span></h3>
            </div>
            <div className="message__last">
                <p>{message.message}<span>{time(message.timestamp)}</span></p>            
            </div>
        </Button>
    )
}

export default MessageList
