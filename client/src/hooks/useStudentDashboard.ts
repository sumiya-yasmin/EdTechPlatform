import { useQuery } from '@tanstack/react-query';
import { getMyCoursesApi } from '../api/student';


export const useStudentDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-courses'], 
    queryFn: getMyCoursesApi,
    retry: 1, 
  });

  return { 
    enrollments: data || [], 
    isLoading, 
    error 
  };
};