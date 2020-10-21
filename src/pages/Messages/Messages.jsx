import React, {useEffect, useState} from 'react'
import { fetchRooms } from '../../reducks/users/operations'
import { getRooms, getUid } from '../../reducks/users/selectors'
import {useDispatch, useSelector} from 'react-redux';
import './Messages.css'
import MessageList from '../../components/UIkit/MessageList';



const Messages = () => {
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const displayUid = getUid(selector)
    const rooms = getRooms(selector)
    const [messages, setMessages] = useState([])


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
                <h3>メッセージリスト</h3>
            </div>
            {messages.length > 0 && 
                messages.map((message, index) => (
                    <MessageList key={message.uid} message={message}/>
                ))
            }
        </div>
    )
}

export default Messages

