import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {fetchFollow, fetchLikelist, signOut, fetchFollower, fetchMypost, setRoom} from '../../reducks/users/operations';
import Button from '@material-ui/core/Button';
import { db } from '../../firebase/index';
import {getFollow, getUid, getLikelist, getFollower, getMypost} from '../../reducks/users/selectors';
import './Profile.css';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import Post from '../../components/Post/Post';
import Chat from '@material-ui/icons/Chat';
import {push} from 'connected-react-router';
import { makeStyles } from '@material-ui/styles';
import InputModal from '../../components/UIkit/InputModal';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
    icon: {
        height: '60px',
        width: '60px',
    },
    description:{
        whiteSpace: 'pre-wrap',
    },
    edit:{
        marginLeft: '10px',
        width: '24px',
        height: '24px',
    },
    editIcon:{
        width: '20px',
        height: "20px",
    }
})


const Profile = ({handleCommentOpen}) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [user, setUser] = useState({}),
          [open, setOpen] = useState(false),
          [type, setType] = useState("");

    const selector = useSelector(state => state)
    let uid = window.location.pathname.split('/profile/')[1]
    const displayUid = getUid(selector)
    const follows = getFollow(selector)
    const likes = getLikelist(selector)
    const followers = getFollower(selector)
    const myposts = getMypost(selector)
    let matchFollow = []
    let matchLike = []

    const handleClose = (setInput) => {
        setInput("")
        setOpen(false)
    }

    const handleOpen = (type) => {
        setType(type)
        setOpen(true)
    }

    const settingUser = () => {
        db.collection('users').doc(displayUid).get()
        .then(snapshot => {
            setUser(snapshot.data())
        }) 
    }

    const setAvatar = (result) => {
        db.collection('users').doc(displayUid).set({avatar: result}, {merge: true})
        .then(() => {
            settingUser()
        })
    }

    const setBackground = (result) => {
        db.collection('users').doc(displayUid).set({background: result}, {merge: true})
        .then(() => {
            settingUser()
        })
    }

    const inputFile = (event, type) => {
        event.preventDefault()
        const reader = new FileReader()
        const file = event.target.files[0]
        reader.onload = () => {
            if(type === "avatar"){
                setAvatar(reader.result)
            }else if(type === 'background'){
                setBackground(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }


    useEffect(() => {
        if(uid !== undefined){
            db.collection('users').doc(uid).get()
            .then(snapshot => {
                setUser(snapshot.data())
            })
            dispatch(fetchFollow(uid))
            dispatch(fetchLikelist(uid))
            dispatch(fetchFollower(uid))   
            dispatch(fetchMypost(uid))
        }else{
            db.collection('users').doc(displayUid).get()
            .then(snapshot => {
                setUser(snapshot.data())
            })
            dispatch(fetchFollow(displayUid))
            dispatch(fetchLikelist(displayUid))
            dispatch(fetchFollower(displayUid))
            dispatch(fetchMypost(displayUid))
        }
    },[uid])



    return (
        <div className="profile">
            <div className="profile__header">
                        {user.uid === displayUid  ? (
                        <Button>
                            <label style={{width: '100%'}}>
                            <input type="file" id="image"
                            style={{display: "none"}}
                            onChange={(event) => inputFile(event, 'background')}
                            />
                            {user.backgroud !== "" ? (
                                <img className="user__image"
                                src={user.background}
                                />
                            ):(
                                <img className="user__image" 
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAC9CAMAAACTb6i8AAAAOVBMVEXu7u7x8fGoqKimpqbt7e2qqqra2tq+vr7o6Oi7u7uysrLl5eXe3t7W1tbPz8+tra3ExMTKysrR0dFRkMCPAAAEBUlEQVR4nO3Y6XajOBCGYbSBQCyC+7/YqZLAxpmMk/nRNjN+n9MnHbEFfS4k4aYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AJ+Mo0/tY0xT4//Yfd/mrcPYaR1np701kzzml5wV28SXGvuWYzO9c+y6J0c/oK7egu/BDfeeze68DSLzv6/swj2HsbHZxFsOvpHFiEcYXx8FoMNIdYenrP4Znp9yGLf/XDY11O+tH+asd9LsrBewlhiad6zMLHdptR86cueRYyxidMm44we1vr9KJNkm2yKscxMphmnSSpOj/bHJcfrxqFZNFGKY5G79eaWhc/WOeuGxydiz0KmVjsFa11nNjnMLXXwjTLjSiP11ukixLSLtvsU7FD2r1au6IbxqmGUujAShh30ozuyiIsVTv6t5zu/ZWGD7pST9LBgl6aeo1tdkIslXZe5oHlZfQpNWZuEcrS7ahglCyluue1B7vfIQrOZ0phdeBgrz1lsaZVxxubUhuCmfeNczilZRPmvb1Oro5FkYea6u3OlBK+oZuH3MPYs9L4Hfa71s12+zcKuMg4OtZertrSknAwOxmxOs5CtciltD/UZWXQdI+The7bMf6OahVaEVvyRxWDdWHZLR/bfavOWhRb6HoJprc1GG1n66PUczULOTKUp15QskpTLtM3blutxF3Rk4UsYfc3Cy4O9zybSw+1+56csUt05axbOdqbsqtOF9DbJNcJ+DV+qp7V19HD6Z66dhYTRSm1L1ZcsgtuzmH+dRX9UkG5OJt6yaEoWkw03V89C50B33Ohto8nh/HQ/y+IYB7wctNdFvUa0pS6clMPh1b38nVMWNQwtYO3NXg1S1/F+9LMspjIs6CVtGS96TdE3+0CsidiyhGmW7dWd/KVzFmXaKA+zDBtl0PcyYfSnrzeeZKFzqNPJxQ9lTi3LiyTtcZ9Teyk5XZP3ukR7S19/dMpCxvzNlSxM1lByJ1URTmXxLAtf5tJBz6nrC5mM9Bq9jhNaMDKR2CVnfReM393I+8mU4U5LHzPX77XM6mwxpMd1p9vX4DUL52oW5ZPWc3SqGGRG1rPiYEt73dedbWnKj3TRsmhy7vw5jLUO8mbsFplft4eXM2/m3I2aWO6i9i5nXZWmnGdTVhIyRiyr7M31k18HKbPR2zqQmJgXZ4f1hZ37l76O6qa97/j7iL9vMY/v6zpKlEesnlK33iaNeJtErzyJ/FFt103ll7EMrZ9Mlt71VV2XofNnZ9E08lrSJx/lHc1edOJ4GX0n0y96bHDbp5eFhDG48u3ORV/RX0rWnPO6tg1RFB86h/6Ti36h9wYkAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/qi/AA2kHyqkLhUnAAAAAElFTkSuQmCC"/>
                            )}
                            </label>
                        </Button>
                        ):(
                         user.background !== '' ? (
                            <img className="user__image"
                            src={user.background}
                            />
                        ):(
                            <img className="user__image" 
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAC9CAMAAACTb6i8AAAAOVBMVEXu7u7x8fGoqKimpqbt7e2qqqra2tq+vr7o6Oi7u7uysrLl5eXe3t7W1tbPz8+tra3ExMTKysrR0dFRkMCPAAAEBUlEQVR4nO3Y6XajOBCGYbSBQCyC+7/YqZLAxpmMk/nRNjN+n9MnHbEFfS4k4aYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AJ+Mo0/tY0xT4//Yfd/mrcPYaR1np701kzzml5wV28SXGvuWYzO9c+y6J0c/oK7egu/BDfeeze68DSLzv6/swj2HsbHZxFsOvpHFiEcYXx8FoMNIdYenrP4Znp9yGLf/XDY11O+tH+asd9LsrBewlhiad6zMLHdptR86cueRYyxidMm44we1vr9KJNkm2yKscxMphmnSSpOj/bHJcfrxqFZNFGKY5G79eaWhc/WOeuGxydiz0KmVjsFa11nNjnMLXXwjTLjSiP11ukixLSLtvsU7FD2r1au6IbxqmGUujAShh30ozuyiIsVTv6t5zu/ZWGD7pST9LBgl6aeo1tdkIslXZe5oHlZfQpNWZuEcrS7ahglCyluue1B7vfIQrOZ0phdeBgrz1lsaZVxxubUhuCmfeNczilZRPmvb1Oro5FkYea6u3OlBK+oZuH3MPYs9L4Hfa71s12+zcKuMg4OtZertrSknAwOxmxOs5CtciltD/UZWXQdI+The7bMf6OahVaEVvyRxWDdWHZLR/bfavOWhRb6HoJprc1GG1n66PUczULOTKUp15QskpTLtM3blutxF3Rk4UsYfc3Cy4O9zybSw+1+56csUt05axbOdqbsqtOF9DbJNcJ+DV+qp7V19HD6Z66dhYTRSm1L1ZcsgtuzmH+dRX9UkG5OJt6yaEoWkw03V89C50B33Ohto8nh/HQ/y+IYB7wctNdFvUa0pS6clMPh1b38nVMWNQwtYO3NXg1S1/F+9LMspjIs6CVtGS96TdE3+0CsidiyhGmW7dWd/KVzFmXaKA+zDBtl0PcyYfSnrzeeZKFzqNPJxQ9lTi3LiyTtcZ9Teyk5XZP3ukR7S19/dMpCxvzNlSxM1lByJ1URTmXxLAtf5tJBz6nrC5mM9Bq9jhNaMDKR2CVnfReM393I+8mU4U5LHzPX77XM6mwxpMd1p9vX4DUL52oW5ZPWc3SqGGRG1rPiYEt73dedbWnKj3TRsmhy7vw5jLUO8mbsFplft4eXM2/m3I2aWO6i9i5nXZWmnGdTVhIyRiyr7M31k18HKbPR2zqQmJgXZ4f1hZ37l76O6qa97/j7iL9vMY/v6zpKlEesnlK33iaNeJtErzyJ/FFt103ll7EMrZ9Mlt71VV2XofNnZ9E08lrSJx/lHc1edOJ4GX0n0y96bHDbp5eFhDG48u3ORV/RX0rWnPO6tg1RFB86h/6Ti36h9wYkAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/qi/AA2kHyqkLhUnAAAAAElFTkSuQmCC"/>
                        )
                        )}
                <div className="profile__info">
                        {user.uid === displayUid ? (
                        <IconButton className={classes.icon}>
                            <label>
                                <input type="file" id="image"
                                style={{display: "none"}}
                                onChange={(event) => inputFile(event, 'avatar')}
                                />
                                    <Avatar src={user.avatar}/>
                            </label>
                        </IconButton>
                        ):(
                            <div style={{width: "60px", height: "60px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Avatar src={user.avatar} />
                            </div>
                        )}
                    <h3>{user.displayname}<span>@{user.username}</span></h3>
                    {user.uid !== displayUid && (
                        <IconButton
                        className={classes.icon}
                        onClick={() => dispatch(push('/direct/' + user.uid))}
                        >
                            <Chat/>
                        </IconButton>
                    )}
                    <div className="profile__follow">
                        {follows !== undefined ? (
                            <p>{follows.length}<span>フォロー中</span></p>
                            
                            ):(
                                <p>0<span>follow</span></p>
                                )}
                        {followers !== undefined ? (
                            <p>{followers.length}<span>フォロワー</span></p>
                            ):(
                                <p>0<span>followers</span></p>
                                )}
                    </div>
                </div>
                <div className="profile__userDescription">
                    <div className="profile__userDeiscription_header">
                        概要
                        {user.uid === displayUid && (
                            <IconButton className={classes.edit}
                                onClick={() => handleOpen("description")}
                            >
                                <EditIcon className={classes.editIcon}/>
                            </IconButton>
                        )}
                    </div>
                    <div className="profile__userDescription__overview">
                        <Typography className={classes.description}>
                            {user.description}
                        </Typography>
                    </div>
                </div>
            </div>
            <div className="profile__body">
            </div>
            {myposts !== undefined && (
            myposts.map(post => {
                follows !== undefined && (
                    matchFollow = follows.filter(follow => follow.uid === post.uid)
                )
                likes !== undefined && (
                    matchLike = likes.filter(like => like.postId === post.postId)
                )
                return(
                    <Post 
                    uid={displayUid}
                    postId={post.postId}
                    timestamp={post.timestamp}
                    key={post.postId}
                    displayname={post.displayname}
                    username={post.username}
                    verified={post.verified}
                    text={post.text}
                    image={post.image}
                    follows={follows}
                    likes={likes}
                    matchFollow={matchFollow}
                    matchLike={matchLike}
                    avatar={post.avatar}
                    handleCommentOpen={handleCommentOpen}
                    />
                )
            })
            )}
            {likes.map(post => {
                follows !== undefined && (
                    matchFollow = follows.filter(follow => follow.uid === post.uid)
                )
                likes !== undefined && (
                    matchLike = likes.filter(like => like.uid === post.uid)
                )
                return(
                    <Post
                    postId={post.postId}
                    timestamp={post.timestamp}
                    key={post.postId}
                    displayname={post.displayname}
                    username={post.username}
                    verified={post.verified}
                    text={post.text}
                    image={post.image}
                    uid={post.uid}
                    follows={follows}
                    likes={likes}
                    matchFollow={matchFollow}
                    matchLike={matchLike}
                    avatar={post.avatar}
                    handleCommentOpen={handleCommentOpen}
                    />
                    )
            })}
            {(uid === displayUid　|| uid === undefined) && (
                <Button onClick={() => dispatch(signOut())}>
                    サインアウト
                </Button>
            )}
            <InputModal type={type} open={open} handleClose={handleClose} settingUser={settingUser} />
        </div>
    )
}

export default Profile
