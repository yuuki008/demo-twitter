import React, { useEffect, useState, useCallback } from "react";
import "./Post.css";
import { Avatar, Badge } from "@material-ui/core";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PublishIcon from "@material-ui/icons/Publish";
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router'
import {db} from '../../firebase/index'
import { addLike, deleteLike } from "../../reducks/posts/operations";
import {getUid} from '../../reducks/users/selectors';
import { addFollow, deleteFollow } from "../../reducks/users/operations";

const useStyles = makeStyles((theme) => ({
    like:{
        color: "red",
    },
    icon:{
      width: "30px",
      height: "30px",
    },
    font:{
      fontSize: '10px',
    }
}))

const Post = ({postId, timestamp, text, image, uid, handleCommentOpen, matchLike, likes}) => {
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const classes = useStyles();

    const displayUid  = getUid(selector)
    const [like, setLike] = useState(false);
    const [likenumber, setLikenumber] = useState(0)
    const [commentnumber, setCommentnumber] = useState(0)
    const [user, setUser] = useState({})


    const likeToggle = useCallback(() => {
      setLike(!like)
    },[setLike, like])

    useEffect(() => {
      if(matchLike.length > 0){
        setLike(true)
      }else{
        setLike(false)
      }
    },[likes])

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
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
                <IconButton
                  className={classes.icon}
                  onClick={() => dispatch(push('/profile/' + uid))}
                >
                  <Avatar src={user.avatar} />
                </IconButton>
                <h2>
                  {user.displayname}
                  <span className="post__headerSpecial">
                    @{user.username}
                  </span>
              </h2>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <div className="post__image">
            <img src={image} alt="" />
          </div>
          <div className="post__footer">
            <Badge 
            badgeContent={commentnumber}
            className={classes.icon}
            >
              <IconButton
              onClick={() => {
                handleCommentOpen()
                dispatch(push('/home/' + postId))
              }}
              >
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
            </Badge>
            <Badge
            className={classes.icon}
            >
              <IconButton>
                <RepeatIcon fontSize="small" />
              </IconButton>
            </Badge>
            <Badge 
            badgeContent={likenumber}
            className={classes.icon}
            >
              {!like ? (
                <IconButton
                  onClick={() => {
                    dispatch(addLike(postId, user.displayname, user.username, image, user.uid, text, timestamp, user.verified, user.avatar))
                    likeToggle()
                  }}
                >    
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              ):(
                <IconButton
                className={classes.like}
                onClick={() => {
                  dispatch(deleteLike(postId))
                  likeToggle()
                }}
                >    
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              )}
            </Badge>
            <Badge
            className={classes.icon}
            >
              <IconButton>
                <PublishIcon fontSize="small" />
              </IconButton>
            </Badge>
          </div>
        </div>
      </div>
    )

}
export default Post