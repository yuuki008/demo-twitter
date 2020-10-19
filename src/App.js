import React, {useState} from 'react';
import './App.css';
import {Redirect, Route, Switch} from 'react-router';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Reset from './pages/auth/Reset';
import Auth from './Auth';
import Home from './pages/Home/Home';
import SideBar from './components/SideBar/SideBar'
import Tweet from './components/Tweet/Tweet';
import CommentModal from './components/CommentModal/CommentModal'
import Profile from './pages/Profile/Profile'
import DirectMessage from './pages/DirectMessage/DirectMessage';
import Messages from './pages/Messages/Messages';



function App() {
  const [tweetOpen, setTweetOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)

  const handleTweetOpen = () => {
    setTweetOpen(true);
  }

  const handleTweetClose = () => {
    setTweetOpen(false)
  }

  const handleCommentOpen = () => {
    setCommentOpen(true)
  }

  const handleCommentClose = () => {
    setCommentOpen(false)
  }

  return (
    <div className="app">
      <Switch>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/signin" component={SignIn}/>
        <Route exact path="/reset" component={Reset}/>
        <Auth>
          <Tweet open={tweetOpen} handleClose={handleTweetClose} />
          <CommentModal open={commentOpen} handleClose={handleCommentClose} />
          <SideBar handleTweetOpen={handleTweetOpen}/>
          <Route exact path="/">
            <Redirect to={"/home"}/>
          </Route>
          <Route path="/home(/:id)?">
            <Home  handleCommentOpen={handleCommentOpen}/>
          </Route>
          <Route path="/profile(/:id)?" >
            <Profile handleCommentOpen={handleCommentOpen} />
          </Route>
          <Route path="/direct(/:id)?" >
            <DirectMessage />
          </Route>
          <Route path="/messages" >
            <Messages />
          </Route>
        </Auth>
      </Switch>
    </div>
  );
}

export default App;
