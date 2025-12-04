import apiClient from "./axios";


export interface SubmissionPayload {
  courseId: string;
  type: 'assignment' | 'quiz';
  content?: string;
  score?: number;
}

export const submitAssignmentApi = async (data: SubmissionPayload) => {
  const response = await apiClient.post('/submissions', data);
  return response.data;
};

export const getAllSubmissionsApi = async () => {
  const response = await apiClient.get('/submissions');
  return response.data;
};