import React, { useContext, useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/context'

const Sidebar = () => {

  const [extended,setExtended] = useState(false)
  const {onSent,prevPrompts,setRecentPrompt,newChat,deletePrompt,clearAllPrompts,onSelectHistory} = useContext(Context)

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)
    await onSent(prompt)
  }
  return (
    <div className="sidebar">
        <div className="top">
          <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="" />
          <div onClick={()=>{
            newChat();
            setExtended(true);
          }}className="new-chat">
            <img src={assets.plus_icon} alt="" />
            {extended?<p>New chat</p>:null}
          </div>
          {extended
          ?<div className="recent">
            <p className="recent-title">Recent</p>

            {prevPrompts.length>0 && (
              <p
                onClick={clearAllPrompts}
                style={{
                  fontSize: "15px",
                  color: "#999",
                  cursor: "pointer",
                  marginBottom: "5px",
                  marginLeft: "8px"
                }}
              >
                Clear All
              </p>
            )}
            {prevPrompts.map((item, index) => (
              <div key={index} className="recent-entry">
                <div
                  onClick={() => loadPrompt(item)}
                  style={{ display: 'flex', alignItems: 'center', flex: 1, gap: "6px" }}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)}...</p>
                </div>

                <img
                  src={assets.close_icon} 
                  alt="delete"
                  className= "close-icon"
                  onClick={() => deletePrompt(index)}
                  
                />
              </div>
            ))}
          </div>
         : null}
      </div>

        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended?<p>Help</p>:null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" />
            {extended?<p>Activity</p>:null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {extended?<p>Settings</p>:null}
          </div>
        </div>
        
    </div>
  )
}

export default Sidebar