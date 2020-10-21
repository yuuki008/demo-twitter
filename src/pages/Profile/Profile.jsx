import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {fetchFollow, fetchLikelist, signOut, fetchFollower, fetchMypost, setRoom} from '../../reducks/users/operations';
import Button from '@material-ui/core/Button';
import { db } from '../../firebase/index';
import {getFollow, getUid, getLikelist, getFollower, getMypost} from '../../reducks/users/selectors';
import './Profile.css';
import Post from '../../components/Post/Post';
import InputModal from '../../components/UIkit/InputModal';
import ProfileHeader from './ProfileHeader';

const Profile = ({handleCommentOpen}) => {
    const dispatch = useDispatch()
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
        if(setInput){
            setInput("")
        }
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
            <ProfileHeader user={user} setUser={setUser} handleOpen={handleOpen} follows={follows} followers={followers}/>
            <div className="profile__body">
            </div>
            {myposts !== undefined && (
            myposts.map(post => {
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
                    likes={likes}
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
