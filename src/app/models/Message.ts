export interface Message {
  id?: number;
  chatId?: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: Date;
}
