import api from './api.js';

export const feeService = {
  getMyFees: async () => {
    const { data } = await api.get('/fees/view');
    return data;
  },
};

export default feeService;
