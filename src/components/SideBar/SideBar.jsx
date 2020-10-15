import React from "react";
import "./SideBar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SideBarOption/SideBarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button, IconButton } from "@material-ui/core";
import {useDispatch} from 'react-redux';
import {push} from 'connected-react-router';

function Sidebar({handleTweetOpen}) {
  const dispatch = useDispatch()

  
  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />

      <SidebarOption active Icon={HomeIcon} text="Home" path='/home' />
      <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" path='/messages' />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" path='/profile'/>
      <SidebarOption Icon={MoreHorizIcon} text="More" />

      {/* Button -> Tweet */}
      <Button 
          onClick={() => handleTweetOpen()}
          ariant="outlined" 
          className="sidebar__tweet" 
          fullWidth
        >
        Tweet
      </Button>
    </div>
  );
}

export default Sidebar;
