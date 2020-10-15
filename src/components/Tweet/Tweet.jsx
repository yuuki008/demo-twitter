import React, {useCallback, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextInput from '../UIkit/TextInput';
import PrimaryButton from '../UIkit/PrimaryButton';
import { Avatar, IconButton } from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import { storage } from '../../firebase/index';
import ImagePreview from './ImagePreview';
import { getDisplayname, getUsername } from '../../reducks/users/selectors';
import {useDispatch, useSelector} from 'react-redux'
import './Tweet.css'
import {sendTweet} from '../../reducks/posts/operations';

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
    paper:{
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2,4,3),
    },
    icon:{
        height: 48,
        width: 48,
    }
}))

const Tweet = ({open, handleClose}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    
    const username = getUsername(selector)
    const displayname = getDisplayname(selector)
    const [modalStyle] = React.useState(getModalStyle);
    const [text, setText] = useState("")
    const [image, setImage] = useState("")

    const inputText = useCallback((event) => {
        setText(event.target.value)
    },[setText])

    const deleteImage = useCallback(async(id) => {
        const ret = window.confirm('この画像を削除しますか?')
        if(!ret){
            return false
        }else{
            setImage("")
            return storage.ref('images').child(id).delete()
        }
    })

    const uploadImage = useCallback((event) => {
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
                setImage(newImage)
            })
        })
    },[setImage])

    return(
        <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={classes.paper}>
            <div className="tweet__header">
                <Avatar/>
                <p>{displayname}<span>@{username}</span></p>
            </div>
           {image !== "" && (
                <ImagePreview delete={deleteImage} id={image.id} path={image.path}/>
           )}
           <div className="module-spacer--extra-small"/>
           <IconButton className={classes.icon}>
               <label>
                   <AddPhotoAlternateIcon/>
                   <input 
                       className="u-display-none" type="file" id="image"
                       onChange={(event) => uploadImage(event)}
                    />
               </label>
           </IconButton>
           <TextInput 
                fullWidth
                label="add a tweet"
                multiline={true}
                required={true}
                rows={5}
                type={"text"}
                value={text}
                onChange={inputText}
            />
            <div className="module-spacer--extra-small"/>
            <div className="center">
                <PrimaryButton 
                    label="Tweet"
                    onClick={() => {
                        dispatch(sendTweet(image, text, username, displayname))
                        setText("")
                        handleClose()
                    }}
                />      
            </div>
        </div>
    </Modal>
    )
}

export default Tweet