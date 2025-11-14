
import React, { useState, useCallback, useRef } from 'react';
import { ChatMessage, Sender, MessageType, SendMessageOptions } from './types';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thinkingMode, setThinkingMode] = useState<boolean>(false); // State for "Thinking Mode"
  const messageIdCounter = useRef<number>(0);

  const handleSendMessage = useCallback(async (options: SendMessageOptions) => {
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: `user-${messageIdCounter.current++}`,
      sender: Sender.User,
      type: options.imageFile ? MessageType.Image : MessageType.Text,
      text: options.prompt,
      imageUrl: options.imageFile ? URL.createObjectURL(options.imageFile) : undefined,
      imageMimeType: options.imageFile ? options.imageFile.type : undefined,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const aiResponseText = await sendMessageToGemini(options);

      const aiMessage: ChatMessage = {
        id: `ai-${messageIdCounter.current++}`,
        sender: Sender.AI,
        type: MessageType.Text,
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: ChatMessage = {
        id: `error-${messageIdCounter.current++}`,
        sender: Sender.AI,
        type: MessageType.Text,
        text: `Error: Failed to get a response. Please try again. (${error instanceof Error ? error.message : String(error)})`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleThinkingMode = useCallback((enabled: boolean) => {
    setThinkingMode(enabled);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <header className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg shadow-md">
        <h1 className="text-xl md:text-2xl font-bold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.079 0-2.157.068-3.225.166a4.125 4.125 0 00-1.12 8.67 4.125 4.125 0 00-1.12 8.67c.321.045.65.071.985.071A8.967 8.967 0 0018 18.042m-12 0L6 7.5V3.75m0 14.292c1.079 0 2.157-.068 3.225-.166a4.125 4.125 0 001.12-8.67 4.125 4.125 0 001.12-8.67c-.321-.045-.65-.071-.985-.071A8.967 8.967 0 006 6.042m0 12h.008v.008H6v-.008zm0 0L3 18.75m10.5-3.625a4.125 4.125 0 00-1.12 8.67A4.125 4.125 0 0012 21.75c1.079 0 2.157-.068 3.225-.166a4.125 4.125 0 001.12-8.67 4.125 4.125 0 00-1.12-8.67c-.321-.045-.65-.071-.985-.071A8.967 8.967 0 0012 6.042m0 0V3.75m0 14.292c-1.079 0-2.157-.068-3.225-.166a4.125 4.125 0 00-1.12 8.67A4.125 4.125 0 0012 21.75c1.079 0 2.157-.068 3.225-.166a4.125 4.125 0 001.12-8.67 4.125 4.125 0 00-1.12-8.67c-.321-.045-.65-.071-.985-.071A8.967 8.967 0 0012 6.042"
            />
          </svg>
          AI Study Helper
        </h1>
      </header>

      <ChatContainer messages={messages} isLoading={isLoading} />

      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        thinkingMode={thinkingMode}
        onToggleThinkingMode={handleToggleThinkingMode}
      />
    </div>
  );
};

export default App;
