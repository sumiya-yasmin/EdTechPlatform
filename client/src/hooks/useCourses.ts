import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCoursesApi, enrollCourseApi, getCourseByIdApi } from '../api/course';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CourseParams } from '../types/course';


export const useCourses = (params?: CourseParams) => {
  return useQuery({
    queryKey: ['courses', params], 
    queryFn: () => getAllCoursesApi(params),
  });
};

export const useCourse = (id: string | null) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseByIdApi(id!),
    enabled: !!id, 
  });
};


export const useEnroll = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollCourseApi,
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      router.push('/student/dashboard');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Enrollment failed';
      
      if (msg.includes('Not authorized') || error.response?.status === 401) {
        toast.error('Please login to enroll');
        router.push('/login');
      } else {
        toast.error(msg);
      }
    },
  });
};