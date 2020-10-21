import React, {useEffect} from 'react'
import {getPosts} from '../../reducks/posts/selectors';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPosts} from '../../reducks/posts/operations';
import './Home.css'
import Post from '../../components/Post/Post';
import { fetchLikelist } from '../../reducks/users/operations';
import {getUid, getLikelist} from '../../reducks/users/selectors';

const Home = ({handleCommentOpen}) => {
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const posts = getPosts(selector)
    const likes = getLikelist(selector)
    const uid = getUid(selector)
    let matchLike = []
    
    useEffect(() => {
        dispatch(fetchPosts())        
        dispatch(fetchLikelist(uid))
    },[])

    return (
        <div className="home">
            <div className="home__header">
                <h1>ホーム</h1>
            </div>
            {posts.map((post) => {
                likes !== undefined && (
                    matchLike = likes.filter(like => like.postId === post.postId)
                )
            return ( 
                 <Post
                  postId={post.postId}
                  timestamp={post.timestamp}
                  key={post.postId}
                  text={post.text}
                  image={post.image}
                  uid={post.uid}
                  likes={likes}
                  matchLike={matchLike}
                  handleCommentOpen={handleCommentOpen}
                />
                )
            })}  
        </div>
    )
}

export default Home
