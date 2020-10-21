import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {db} from '../../firebase/index'
import Button from '@material-ui/core/Button'
import {useSelector} from 'react-redux'
import {getUid} from '../../reducks/users/selectors'
import TextInput from './TextInput';

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
    left: "20%",
    top: "20%",
    width: "30%",
    textAlign: 'center',
    backgroundColor: "white",
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  close:{
    position: 'fixed',
    top: 10,
    right: 10,
  },
  icon:{
    width: '40px',
    height: '40px',
  },
  input:{
      height: 'auto',
  },
  button:{
      width: '100%',
  }
}));

const InputModal = ({type, open, handleClose, settingUser }) => {
    const selector = useSelector(state => state)
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    
    const uid = getUid(selector)
    const [input ,setInput] = useState(""),
          [row, setRow] = useState(1),
          [label, setLabel] = useState("");
    
    
    const handleInput = useCallback((event) => {
        setInput(event.target.value)
    },[setInput])
    
    
    
    const handleSet = useCallback(() => {
        if(type = "description"){
            const newInput = input.replace('/n', <br/>)
            if(newInput.length > 50){
                alert('50文字を超えています!')
                return false
            }
            db.collection("users").doc(uid).set({description: newInput}, {merge: true})
            .then(() => {
                settingUser()
                handleClose(setInput)
                setLabel("")
            })
        }else if(type = "name"){
            db.collection('users').doc(uid).set({username: input}, {merge: true})
            .then(() => {
                settingUser()
                handleClose(setInput)
                setLabel("")
            })
        }
    })

    useEffect(() => {
        db.collection('users').doc(uid).get()
        .then(snapshot => {
            const data = snapshot.data()
            console.log(data)
            if(type = 'description'){
                setInput(data.description)
                setRow(5)
                setLabel('ユーザー説明')
            }else if(type = "name"){
                setInput(data.username)
                setLabel("ユーザー名")
            }       
        })
    },[])

    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={classes.paper}>
        <div>
            <h4>{label}</h4>
            <TextInput
                className={classes.input}
                fullWidth={true} label={type} multiline={true} required={true} 
                rows={4} value={input} type={"text"} onChange={handleInput}
            />
            <Button
            className={classes.button}
            onClick={() => {
            handleSet()
            }}
            >アカウント更新</Button>
        </div>
        </div>
        </Modal>
    )
}

export default InputModal
