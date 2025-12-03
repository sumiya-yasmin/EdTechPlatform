'use client';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useStudentDashboard } from '@/src/hooks/useStudentDashboard';
import { Progress } from '@/src/components/ui/progress';

export default function StudentDashboard() {
  const { enrollments, isLoading } = useStudentDashboard();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-500">Welcome back! Continue where you left off.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">You haven't enrolled in any courses yet.</h2>
          <Button onClick={() => router.push('/')}>Browse Courses</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment._id} className="flex flex-col">
              <div className="h-48 w-full bg-gray-200 relative overflow-hidden rounded-t-lg">
                <img 
                  src={enrollment.course.thumbnail || 'https://via.placeholder.com/400x200'} 
                  alt={enrollment.course.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-1">{enrollment.course.title}</CardTitle>
                <p className="text-sm text-gray-500">Instr: {enrollment.course.instructor}</p>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-bold">{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => router.push(`/course/${enrollment.course._id}`)}
                >
                  {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}