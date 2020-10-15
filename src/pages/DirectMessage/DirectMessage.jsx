import React, {useCallback, useState, useEffect} from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import './DirectMessage.css'
import { db, FirebaseTimestamp } from '../../firebase'
import { getDisplayname, getUid, getUsername, getAvatar } from '../../reducks/users/selectors'
import {useSelector, useDispatch} from 'react-redux';
import {sendMessage} from '../../reducks/users/operations';
import ListIcon from '@material-ui/icons/List';
import { makeStyles } from '@material-ui/styles';
import {push} from 'connected-react-router';

const useStyles = makeStyles({
    icon: {
        width: "40px",
        height: "40px"
    }
})
 

const DirectMessage = () => {
    const selector = useSelector(state => state);
    const classes = useStyles()
    const dispatch = useDispatch();
    const displayUid = getUid(selector)


    const displayDisplayname = getDisplayname(selector)
    const displayUsername = getUsername(selector);
    const displayAvatar = getAvatar(selector)
    const roomsRef = db.collection('rooms')
    const usersRef = db.collection('users')
    
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [roomId, setRoomId] = useState("");
    const uid = window.location.pathname.split('/direct/')[1]
    const [user, setUser] = useState({})

    const inputMessage = useCallback((event) => {
        setMessage(event.target.value)
    },[setMessage])
    
    const handleKeyDown = (event, roomId) => {
        if(event.key === "Enter" && message){
            if(roomId === undefined || roomId === ""){
                const roomRef = roomsRef.doc()
                const id = roomRef.id;
                usersRef.doc(uid).collection('rooms').doc(displayUid).set({
                    avatar: displayAvatar,
                    uid: displayUid,
                    displayname: displayDisplayname,
                    username: displayUsername,
                    roomId: id,
                    message: message,
                    timestamp: FirebaseTimestamp.now()
                },{merge: true})
                usersRef.doc(displayUid).collection('rooms').doc(uid).set({
                    uid: uid,
                    displayname: user.displayname,
                    username: user.username,
                    roomId: id,
                    message: message,
                    timestamp: FirebaseTimestamp.now()
                }, {merge: true})
                dispatch(sendMessage(message, id))
                setRoomId(id)
            }else{
                usersRef.doc(uid).collection('rooms').doc(displayUid).set({
                    message: message,
                    timestamp: FirebaseTimestamp.now()
                }, {merge: true})
                usersRef.doc(displayUid).collection('rooms').doc(uid).set({
                    message: message,
                    timestamp: FirebaseTimestamp.now()
                },{merge: true})
                dispatch(sendMessage(message, roomId))
            }
            setMessage("")
        }
    }

    const time = (timestamp) => {
        const date = timestamp.toDate()
        return (date.getMonth() + 1) + "/"
        + ('00' + date.getDate()).slice(-2) + " "
        + ('00' + date.getHours()).slice(-2) + ":"
        + ('00' + date.getMinutes()).slice(-2)    
    }


    useEffect(() => {
        db.collection('users').doc(uid).get()
        .then(snapshot => {{
            setUser(snapshot.data())
        }})
        db.collection('users').doc(displayUid).collection('rooms').doc(uid).get()
        .then(snapshot => {
            const data = snapshot.data()
            if(data !== undefined){
                setRoomId(data.roomId)
            }
        })
    },[sendMessage])


    useEffect(() => {
        if(roomId !== ""){
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    setMessages(snapshot.docs.map(doc => doc.data()))
                })       
        }
    },[roomId, sendMessage])



    return (
        <div className="direct">
            <div className="direct__header">
                <IconButton 
                onClick={() => dispatch(push('/messages'))}
                className={classes.icon}>
                    <ListIcon/>
                </IconButton>
                <Avatar src={user.avatar}/>
                <h3>{user.displayname}<span>{user.username}</span></h3>
            </div>

            <div className="direct__chats">
                {messages.map((message, index) => 
                <>
                    <div className={`message ${message.uid === displayUid ? "sent" : "received"}`} key={message.messageId}>
                        <p>{message.message}</p>
                    　　<span>{time(message.timestamp)}</span>
                    </div>
                </>
                )}
            </div>



            <div className="direct__post">
                <div className="direct__post__header">
                    <Avatar src=""/>
                    <h3>{displayDisplayname}</h3>
                </div>
                <div className="direct__input">
                    <input
                       type="text"
                       placeholder="Type a message"
                       value={message}
                       onChange={(event) => inputMessage(event)}
                       onKeyDown={(event) => handleKeyDown(event, roomId)}
                    />
                </div>

            </div>
        </div>
    )
}

export default DirectMessage
