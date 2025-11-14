
import React, { useRef, useState, useCallback } from 'react';
import { SendMessageOptions } from '../types';

interface MessageInputProps {
  onSendMessage: (options: SendMessageOptions) => void;
  isLoading: boolean;
  thinkingMode: boolean;
  onToggleThinkingMode: (enabled: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  thinkingMode,
  onToggleThinkingMode,
}) => {
  const [currentInputText, setCurrentInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    } else {
      setSelectedImage(null);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input value
    }
  }, []);

  const handleSend = useCallback(() => {
    if (isLoading) return;

    if (currentInputText.trim() === '' && !selectedImage) {
      alert("Please enter a message or select an image.");
      return;
    }

    onSendMessage({
      prompt: currentInputText,
      imageFile: selectedImage,
      thinkingMode: thinkingMode,
    });

    setCurrentInputText('');
    handleClearImage(); // Clear image after sending
  }, [currentInputText, selectedImage, onSendMessage, thinkingMode, handleClearImage, isLoading]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in textarea
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="p-4 bg-gray-100 border-t border-gray-300 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 sticky bottom-0 z-10">
      {selectedImage && (
        <div className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-8 h-8 object-cover rounded"
          />
          <span className="text-sm truncate max-w-[100px] sm:max-w-none">{selectedImage.name}</span>
          <button
            onClick={handleClearImage}
            className="text-red-500 hover:text-red-700 text-sm font-bold"
            aria-label="Remove selected image"
          >
            X
          </button>
        </div>
      )}

      <label className="flex items-center cursor-pointer text-sm text-gray-700">
        <input
          type="checkbox"
          checked={thinkingMode}
          onChange={(e) => onToggleThinkingMode(e.target.checked)}
          className="mr-2 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          disabled={isLoading}
        />
        Thinking Mode (Complex Queries)
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm h-10"
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18.274-10.609a3.75 3.75 0 112.503 1.168 3.75 3.75 0 01-2.503-1.168z"
          />
        </svg>
        {selectedImage ? 'Change Image' : 'Upload Image'}
      </button>

      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-10 min-w-[150px]"
        placeholder={selectedImage ? "Add a prompt for the image..." : "Ask your study helper..."}
        value={currentInputText}
        onChange={(e) => setCurrentInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm flex items-center justify-center h-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            Send
          </>
        )}
      </button>
    </div>
  );
};

export default MessageInput;
