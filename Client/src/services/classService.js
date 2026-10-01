import api from './api.js';

export const classService = {
  getClasses: async () => {
    const { data } = await api.get('/classes');
    return data.classes;
  },

  getTeachers: async () => {
    const { data } = await api.get('/classes/teachers');
    return data.teachers;
  },

  createClass: async (payload) => {
    const { data } = await api.post('/classes/create-class', payload);
    return data.data;
  },

  getStudents: async (classId) => {
    const { data } = await api.get('/classes/students', { params: { classId } });
    return data.students;
  },

  getUnassignedStudents: async () => {
    const { data } = await api.get('/classes/unassigned-students');
    return data.students;
  },

  enrollStudent: async (classId, studentId) => {
    const { data } = await api.put(`/classes/${classId}/students/${studentId}`);
    return data;
  },

  addStudent: async (classId, payload) => {
    const { data } = await api.post(`/classes/${classId}/students`, payload);
    return data;
  },
};

export default classService;