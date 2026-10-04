import axios from 'axios';

const API_URL = '/api/notices';

export const noticeService = {
  getUnreadCount: async (department, batch) => {
    let url = department ? `${API_URL}/unread?department=${department}` : `${API_URL}/unread?`;
    if (batch) {
      url += (url.includes('?') && !url.endsWith('?') ? '&' : '') + `batch=${batch}`;
    }
    const res = await axios.get(url);
    return res.data;
  }
};
