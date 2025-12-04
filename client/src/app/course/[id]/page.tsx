'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCourseDetails } from '@/src/hooks/useCourseDetails';
import Navbar from '@/src/components/Navbar';
import Quiz, { QuizQuestion } from '@/src/components/Quiz';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Textarea } from '@/src/components/ui/textarea';
import { Lock, PlayCircle, Edit, CheckCircle, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const {
    course,
    isLoading,
    isEnrolled,
    enrollment,
    isAdmin,
    activeLesson,
    assignmentText,
    isEnrolling,
    isMarking,
    isSubmitting,
    setAssignmentText,
    enroll,
    markComplete,
    handleLessonClick,
    handleAssignmentSubmit,
    handleQuizComplete,
    getYouTubeId,
    isLessonCompleted,
  } = useCourseDetails(courseId);
  
  if (isLoading || !course) return <div className="flex h-screen justify-center items-center">Loading...</div>;
  const quizQuestions: QuizQuestion[] = (course as any).quiz || []; 
  const assignmentConfig = (course as any).assignment || { 
    title: 'Final Assignment', 
    instructions: 'Paste your Google Drive link or write your answer below.' 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchTerm="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative group">
              {activeLesson ? (
                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}?autoplay=1`} 
                  title={activeLesson.title} frameBorder="0" allowFullScreen
                ></iframe>
              ) : (
                <div className="relative w-full h-full">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-sm border-2 border-white"
                      onClick={() => { if (course.syllabus?.length > 0) handleLessonClick(course.syllabus[0]); }}
                    >
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="info">Course Info</TabsTrigger>
                <TabsTrigger value="assignment" disabled={!isEnrolled && !isAdmin}>Assignment</TabsTrigger>
                <TabsTrigger value="quiz" disabled={!isEnrolled && !isAdmin}>Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-500 mb-4">Instructor: {course.instructor}</p>
                    <p className="text-gray-700">{course.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignment" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600"/>
                        {assignmentConfig.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Instructions Section */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-1">Instructions:</h4>
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">
                            {assignmentConfig.instructions}
                        </p>
                    </div>

                    {/* Submission Form (Hidden for Admins) */}
                    {!isAdmin ? (
                        <div className="space-y-4">
                            <Textarea 
                                value={assignmentText}
                                onChange={(e) => setAssignmentText(e.target.value)}
                                placeholder="Write your answer or paste a link here..." 
                                rows={5}
                            />
                            <Button onClick={handleAssignmentSubmit} disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-100 text-gray-500 text-center rounded border border-dashed">
                            Admin Mode: You cannot submit assignments.
                        </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QUIZ TAB */}
              <TabsContent value="quiz" className="mt-4">
                <Quiz 
                    questions={quizQuestions} 
                    onComplete={handleQuizComplete} 
                    isReadOnly={isAdmin} // Pass the flag
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {isAdmin ? 'Admin' : (isEnrolled ? 'Progress' : `$${course.price}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <Button className="w-full" variant="outline" onClick={() => router.push(`/admin/create-course?edit=${courseId}`)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Content
                  </Button>
                ) : isEnrolled ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm"><span>{enrollment?.progress || 0}%</span></div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${enrollment?.progress || 0}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => enroll(courseId)} disabled={isEnrolling}>
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Syllabus</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {course.syllabus?.map((lesson: any, index: number) => {
                    const isLocked = !isEnrolled && !lesson.isFree && !isAdmin;
                    const isActive = activeLesson?._id === lesson._id;
                    const isCompleted = isLessonCompleted(lesson._id);
                    return (
                      <div key={lesson._id || index} onClick={() => handleLessonClick(lesson)}
                        className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                      >
                        <div className="shrink-0 text-gray-400">
                          {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500"/> : isLocked ? <Lock className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                        </div>
                        <p className="text-sm font-medium">{lesson.title}</p>
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