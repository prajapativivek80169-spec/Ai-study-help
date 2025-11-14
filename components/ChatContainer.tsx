
import React, { useEffect, useRef } from 'react';
import { ChatMessage, Sender, MessageType } from '../types';
import MarkdownRenderer from './MarkdownRenderer'; // Import the MarkdownRenderer

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll whenever messages or loading state changes

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === Sender.User ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] md:max-w-[50%] p-3 rounded-lg shadow-md ${
              message.sender === Sender.User
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {message.type === MessageType.Text && message.text && (
              <MarkdownRenderer content={message.text} />
            )}
            {message.type === MessageType.Image && message.imageUrl && (
              <div className="flex flex-col items-center">
                <img
                  src={message.imageUrl}
                  alt="User uploaded"
                  className="max-w-full h-auto rounded-md mb-2 object-contain"
                  style={{ maxHeight: '200px' }}
                />
                {message.text && (
                  <p className="text-sm mt-1">{message.text}</p>
                )}
              </div>
            )}
            <p className="text-xs mt-1 opacity-75 text-right">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 p-3 rounded-lg shadow-md max-w-[70%] md:max-w-[50%]">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
            <p className="text-xs mt-1 opacity-75 text-right">Thinking...</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
