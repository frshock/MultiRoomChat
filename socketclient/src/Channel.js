import React from 'react'

function Channel(props){
    return (
        <div>
            <span onClick={()=>props.changeChannel(props.name)}>{props.name}</span>
        </div>
    )
}

export default Channel