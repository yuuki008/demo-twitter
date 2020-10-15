import React, {useCallback, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextInput from '../UIkit/TextInput';
import PrimaryButton from '../UIkit/PrimaryButton';
import { Avatar, IconButton } from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../../firebase/index';
import './CommentModal.css'
import { getDisplayname, getUsername } from '../../reducks/users/selectors';
import { addComment } from '../../reducks/posts/operations';

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      top: "40px",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    icon:{
        height: 48,
        width: 48,
    }
  }));


const CommentModal = ({open, handleClose}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector(state => state);
    const [modalStyle] = React.useState(getModalStyle);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([])
    const [post, setPost] = useState({})
    const postId = window.location.pathname.split('/home/')[1];
    const displayname = getDisplayname(selector);
    const username  = getUsername(selector)

    useEffect(() => {
        if(postId !== undefined){
            db.collection('posts').doc(postId).get()
            .then(snapshot => {
                setPost(snapshot.data())
            })
            db.collection('posts').doc(postId).collection('comment').orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }
    },[postId])

    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    });

    const inputComment = useCallback((event) => {
        setComment(event.target.value)
    },[setComment])

    const close = () => {
        setComment("")
        handleClose()
    }


    return (
        <Modal
            open={open}
            onClose={() => close()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className="commodal__header">
                    <Avatar src={post.avatar} />
                    <h3>{post.displayname}<span>@{post.username}</span></h3>
                </div>
                <div className="commodal__post">
                    <p>{post.text}</p>
                </div>
                <div className="commodal__comment" id="scroll-area">
                    {comments.length > 0  && (
                        <>
                        <span>↓この投稿へのコメント</span>
                        {comments.map(comment => 
                            <div className="commodal__com"key={comment.commentId}>
                                <h3>{comment.displayname}<span>@{comment.username}</span></h3>
                                <p>{comment.comment}</p>
                            </div>
                        )}
                        </>
                    )}
                </div>
                <div className="module-spacer--extra-small"/>
                <TextInput
                    fullWidth
                    label="add a comment"
                    multiline={true}
                    rows={5}
                    type={"text"}
                    value={comment}
                    onChange={inputComment}
                />
                <div className="module-spacer--extra-small"/>
                <div className="center">
                    <PrimaryButton 
                        label="Comment"
                        onClick={() => {
                            dispatch(addComment(postId, comment, post))
                            setComment("")
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default CommentModal
