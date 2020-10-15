import React from "react";
import "./SideBarOption.css";
import {useDispatch} from 'react-redux';
import {push} from 'connected-react-router';

function SidebarOption({Icon, text, path, active}) {
  const dispatch = useDispatch();
  const selectMenu = (path) => {
    dispatch(push(path))
  }
  return (
    <div 
    className={`sidebarOption ${active && "sidebarOption--active"}`}
    onClick={() => selectMenu(path)} 
    >
      <Icon />
      <h2>{text}</h2>
    </div>
  );
}

export default SidebarOption;
