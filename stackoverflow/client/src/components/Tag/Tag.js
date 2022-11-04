import React from "react";
import close from '../../images/close.svg'
import './Tag.css'

function Tag({index, tag, deleteTag, showCloseBtn = true}){

    return(
        <div className="tag">{tag}
            {showCloseBtn && <button className="close-btn" onClick={(e) => {e.preventDefault(); deleteTag(index)}}><img src={close} alt="Close"/></button>}
        </div>
    )
}

export default Tag