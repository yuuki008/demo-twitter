import React, {useEffect, useState} from 'react'
import { fetchRooms } from '../../reducks/users/operations'
import { getRooms, getUid } from '../../reducks/users/selectors'
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import {push} from 'connected-react-router';
import './Messages.css'
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    user:{
        display: 'flex',
        padding: '15px',
        borderBottom: '1px solid var(--twitter-background)',
        width: '100%',
    }
})

const Messages = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const selector = useSelector(state => state)
    const displayUid = getUid(selector)
    const rooms = getRooms(selector)
    const [messages, setMessages] = useState([])

    const time = (timestamp) => {
        const date = timestamp.toDate()
        return (date.getMonth() + 1) + "/"
        + ('00' + date.getDate()).slice(-2) + " "
        + ('00' + date.getHours()).slice(-2) + ":"
        + ('00' + date.getMinutes()).slice(-2)    
    }

    useEffect(() => {
        dispatch(fetchRooms(displayUid))
    },[])

    useEffect(() => {
        if(rooms !== undefined){
            setMessages(rooms.map(room => room))
        }
    },[rooms])


    


    return (
        <div className="messages">
            <div className="messages__header">
                <h3>Messages</h3>
            </div>
            {messages.length > 0 && 
                messages.map((message, index) => (
                    <Button 
                    className={classes.user} 
                    key={message.timestamp}
                    onClick={() => dispatch(push('/direct/' + message.uid))}
                    >
                        <div className="message__user">
                            <Avatar src={message.avatar}/>
                            <h3>{message.displayname}<span>@{message.username}</span></h3>
                        </div>
                        <div className="message__last">
                            <p>{message.message}<span>{time(message.timestamp)}</span></p>            
                        </div>
                    </Button>
                ))
            }
        </div>
    )
}

export default Messages

