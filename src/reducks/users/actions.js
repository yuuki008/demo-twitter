export const FETCH_ROOMS = "FETCH_ROOMS"
export const fetchRoomsAction = (rooms) => {
    return{
        type: FETCH_ROOMS,
        payload: rooms
    }
}

export const FETCH_MYPOST = "FETCH_MYPOST"
export const fetchMypostAction = (mypost) => {
    return{
        type: "FETCH_MYPOST",
        payload: mypost,
    }
}

export const FETCH_FOLLOWER = "FETCH_FOLLOWER"
export const fetchFollowerAction = (follower) => {
    return{
        type: "FETCH_FOLLOWER",
        payload: follower,
    }
}

export const FETCH_LIKELIST = "FETCH_LIKELIST"
export const fetchLikelistAction = (likelist) => {
    return{
        type: "FETCH_LIKELIST",
        payload: likelist
    }
}


export const FETCH_FOLLOW = "FETCH_FOLLOW"
export const fetchFollowAction = (follow) => {
    return{
        type: "FETCH_FOLLOW",
        payload: follow,
    }
}


export const SIGN_IN = "SIGN_IN"
export const signInAction = (user) => {
    return{
        type: "SIGN_IN",
        payload: {
            isSignedIn: true,
            username: user.username,
            displayname: user.displayname,
            uid: user.uid
        }
    }
}

export const SIGN_OUT = "SIGN_OUT"
export const signOutAction = () => {
    return {
        type: "SIGN_OUT",
        payload:{
            isSignedIn: false,
            username: "",
            displayname: "",
            uid: ""
        }
    }
}

