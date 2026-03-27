import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const slugify = text =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

const getCourseSlug = course => {
    if (!course) return '#';
    if (course.slug) return course.slug;
    return slugify(course.title || 'course');
};

export default function CourseGrid({ courses = [], variant = 'pro' }) {
    return (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3 lg:gap-[18px]">
            {courses.map((course, i) => (
                <Link key={course._id || i} to={`/courses/${getCourseSlug(course)}`}>
                    <CourseCard
                        title={course.title}
                        image={course.image}
                        teacher={course.teacher}
                        lessons={course.lessons}
                        duration={course.duration}
                        price={course.price}
                        originalPrice={course.originalPrice}
                        variant={variant}
                    />
                </Link>
            ))}
        </div>
    );
}
