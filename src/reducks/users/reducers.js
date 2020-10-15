import * as Actions from './actions';
import initialState from '../store/initialState';


export const UsersReducer = (state = initialState.users, action) => {
    switch(action.type){
        case Actions.FETCH_ROOMS:
            return{
                ...state,
                rooms: [...action.payload]
            }
        case Actions.FETCH_MYPOST:
            return{
                ...state,
                mypost: [...action.payload]
            }
        case Actions.FETCH_FOLLOWER:
            return{
                ...state,
                follower: [...action.payload]
            }
        case Actions.FETCH_LIKELIST:
            return{
                ...state,
                likelist: [...action.payload]
            }
        case Actions.FETCH_FOLLOW:
            return{
                ...state,
                follow: [...action.payload]
            }
        case Actions.SIGN_IN:
            return{
                ...state,
                ...action.payload
            }
        case Actions.SIGN_OUT:
            return{
                ...action.payload
            }
        default: 
            return state
    }
}