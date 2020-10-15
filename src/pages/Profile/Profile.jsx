import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {fetchFollow, fetchLikelist, signOut, fetchFollower, fetchMypost, setRoom} from '../../reducks/users/operations';
import Button from '@material-ui/core/Button';
import { db } from '../../firebase/index';
import {getFollow, getUid, getLikelist, getFollower, getMypost} from '../../reducks/users/selectors';
import './Profile.css';
import { Avatar, IconButton } from '@material-ui/core';
import Post from '../../components/Post/Post';
import Chat from '@material-ui/icons/Chat';
import {push} from 'connected-react-router';


const Profile = ({handleCommentOpen}) => {
    const dispatch = useDispatch()
    const [user, setUser] = useState({})
    const selector = useSelector(state => state)
    let uid = window.location.pathname.split('/profile/')[1]
    const displayUid = getUid(selector)
    const follows = getFollow(selector)
    const likes = getLikelist(selector)
    const followers = getFollower(selector)
    const myposts = getMypost(selector)
    let matchFollow = []
    let matchLike = []

    const inputAvatar = (event) => {
        const reader = new FileReader()
        const file = event.target.files[0]
        reader.onload = () => {
            db.collection('users').doc(displayUid).set({avatar: reader.result}, {merge: true})
            .then(() => {
                db.collection('users').doc(displayUid).get()
                .then(snapshot => {
                    setUser(snapshot.data())
                })
            })
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
                <div className="profile__info">
                    <IconButton>
                        {uid === displayUid || uid === undefined ? (
                            <label>
                                <input type="file" id="image"
                                style={{display: "none"}}
                                onChange={(event) => inputAvatar(event)}
                                />
                                <Avatar src={user.avatar}/>
                            </label>
                        ):(
                            <Avatar src={user.avatar} />
                        )}
                    </IconButton>
                    <h3>{user.displayname}<span>@{user.username}</span></h3>
                    {user.uid !== displayUid && (
                        <IconButton
                           onClick={() => dispatch(push('/direct/' + user.uid))}
                        >
                            <Chat/>
                        </IconButton>
                    )}
                </div>
                <div className="profile__follow">
                    {follows !== undefined ? (
                        <p>{follows.length}<span>follow</span></p>

                    ):(
                        <p>0<span>follow</span></p>
                    )}
                    {followers !== undefined ? (
                        <p>{followers.length}<span>follower</span></p>
                    ):(
                        <p>0<span>followers</span></p>
                    )}
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
        </div>
    )
}

export default Profile
