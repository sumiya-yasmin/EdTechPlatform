"use client";

import { useState } from "react";
import Navbar from "@/src/components/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useGetAllSubmission } from "@/src/hooks/useSubmission";
import { useCourses } from "@/src/hooks/useCourses";
import {
  FileText,
  User,
  Calendar,
  BookOpen,
  ArrowLeft,
  Filter,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { data: submissions, isLoading: isLoadingSubs } = useGetAllSubmission();
  const { data: coursesData } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState("all");

  const filteredSubmissions =
    submissions?.filter((sub: any) => {
      if (selectedCourse === "all") return true;
      return sub.course?._id === selectedCourse;
    }) || [];

  const renderSubmissionGrid = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            No submissions found
          </h3>
          <p className="text-gray-500">
            {selectedCourse === "all"
              ? "There are no items in this category yet."
              : "No submissions for this specific course."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((sub: any) => {
          const isQuiz = sub.type === "quiz";

          return (
            <Card
              key={sub._id}
              className={`flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 border-t-4 ${
                isQuiz ? "border-t-purple-500" : "border-t-blue-500"
              }`}
            >
              <CardHeader className="bg-gray-50/50 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-gray-500 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {sub.student?.name || "Unknown"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {sub.student?.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={isQuiz ? "secondary" : "default"}
                    className={
                      isQuiz
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }
                  >
                    {isQuiz ? "QUIZ" : "ASSIGNMENT"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 grow">
                <div className="mb-4">
                  <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    <BookOpen className="w-3 h-3 mr-1" /> Course
                  </div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {sub.course?.title}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {isQuiz ? "Score" : "Submission Content"}
                  </div>

                  {isQuiz ? (
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-4xl font-bold ${
                          sub.score >= 50 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {sub.score}%
                      </span>
                      <Badge
                        variant={sub.score >= 50 ? "outline" : "destructive"}
                        className="h-6"
                      >
                        {sub.score >= 50 ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 font-mono break-all relative group max-h-32 overflow-y-auto">
                      {sub.content}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50/50 py-3 border-t">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(sub.createdAt).toLocaleDateString()} at{" "}
                  {new Date(sub.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchTerm="" onSearchChange={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Submissions
              </h1>
              <p className="text-gray-500">
                Review assignments and quiz results.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
            <TabsList className="grid w-full md:w-auto grid-cols-3 h-10">
              <TabsTrigger value="all" className="px-6">
                All
              </TabsTrigger>
              <TabsTrigger value="assignments" className="px-6">
                Assignments
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="px-6">
                Quizzes
              </TabsTrigger>
            </TabsList>

            {/* COURSE FILTER */}
            <div className="w-full md:w-64 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer appearance-none"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {coursesData?.courses.map((course: any) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingSubs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <>
              <TabsContent
                value="all"
                className="mt-0 animate-in fade-in-50 duration-500"
              >
                {renderSubmissionGrid(filteredSubmissions)}
              </TabsContent>

              <TabsContent
                value="assignments"
                className="mt-0 animate-in fade-in-50 duration-500"
              >
                {renderSubmissionGrid(
                  filteredSubmissions.filter(
                    (s: any) => s.type === "assignment"
                  )
                )}
              </TabsContent>

              <TabsContent
                value="quizzes"
                className="mt-0 animate-in fade-in-50 duration-500"
              >
                {renderSubmissionGrid(
                  filteredSubmissions.filter((s: any) => s.type === "quiz")
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
