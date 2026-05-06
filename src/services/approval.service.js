const getStoredContent = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('mock_content_db');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

const setStoredContent = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_content_db', JSON.stringify(data));
  }
};

export const approvalService = {
  getAllContent: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: getStoredContent() });
      }, 800);
    });
  },

  getPendingContent: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contents = getStoredContent();
        resolve({ success: true, data: contents.filter(c => c.status === 'Pending') });
      }, 800);
    });
  },

  approveContent: async (contentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contents = getStoredContent();
        const index = contents.findIndex(c => c.id === contentId);
        
        if (index !== -1) {
          contents[index].status = 'Approved';
          contents[index].rejectionReason = null;
          setStoredContent(contents);
          resolve({ success: true, data: contents[index] });
        } else {
          resolve({ success: false, error: 'Content not found' });
        }
      }, 800);
    });
  },

  rejectContent: async (contentId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contents = getStoredContent();
        const index = contents.findIndex(c => c.id === contentId);
        
        if (index !== -1) {
          contents[index].status = 'Rejected';
          contents[index].rejectionReason = reason;
          setStoredContent(contents);
          resolve({ success: true, data: contents[index] });
        } else {
          resolve({ success: false, error: 'Content not found' });
        }
      }, 800);
    });
  }
};
