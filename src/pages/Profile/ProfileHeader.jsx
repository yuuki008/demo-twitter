import React, {useEffect, useState, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {push} from 'connected-react-router'
import '../../pages/Profile/Profile.css';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import {getUid} from '../../reducks/users/selectors';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import { db,storage } from '../../firebase/index';
import Button from '@material-ui/core/Button';
import Chat from '@material-ui/icons/Chat';
import { addFollow, deleteFollow } from "../../reducks/users/operations";


const useStyles = makeStyles({
    icon: {
        height: '40px',
        width: '40px',
        backgroundColor: "var(--twitter-color)",
        color: 'white',
        marginRight: '5px',
    },
    description:{
        whiteSpace: 'pre-wrap',
    },
    edit:{
        position: 'absolute',
        left: "25px",
        width: '30px',
        height: '30px',
    },
    editIcon:{
        width: '20px',
        height: "20px",
    },
    font:{
        fontSize: '10px',
        borderRadius: "40px",
        backgroundColor: 'var(--twitter-color)',
        color: 'white',
        height: '40px',
        marginLeft: 'auto',
        marginRight: '40px',
    },
    button:{
        width: '100%',
        padding: 0,
    },
    avatar:{
        top: "170px",
        left: "25px",
        width: "130px",
        height: "130px",
        position: 'absolute',
        zIndex: 100,
    },
    default:{
        width: "130px",
        height: "130px", 
        border: "5px solid white",  
    }
})

const ProfileHeader = ({user, setUser, handleOpen, followers, follows}) => {
    const [isFollow, setIsFollow] = useState(false);
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const displayUid = getUid(selector)

    let matchFollow = []

    const followToggle = useCallback(() => {
        setIsFollow(!isFollow)
    },[setIsFollow, isFollow])

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
        const file = event.target.files;
        let blob = new Blob(file, {type: 'image/jpeg'});

        const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const N = 16;
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n%S.length]).join('')

        const uploadRef = storage.ref('images').child(fileName);
        const uploadTask = uploadRef.put(blob)

        uploadTask.then(() => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                const newImage = {id: fileName, path: downloadURL};
                if(type === "avatar"){
                    setAvatar(newImage.path)
                }else if(type === 'background'){
                    setBackground(newImage.path)
                }
            })
        })
    }

    useEffect(() => {
        if(followers){
            console.log(followers)
            console.log(user)
            matchFollow = followers.filter(follower => follower.uid === displayUid)
            if(matchFollow.length > 0){
              setIsFollow(true)
            }else{
              setIsFollow(false)
            }
        }
      },[followers])

    return (
            user.uid === displayUid ? (
            <div className="profile__header">
                <Button className={classes.button}>
                    <label style={{width: '100%'}}>
                    <input type="file" id="image"
                        style={{display: "none"}}
                        onChange={(event) => inputFile(event, 'background')}
                    />
                    {user.background !== "" ? (
                    <img className="user__image"
                        src={user.background}
                        />
                    ):(
                     <div className="no__user__image">写真なし</div>
                    )}
                    </label>
                    </Button>
                <div className="profile__info">
                    <IconButton className={classes.avatar}>
                        <label>
                        <input type="file" id="image"
                        style={{display: "none"}}
                        onChange={(event) => inputFile(event, 'avatar')}
                        />
                            <Avatar 
                            className={classes.default}
                            src={user.avatar}/>
                        </label>
                        </IconButton>
                    <h3>{user.displayname}<span>@{user.username}</span></h3>
                    <div className="profile__follow">
                        {follows !== undefined ? (
                            <p>{follows.length}<span>フォロー</span></p>
                            
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
                        <IconButton className={classes.edit}
                            onClick={() => handleOpen("description")}
                        >
                            <EditIcon className={classes.editIcon}/>
                        </IconButton>
                    </div>
                    <div className="profile__userDescription__overview">
                        <Typography className={classes.description}>
                            {user.description}
                        </Typography>
                    </div>
                </div>
            </div>
            ):(
                <div className="profile__header">
                {user.background !== '' ? (
                    <img className="user__image"
                    src={user.background}
                    />
                ):(
                    <div className="no__user__image">
                        写真なし
                    </div>
                )}
            <div className="profile__info">
            <div className={classes.avatar}>
                <Avatar src={user.avatar} className={classes.default}/>
            </div>
            <h3>{user.displayname}<span>@{user.username}</span></h3>

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
            <div className="no__displayuser">

            <IconButton
            className={classes.icon}
            onClick={() => dispatch(push('/direct/' + user.uid))}
            >
                <Chat/>
            </IconButton>
            {!isFollow ? (
                <Button
                className={classes.font}
                onClick={() => {
                dispatch(addFollow(user.uid, user.displayname, user.username, user.avatar, user.verified))
                followToggle()
                }}
                >
                     フォロー
                </Button>
            ):(
                <Button
                className={classes.font}
                onClick={() => {
                dispatch(deleteFollow(user.uid))
                followToggle()
                }}
                >
                    フォロー中
                </Button>
            )}
            </div>
        </div>
        <div className="profile__userDescription">
            <div className="profile__userDescription__overview">
                <Typography className={classes.description}>
                    {user.description}
                </Typography>
            </div>
        </div>
    </div>
    )
    )
}

export default ProfileHeader
