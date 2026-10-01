import api from './api.js';

export const feeService = {
  getMyFees: async () => {
    const { data } = await api.get('/fees/view');
    return data;
  },
  getFees: async (params = {}) => {
    const { data } = await api.get('/fees/view', { params });
    return data;
  },
  addFee: async (payload) => {
    const { data } = await api.post('/fees/add-fees', payload);
    return data;
  },
  payFee: async (feeId, paymentMethod) => {
    const { data } = await api.put(`/fees/${feeId}/pay`, { paymentMethod });
    return data;
  },
};

export default feeService;
