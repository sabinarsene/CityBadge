import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Authorization`,
          },
        }
      );

      const botReply = response.data.choices[0].message.content.trim();
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        <div style={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#0078D7' : '#e0e0e0',
                color: msg.sender === 'user' ? '#fff' : '#000',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
    chatContainer: {
      position: 'fixed',
      bottom: '140px',
      right: '20px',
      width: '300px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000,
    },
    chatBox: {
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      overflow: 'hidden',
    },
    chatMessages: {
      flex: 1,
      padding: '10px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    message: {
      padding: '8px 12px',
      borderRadius: '15px',
      maxWidth: '80%',
    },
    inputContainer: {
      display: 'flex',
      borderTop: '1px solid #e0e0e0',
    },
    input: {
      flex: 1,
      border: 'none',
      padding: '10px',
      outline: 'none',
      fontSize: '16px',
    },
    sendButton: {
      backgroundColor: '#0078D7',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '16px',
    },
  };

export default Chatbot;