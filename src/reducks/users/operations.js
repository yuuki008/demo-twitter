import {push} from 'connected-react-router';
import { signInAction, signOutAction, fetchFollowAction, fetchLikelistAction, fetchMypostAction, fetchFollowerAction, fetchRoomsAction} from './actions';
import {auth, FirebaseTimestamp, db} from '../../firebase/index';

const usersRef = db.collection('users');
const roomsRef = db.collection('rooms')


export const fetchRooms = (displayUid) => {
    return async (dispatch) => {
        usersRef.doc(displayUid).collection('rooms').get()
        .then(snapshots => {
            const rooms = []
            snapshots.forEach(snapshot => {
                const data = snapshot.data()
                rooms.push(data)
            })
            dispatch(fetchRoomsAction(rooms))
        })
    }
}

export const sendMessage = (message, roomId) => {
    return async (dispatch, getState) => {
        const displayUid = getState().users.uid;
        const displayDisplayname = getState().users.displayname;
        const displayUsername = getState().users.username;

        const ref = roomsRef.doc(roomId).collection('messages').doc()
        const messageId = ref.id
        roomsRef.doc(roomId).collection('messages').doc(messageId).set({
            messageId: messageId,
            roomId: roomId,
            timestamp: FirebaseTimestamp.now(),
            message: message,
            displayname: displayDisplayname,
            username: displayUsername,
            uid: displayUid
        })
    }
}


export const fetchMypost = (uid) => {
    return async (dispatch) => {
        usersRef.doc(uid).collection('mypost').get()
        .then(snapshots => {
            const mypost = []
            snapshots.forEach(snapshot => {
                const data = snapshot.data()
                mypost.push(data)
            })
            dispatch(fetchMypostAction(mypost))
        })
    }
}

export const fetchFollower = (uid) => {
    return async (dispatch) => {
        usersRef.doc(uid).collection('follower').get()
            .then(snapshots => {
                const follower = []
                snapshots.forEach(snapshot => {
                    const data = snapshot.data()
                    follower.push(data)
                })
                dispatch(fetchFollowerAction(follower))
            })
    }
}


export const addFollow = (uid, displayname, username, avatar) => {
    return async (dispatch, getState) => {
        console.log(avatar)
        const displayUid = getState().users.uid
        const displayDisplayname = getState().users.displayname
        const displayUsername = getState().users.username
        const displayAvatar = getState().users.avatar
        usersRef.doc(displayUid).collection('follow').doc(uid).set({
            avatar: avatar,
            uid: uid,
            displayname: displayname,
            username: username,
        })

        usersRef.doc(uid).collection('follower').doc(displayUid).set({
            avatar: displayAvatar,
            uid: displayUid,
            displayname: displayDisplayname,
            username: displayUsername,
        })
    }
}

export const deleteFollow = (uid) => {
    return async (dispatch, getState) => {
        const displayUid = getState().users.uid
        usersRef.doc(displayUid).collection('follow').doc(uid).delete()
        usersRef.doc(uid).collection('follower').doc(displayUid).delete()
    }
}

export const fetchLikelist = (uid) => {
    return async (dispatch) => {
        usersRef.doc(uid).collection('likelist').get()
        .then(snapshots => {
            const follower = []
            snapshots.forEach(snapshot => {
                const data = snapshot.data()
                follower.push(data)
            })
            dispatch(fetchLikelistAction(follower))
        })
    }
}

export const fetchFollow = (uid) => {
    return async (dispatch, getState) => {
        usersRef.doc(uid).collection('follow').get()
        .then(snapshots => {
            const follow = []
            snapshots.forEach(snapshot => {
                const data = snapshot.data()
                follow.push(data)
            })
            dispatch(fetchFollowAction(follow))
        })
    }
}

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if(user) {
                const uid = user.uid
                db.collection('users').doc(uid).get()
                    .then(snapshot => {
                        const data = snapshot.data()
                        dispatch(signInAction({
                            isSignedIn: true,
                            uid: uid,
                            username: data.username,
                            displayname: data.displayname
                        }))
                    })
            }else{
                dispatch(push('/signin'))
            }
        })
    }
}

export const signUp = (username, displayname, email, password, confirmPassword) => {
    return async (dispatch) => {
        if(username === "" ||displayname === "" || email === "" || password === "" || confirmPassword === ""){
            alert('必須入力が未入力です')
            return false
        }
        if(password !== confirmPassword){
            alert('パスワードが一致しません。もう一度お試しください!')
            return false
        }
        return auth.createUserWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user
                if(user){
                    const uid = user.uid
                    const timestamp = FirebaseTimestamp.now()
    
                    const userInitialData = {
                        created_at: timestamp,
                        email: email,
                        uid: uid,
                        updated_at: timestamp,
                        username: username,
                        displayname: displayname,
                        avatar: "",
                    }
                    db.collection('users').doc(uid).set(userInitialData)
                        .then(() => {
                            dispatch(push('/signin'))
                        })
                }
            })
    }
}

export const signIn = (email, password) => {
    return async (dispatch) => {
        if(email === "" || password === ""){
            alert('名前が未入力です')
            return false
        }
        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user
                if(user) {
                    const uid = user.uid
                    db.collection('users').doc(uid).get()
                        .then(snapshot => {
                            const data = snapshot.data()
                            dispatch(signInAction({
                                isSignedIn: true,
                                uid: uid,
                                username: data.username,
                                displayname: data.displayname
                            }))
                            dispatch(push('/'))
                        })
                }
            })
    }
}

export const resetPassword = (email) => {
    return async (dispatch) => {
        if(email === ""){
            alert('必須項目が未入力です')
            return false
        }else{
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('入力されたアドレスにパスワードリセット用のパスワードを送信しました。')
                    dispatch(push('/signin'))
                })
                .catch(() => {
                    alert('パスワードリセットに失敗しました。通信環境を整えて再度送信してください。')
                })
        }
    }
}

export const signOut = () => {
    return async (dispatch) => {
        auth.signOut()
            .then(() => {
                dispatch(signOutAction())
                dispatch(push('/signin'))
            })
    }
}