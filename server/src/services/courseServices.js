import Course from '../models/Course.js';

export const createCourseService = async (courseData) => {
  const course = await Course.create(courseData);
  return course;
};

export const getAllCoursesService = async (query) => {
  const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = query;

  const dbQuery = {};

  if (search) {
    dbQuery.$text = { $search: search };
  }

  if (category && category !== 'All') {
    dbQuery.category = category;
  }

  if (minPrice || maxPrice) {
    dbQuery.price = {};
    if (minPrice) dbQuery.price.$gte = Number(minPrice);
    if (maxPrice) dbQuery.price.$lte = Number(maxPrice);
  }

  let sortOption = {};
  if (sort === 'price_asc') sortOption.price = 1;      
  if (sort === 'price_desc') sortOption.price = -1;    
  if (sort === 'popular') sortOption.studentsEnrolled = -1; 
  if (!sort) sortOption.createdAt = -1;            


  const skip = (Number(page) - 1) * Number(limit);

  const courses = await Course.find(dbQuery)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .select('-syllabus'); 

  const total = await Course.countDocuments(dbQuery);

  return {
    courses,
    pagination: {
      totalCourses: total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    },
  };
};

export const getCourseByIdService = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new Error('Course not found');
  return course;
};