const initialState = {
    users:{
        isSignedIn: false,
        username: "",
        displayname: "",
        uid: "",
        likelist: [],
        follow: [],
        follower: [],
        mypost: [],
        rooms: [],
        avatar: "",
    },
    posts:{
        list: [],
    }
}

export default initialState