
export enum Sender {
  User = 'user',
  AI = 'ai',
}

export enum MessageType {
  Text = 'text',
  Image = 'image',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  imageMimeType?: string;
  timestamp: Date;
}

export interface SendMessageOptions {
  prompt: string;
  imageFile?: File | null;
  thinkingMode: boolean;
}
