import {db, FirebaseTimestamp} from '../../firebase/index';
import {fetchPostsAction} from './actions';

const postsRef = db.collection("posts")


export const addLike = (postId, displayname, username, image, uid, text, timestamp, verified, avatar) => {
    return async (dispatch, getState) => {
        const displayUid = getState().users.uid
        const displayUsername = getState().users.username
        const displayDisplayname = getState().users.displayname
        postsRef.doc(postId).collection("like").doc(displayUid).set({
            uid: displayUid,
            username: displayUsername,
            displayname: displayDisplayname,
        })

        db.collection('users').doc(displayUid).collection('likelist').doc(postId).set({
            avatar: avatar,
            postId: postId,
            image: image,
            text: text,
            displayname: displayname,
            username, username,
            timestamp, timestamp,
            uid: uid,
            verified: true,
        })
        
    }
}

export const deleteLike = (postId) => {
    return async (dispatch, getState) => {
        const displayUid = getState().users.uid;

        postsRef.doc(postId).collection('like').doc(displayUid).delete()
        db.collection('users').doc(displayUid).collection('likelist').doc(postId).delete()
    }
}

export const addComment = (postId, comment, post) => {
    return async (dispatch, getState) => {
        const displayUid = getState().users.uid;
        const displayDisplayname = getState().users.displayname
        const displayUsername = getState().users.username
        const ref = postsRef.doc(postId).collection('comment').doc()
        const commentId = ref.id
        const data = {
            timestamp: FirebaseTimestamp.now(),
            commentId: commentId,
            comment: comment,
            uid: displayUid,
            username: displayUsername,
            displayname: displayDisplayname,
        }
        postsRef.doc(postId).collection('comment').doc(commentId).set(data)
        db.collection('users').doc(displayUid).collection('comment').doc(commentId).set({
            commentId: commentId,
            post: post
        })
    }
}


export const sendTweet = (image, text, username, displayname, verified) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid
        const timestamp = FirebaseTimestamp.now()

        const data = {
            avatar: "",
            text: text,
            image: image.path,
            username: username,
            displayname: displayname,
            timestamp: timestamp,
            uid: uid,
            verified: true,
        }

        const ref = postsRef.doc()
        const postId = ref.id
        data.postId = postId
        postsRef.doc(postId).set(data)

        db.collection('users').doc(uid).collection('mypost').doc(postId).set(data)
    }
}


export const fetchPosts = () => {
    return async (dispatch) => {
        postsRef.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const posts = []
            snapshot.docs.forEach(doc => {
                posts.push(doc.data())
            })
            dispatch(fetchPostsAction(posts))
        })
    }
}