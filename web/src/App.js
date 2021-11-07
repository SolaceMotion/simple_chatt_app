import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

//'socket' is the name of the socket.io object
//'http://localhost:4000' is the url of the server
//'ws://localhost:4000' is the url of the server
const socket = io('ws://localhost:4000');

function App() {
  const [state, setState] = useState({
    message: '',
    name: '',
  });

  //All messages
  const [chat, setChat] = useState([]);

  useEffect(() => {
    //Fetch all messages from server
    socket.on('message', ({ name, message }) => {
      //Add new message to chat and spread the old chats
      setChat([...chat, { name, message }]);
    });
    //Unmount
    return () => socket.disconnect();
  }, [chat]);

  //e.target.name works here because each input field has a name attribute with a corresponding name found in the state object.
  const onTextChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = e => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit('message', {
      name,
      message,
    });
    setState({
      ...state,
      message: '',
    });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messanger</h1>
        <div className="name-field">
          <input type="text" name="name" placeholder="Name" value={state.name} onChange={e => onTextChange(e)} />
        </div>
        <div>
          <input type="text" name="message" placeholder="Message" value={state.message} onChange={e => onTextChange(e)} />
        </div>
        <input type="submit" value="Send Message" />
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
