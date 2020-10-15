import React from 'react'

const ImagePreview = (props) => {
    return (
        <div className="imagepreview" onClick={() => props.delete(props.id)}>
            <img alt="tweetImage" src={props.path}/>
        </div>
    )
}

export default ImagePreview