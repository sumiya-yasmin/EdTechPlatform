import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { Calendar } from 'lucide-react';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    thumbnail: string;
    instructor: string;
    category?: string;
    level?: string;
    price?: number;
    description?: string;
    batches?: { 
      title: string; 
      startDate: string; 
    }[];
  };
  progress?: number;
  badges?: React.ReactNode;
  footer: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function CourseCard({ 
  course, 
  progress, 
  badges, 
  footer, 
  onClick,
  className 
}: CourseCardProps) {
  
  const nextBatch = course.batches && course.batches.length > 0 ? course.batches[0] : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card 
      className={`flex flex-col hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden group ${className}`}
      onClick={onClick}
    >
      <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
        <img 
           src={course.thumbnail || 'https://via.placeholder.com/400x200'} 
           alt={course.title} 
           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
           {course.level && (
             <Badge className="bg-white/90 text-black backdrop-blur-sm shadow-sm hover:bg-white">
               {course.level}
             </Badge>
           )}
           {course.price !== undefined && (
             <Badge className="bg-blue-600 text-white shadow-sm border-0">
               ${course.price}
             </Badge>
           )}
        </div>

        {badges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges}
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            {course.category && (
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                {course.category}
              </p>
            )}
            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </CardTitle>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 font-medium">By {course.instructor}</p>
          
    
          {nextBatch && (
             <div className="flex items-center text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                <Calendar className="w-3 h-3 mr-1" />
                <span className="font-bold mr-2">{nextBatch.title}:</span>
                {formatDate(nextBatch.startDate)}
             </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        {progress !== undefined ? (
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2 gap-2">
        {footer}
      </CardFooter>
    </Card>
  );
}