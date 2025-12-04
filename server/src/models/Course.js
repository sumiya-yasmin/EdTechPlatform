import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 }, 
  isFree: { type: Boolean, default: false } 
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  instructor: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  thumbnail: { 
    type: String, 
    required: true 
  }, 
  tags: [String], 
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  quiz: [questionSchema],
  assignment: {
    title: { type: String, default: 'Final Project' },
    instructions: { type: String, default: 'Upload your Google Drive link below.' },
    totalPoints: { type: Number, default: 100 }
  },
  batches: [{
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    enrollmentClosed: { type: Boolean, default: false }
  }],
  syllabus: [lessonSchema], 
  
  studentsEnrolled: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });


courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Course', courseSchema);