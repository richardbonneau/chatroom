import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionID: 0,
      accounts: [],
      inputMessage: "",
      messages: [],
      nickname: undefined,
      inputCreateNickname: "",
      inputCreatePassword: "",
      inputNickname: "",
      inputPassword: ""
    }
  }
  handleSignup = async event => {
    event.preventDefault(); 
    let bod = JSON.stringify([this.state.inputCreateNickname, this.state.inputCreatePassword]);
    let response = await fetch('/signup', {
      method: 'POST',
      body: bod
    });
    let responseBody = await response.text();
    alert("Account created successfully");
    this.setState({inputCreateNickname: "", inputCreatePassword: ""})
  }
  handleLogin = async event => {
    event.preventDefault();
    let bod = JSON.stringify([this.state.inputNickname, this.state.inputPassword]);
    let response = await fetch('/login', {
      method: 'POST',
      body: bod
    })
    let responseBody = await response.text();
    let parsedResponseBody = JSON.parse(responseBody);
    if(parsedResponseBody.username === "ErrorMessage") {
      alert("Account not found\nWrong username and/or password ")
    } else {
      this.setState({nickname: parsedResponseBody.username, sessionID: parsedResponseBody.sessionID})
    }
    this.refreshMessages();
  }
  handleCreateNicknameChange = event => {
    event.preventDefault();
    this.setState({inputCreateNickname: event.target.value})
  }
  handleCreatePasswordChange = event => {
    event.preventDefault();
    this.setState({inputCreatePassword: event.target.value})
  }
  handleNicknameChange = event => {
    event.preventDefault();
    this.setState({inputNickname: event.target.value})
  }
  handlePasswordChange = event => {
    event.preventDefault();
    this.setState({inputPassword: event.target.value})
  }
  refreshMessages = () => {
      setInterval(this.getMessages, 500);
  }


  handleInputChange = event => {
    event.preventDefault();
    this.setState({inputMessage: event.target.value});
  }
  handleMessageSubmit = async event => {
    event.preventDefault();
      let bod = JSON.stringify(
        {
          nickname: this.state.nickname,
          sessionID: this.state.sessionID,
          message: this.state.inputMessage
        }
      );
      let response = await fetch('/submitMessage' , {
        method: 'POST',
        body: bod
      }) 
      let responseBody = await response.text();
      this.setState({inputMessage: ""})
  }
  getMessages = async () => {
    let bod = JSON.stringify(this.state.sessionID);
    let response = await fetch('/getMessages', {
      method: 'POST',
      body: bod
    });
    let responseBody = await response.text();
    let parsedResponseBody = JSON.parse(responseBody);
    this.setState({messages: parsedResponseBody});
  }
  render() {
    return (
      <div className='app' >
        {this.state.nickname === undefined ?
        <div style={{display: 'flex'}} >
        <div style={{width: '35%'}} ></div>
          <div>
          <h2>Create account</h2>
          <h3>Username</h3>
          <form onSubmit={this.handleSignup} >
            <input type='text' value={this.state.inputCreateNickname} onChange={this.handleCreateNicknameChange} />
            <h3>Password</h3>
            <input type='password' value={this.state.inputCreatePassword} onChange={this.handleCreatePasswordChange} />
            <div></div>
            <input type='submit' value='Create Account' />
          </form>
          </div>
          <div style={{width: '5%'}} ></div>
          <div>
          <h2>Log in</h2>
          <h3>Username</h3>
          <form onSubmit={this.handleLogin} >
            <input type='text' value={this.state.inputNickname} onChange={this.handleNicknameChange} />
            <h3>Password</h3>
            <input type='password' value={this.state.inputPassword} onChange={this.handlePasswordChange} />
            <div></div>
            <input type='submit' value='Log In' />
          </form>
          </div>
        </div>
        :
        <div>
          <ul style={{height: '200px'}} >{this.state.messages.map((msg)=> {
          return (<li>{msg.nickname + ": " + msg.message}</li>)
        })}</ul>
        <form onSubmit={this.handleMessageSubmit} >
          <input type='text' value={this.state.inputMessage} onChange={this.handleInputChange} />
          <input type='submit'/>
        </form>
        </div>
        }

      </div>
    );
  }
}

export default App;
