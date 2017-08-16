import React, {Component} from 'react'
import Channel from './Channel'
import './App.css'

class ChannelBar extends Component{
    render(){
        const channelList = this.props.channels.map(el=>{
            return <Channel name={el} changeChannel={this.props.changeChannel} />
        })
        return(
            <div style={{float:'right'}}>
                {channelList}
            </div>
        )
    }
}

export default ChannelBar