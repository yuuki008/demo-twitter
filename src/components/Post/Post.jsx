import React, { useEffect, useState, useCallback } from "react";
import "./Post.css";
import { Avatar, Badge } from "@material-ui/core";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router'
import {db} from '../../firebase/index'
import { addLike, deleteLike } from "../../reducks/posts/operations";
// import { addFollow, deleteFollow } from "../../reducks/users/operations";
import {getUid} from '../../reducks/users/selectors';
import { addFollow, deleteFollow } from "../../reducks/users/operations";

const useStyles = makeStyles({
    like:{
        color: "red",
    }
})

const Post = ({postId, timestamp, text, image, uid, handleCommentOpen, matchLike, likes, matchFollow, follows}) => {
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const classes = useStyles();

    const displayUid  = getUid(selector)
    const [isFollow, setIsFollow] = useState(false)
    const [like, setLike] = useState(false);
    const [likenumber, setLikenumber] = useState(0)
    const [commentnumber, setCommentnumber] = useState(0)
    const [user, setUser] = useState({})


    const likeToggle = useCallback(() => {
      setLike(!like)
    },[setLike, like])

    const followToggle = useCallback(() => {
      setIsFollow(!isFollow)
    },[setIsFollow, isFollow])

    useEffect(() => {
      if(matchLike.length > 0){
        setLike(true)
      }else{
        setLike(false)
      }
    },[likes])

    useEffect(() => {
      if(matchFollow.length > 0){
        setIsFollow(true)
      }else{
        setIsFollow(false)
      }
    },[follows])

    useEffect(() => {
      db.collection('posts').doc(postId).collection('like')
      .onSnapshot(snapshot => {
        setLikenumber(snapshot.docs.length)
      })
      db.collection('posts').doc(postId).collection('comment')
      .onSnapshot(snapshot => {
        setCommentnumber(snapshot.docs.length)
      })
      db.collection('users').doc(uid).get()
      .then(snapshot => {
        setUser(snapshot.data())
      })
    },[])

    return(
        <div className="post">
        <div className="post__avatar">
          <IconButton
            onClick={() => dispatch(push('/profile/' + uid))}
          >
            <Avatar src={user.avatar} />
          </IconButton>
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {user.displayname}
                <span className="post__headerSpecial">
                  {/* {verified && <VerifiedUserIcon className="post__badge" />} @ */}
                  @{user.username}
                </span>
            </h3>
            {displayUid !== uid && (
              !isFollow ? (
                <Button
                onClick={() => {
                  dispatch(addFollow(user.uid, user.displayname, user.username, user.avatar, user.verified))
                  followToggle()
                }}
                >
                    フォロー
                </Button>
              ):(
                <Button
                onClick={() => {
                  dispatch(deleteFollow(user.uid))
                  followToggle()
                }}
                >
                    フォロー解除
                </Button>
              )
            )}
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <img src={image} alt="" />
          <div className="post__footer">
            <Badge badgeContent={commentnumber}>
              <IconButton
              onClick={() => {
                handleCommentOpen()
                dispatch(push('/home/' + postId))
              }}
              >
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
            </Badge>
            <RepeatIcon fontSize="small" />
            <Badge badgeContent={likenumber}>
              {!like ? (
                <IconButton
                  onClick={() => {
                    dispatch(addLike(postId, user.displayname, user.username, image, user.uid, text, timestamp, user.verified, user.avatar))
                    likeToggle()
                  }}
                >    
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              ):(
                <IconButton
                className={classes.like}
                onClick={() => {
                  dispatch(deleteLike(postId))
                  likeToggle()
                }}
                >    
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              )}
            </Badge>
            <PublishIcon fontSize="small" />
          </div>
        </div>
      </div>
    )

}
export default Post