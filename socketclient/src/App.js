import React, { Component } from 'react'
import Chat from './Chat'
import ChannelBar from './ChannelBar'
import io from 'socket.io-client'
import './App.css'
const socket = io('http://localhost:8080')

class App extends Component {
  state = {
      user: '',
      loggedIn: false,
      socket: {},
      messages: [
        { author: 'Admin', message: 'Welcome to BrainStation chat! Please be civil.' }
      ],
      channels: []
    }

  componentDidMount() {
    socket.connect()
    socket.on('connect', ()=>{
      this.setState({
        socket: socket
      })
		  socket.emit('adduser', prompt("What's your name?"))
	  })

    socket.on('client:joinchat', (username, data)=>{
      this.setState({
        user: username,
        messages: [{ author: 'Admin', message: `Welcome to ${data}! Please be civil.` }]
      })
      console.log(username, data)
    })

    socket.on('updatechat', (username, data)=>{
      this.setState({
        messages: this.state.messages.concat({author: username, message:data})
      })
    })

    socket.on('client:channelerror', (user,data)=>{
      this.setState({
        messages: this.state.messages.concat({author:user, message:data})
      })
    })

    socket.on('updaterooms', (rooms, current_room)=>{
      console.log(rooms, current_room)
      this.setState(prevState=>prevState.channels = rooms)
    })
  }

  submitChat = e =>{
    e.preventDefault()
    const dataToSend = {
      author: this.state.user,
      message: this.refs.chatText.value
    }
    socket.emit('sendchat', this.refs.chatText.value)
    this.refs.chatText.value = ''
  }

  changeRoom = val =>{
    socket.emit('switchRoom', val)
  }

  submitUser = () => {
    const user = this.refs.username.value
    socket.emit('client:newuser', { author: this.refs.username.value, message: 'has connected to the chat!' })
    this.setState({
      loggedIn: true,
      user: this.refs.username.value !== '' ? this.refs.username.value : 'BrainStation Student'
    })
  }

  addRoom = e =>{
    e.preventDefault()
    console.log('Trying to add room', this.refs.addRoom.value)
    socket.emit('addroom', {roomname: this.refs.addRoom.value})
    this.refs.addRoom.value = ''
  }

  render() {
    return (
      <div className="App">
        <h1> Welcome to BrainStation Chat! </h1>
        <ChannelBar changeChannel={this.changeRoom} channels={this.state.channels}/>
        <Chat messages={this.state.messages} />
        <form className="chatbox" onSubmit={this.submitChat}>
          <input ref="chatText" type="text" placeholder="Talk to the class!" />
        </form>
        <form className='login' onSubmit={this.addRoom}>
          <input ref='addRoom' type='text' placeholder='Add a new room to the list!'/>
        </form>
      </div>
    );
  }
}

export default App