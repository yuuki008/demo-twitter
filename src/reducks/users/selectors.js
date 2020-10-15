import {createSelector} from 'reselect';

const usersSelector = (state) => state.users;


export const getIsSignedIn = createSelector(
    [usersSelector],
    state => state.isSignedIn
)

export const getUser = createSelector(
    [usersSelector],
    state => state
)

export const getUsername = createSelector(
    [usersSelector],
    state => state.username
)

export const getDisplayname = createSelector(
    [usersSelector],
    state => state.displayname
)

export const getFollow = createSelector(
    [usersSelector],
    state => state.follow
)

export const getUid = createSelector(
    [usersSelector],
    state => state.uid
)

export const getLikelist = createSelector(
    [usersSelector],
    state => state.likelist
)

export const getFollower = createSelector(
    [usersSelector],
    state => state.follower
)

export const getMypost = createSelector(
    [usersSelector],
    state => state.mypost
)

export const getRooms = createSelector(
    [usersSelector],
    state => state.rooms
)

export const getAvatar = createSelector(
    [usersSelector],
    state => state.avatar
)