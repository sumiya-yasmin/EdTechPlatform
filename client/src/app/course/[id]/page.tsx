'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourse, useEnroll } from '@/src/hooks/useCourses';
import { useStudentDashboard } from '@/src/hooks/useStudentDashboard';
import Navbar from '@/src/components/Navbar';

import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Lock, PlayCircle, Clock, Edit } from 'lucide-react'; 
import toast from 'react-hot-toast';
import { Lesson } from '@/src/types/course';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course, isLoading } = useCourse(courseId);
  const { enrollments } = useStudentDashboard();
  const { mutate: enroll, isPending: isEnrolling } = useEnroll();

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') setIsAdmin(true);
    }
  }, []);

  const isEnrolled = enrollments?.some((e) => e.course._id === courseId);
  const enrollment = enrollments?.find((e) => e.course._id === courseId);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!isEnrolled && !lesson.isFree && !isAdmin) {
      toast.error('Enroll to watch this lesson!');
      return;
    }
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !course) {
    return <div className="flex h-screen justify-center items-center">Loading Course...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchTerm="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative group">
              {activeLesson ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}?autoplay=1`} 
                  title={activeLesson.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      size="lg" 
                      className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-sm border-2 border-white"
                      onClick={() => {
                        if (course.syllabus && course.syllabus.length > 0) {
                            handleLessonClick(course.syllabus[0]);
                        }
                      }}
                    >
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-500 mb-4">Instructor: {course.instructor}</p>
              
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-2">About this course</h3>
                <p>{course.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {isAdmin ? 'Admin Controls' : (isEnrolled ? 'Course Progress' : `$${course.price}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  /* ADMIN VIEW */
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
                      You are viewing this course as an Admin. <br/>
                      You have full access to watch videos.
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => router.push(`/admin/create-course?edit=${courseId}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit Course Content
                    </Button>
                  </div>
                ) : isEnrolled ? (
                  /* ENROLLED STUDENT VIEW */
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{enrollment?.progress || 0}% Completed</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${enrollment?.progress || 0}%` }}></div>
                    </div>
                    <Button className="w-full bg-blue-600" onClick={() => {
                       if (course.syllabus && course.syllabus.length > 0) handleLessonClick(course.syllabus[0]);
                    }}>
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg" 
                      onClick={() => enroll(courseId)}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                    <p className="text-xs text-center text-gray-500">30-Day Money-Back Guarantee</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Syllabus ({course.syllabus?.length || 0} Lessons)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {course.syllabus?.map((lesson, index) => {
                    const isLocked = !isEnrolled && !lesson.isFree && !isAdmin;
                    const isActive = activeLesson?._id === lesson._id;

                    return (
                      <div 
                        key={lesson._id || index}
                        onClick={() => handleLessonClick(lesson)}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                      >
                        <div className="flex-shrink-0 text-gray-400">
                          {isLocked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <PlayCircle className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs text-gray-500 flex items-center">
                               <Clock className="w-3 h-3 mr-1" /> {lesson.duration || 10} min
                             </span>
                             {lesson.isFree && !isEnrolled && !isAdmin && (
                               <Badge variant="secondary" className="text-[10px] h-4">Preview</Badge>
                             )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}