export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  category: string;
  thumbnail: string;
  level: string;
  tags: string[];
}

export interface CourseResponse {
  courses: Course[];
  pagination: {
    totalCourses: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface CourseParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}