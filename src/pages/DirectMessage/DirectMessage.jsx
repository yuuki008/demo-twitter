import React, {useCallback, useState, useEffect} from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import './DirectMessage.css'
import { db, FirebaseTimestamp } from '../../firebase'
import { getDisplayname, getUid, getUsername, getAvatar } from '../../reducks/users/selectors'
import {useSelector, useDispatch} from 'react-redux';
import {sendMessage} from '../../reducks/users/operations';
import { makeStyles } from '@material-ui/styles';
import {push} from 'connected-react-router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
    icon: {
        position: 'absolute',
        left: 0,
        top: "50",
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
        event.preventDefault()
        if(message){
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

    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    }) 



    return (
        <div className="direct">
            <div className="direct__header">
                <IconButton 
                onClick={() => dispatch(push('/messages'))}
                className={classes.icon}>
                    <ArrowBackIcon/>
                </IconButton>
                <Avatar src={user.avatar}/>
                <h3>{user.displayname}<span>{user.username}</span></h3>
            </div>

            <div id={"scroll-area"} className="direct__chats">
                {messages.map((message, index) => 
                <React.Fragment key={index}>
                    <div className={`message ${message.uid === displayUid ? "sent" : "received"}`} >
                        <p>{message.message}</p>
                    　　<span>{time(message.timestamp)}</span>
                    </div>
                </React.Fragment>
                )}
            </div>

            <div className="direct__post">
                <div className="derect__p">
                    <div className="direct__post__header">
                        <Avatar src=""/>
                        <h3>{displayDisplayname}</h3>
                    </div>
                    <div className="direct__input">
                        <form  onSubmit={(event) => handleKeyDown(event,roomId)}>
                            <input
                            type="text"
                            placeholder="Type a message"
                            value={message}
                            onChange={(event) => inputMessage(event)}
                            />
                            <input style={{display: 'none'}}
                            type="submit"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DirectMessage
