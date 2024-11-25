import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file for styling

const App = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // New state for typing effect

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }

    setMessages(prevMessages => [
      ...prevMessages,
      { text: question, fromUser: true }
    ]);
    setQuestion('');

    setIsTyping(true); // Start typing animation

    try {
      const response = await axios.post('http://localhost:5000/ask', { question });
      const answer = response.data.answer.text;

      // Simulate typing effect
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: answer, fromUser: false }
        ]);
        setIsTyping(false); // End typing animation
      }, 1500); // Adjust the delay as needed
    } catch (error) {
      console.error('Error asking question: ', error);
      setIsTyping(false); // End typing animation on error
    }
  };

  return (
    <div className="app-container">
      <div className="upload-container">
        <input type="file" onChange={handleFileUpload} />
        <button onClick={uploadFile}>Upload PDF</button>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.fromUser ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message bot typing">
              <span className="typing-dots">...</span>
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={askQuestion}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
