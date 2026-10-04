import axios from 'axios';

const API_URL = '/api/messages';

export const messageService = {
  getContacts: async () => {
    const res = await axios.get(`${API_URL}/contacts`);
    return res.data;
  },
  
  getConversations: async () => {
    const res = await axios.get(`${API_URL}/conversations`);
    return res.data;
  },
  
  getUnreadCount: async () => {
    const res = await axios.get(`${API_URL}/unread`);
    return res.data;
  },
  
  getThread: async (otherUserId) => {
    const res = await axios.get(`${API_URL}/thread/${otherUserId}`);
    return res.data;
  },
  
  sendMessage: async (receiverId, messageText) => {
    const res = await axios.post(`${API_URL}/send`, { receiverId, messageText });
    return res.data;
  }
};
