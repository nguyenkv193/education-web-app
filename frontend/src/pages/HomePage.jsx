import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import CourseGrid from '../components/CourseGrid';
import PostCard from '../components/PostCard';
import VideoCard from '../components/VideoCard';
import HeroCarousel from '../components/HeroCarousel';
import courseService from '../services/courseService';
import blogService from '../services/blogService';

function FeaturedPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const res = await blogService.getPopular(8);
                const data = res.data?.data || [];

                if (!mounted) return;
                const mapped = data.map(b => ({
                    title: b.title,
                    image: b.image || `https://picsum.photos/seed/post-${b._id}/600/300`,
                    author:
                        typeof b.author === 'string' ? b.author : b.author?.fullName || 'Tác giả',
                    meta: `${b.views || 0} lượt xem`,
                    id: b._id,
                }));
                setPosts(mapped);
            } catch (err) {
                console.error('Error fetching popular posts', err);
            }
        };
        fetch();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
            {posts.length > 0
                ? posts.map((p, i) => (
                      <PostCard
                          key={p.id || i}
                          title={p.title}
                          image={p.image}
                          author={p.author}
                          meta={p.meta}
                          id={p.id}
                      />
                  ))
                : // fallback skeleton
                  Array.from({ length: 6 }).map((_, i) => (
                      <PostCard
                          key={i}
                          title={`Bài viết nổi bật #${i + 1}`}
                          image={`https://picsum.photos/seed/post-${i}/600/300`}
                          author={i % 2 ? 'Sơn Đặng' : 'Dương Vương'}
                          meta={`${(i + 1) * 2} phút đọc`}
                      />
                  ))}
        </div>
    );
}

const formatCourses = (courses = [], isFreeSection = false) => {
    return courses.map(course => ({
        ...course,
        price: isFreeSection || course.isFree ? null : course.price,
        originalPrice: isFreeSection || course.isFree ? null : course.originalPrice,
    }));
};

export default function HomePage() {
    const [proCourses, setProCourses] = useState([]);
    const [freeCourses, setFreeCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError('');
                const [proRes, freeRes] = await Promise.all([
                    courseService.getProCourses(5),
                    courseService.getFreeCourses(6),
                ]);
                setProCourses(formatCourses(proRes?.courses || [], false));
                setFreeCourses(formatCourses(freeRes?.courses || [], true));
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen w-full">
            {/* Hero Carousel */}
            <section className="pt-4">
                <HeroCarousel
                    slides={[
                        {
                            title: 'Mở bán khóa JavaScript Pro',
                            subtitle:
                                'Từ 08/08/2024 khóa học sẽ có giá 1.399k. Khi khóa học hoàn thiện sẽ trở về giá gốc.',
                            ctaText: 'Học thử miễn phí',
                            ctaHref: '#pro',
                            gradient: 'bg-linear-to-r from-[#7c3aed] via-[#8b5cf6] to-[#fb7185]',
                            rightImage:
                                'https://files.fullstack.edu.vn/f8-prod/banners/37/66b5a6b16d31a.png',
                        },
                        {
                            title: 'Học HTML CSS cho người mới',
                            subtitle:
                                'Thực hành dự án với Figma, hàng trăm bài tập, hướng dẫn chi tiết, tặng kèm Flashcards... ',
                            ctaText: 'Học thử miễn phí',
                            ctaHref: '#pro',
                            gradient: 'bg-linear-to-r from-[#6a5af9] via-[#a855f7] to-[#f97316]',
                            rightImage:
                                'https://files.fullstack.edu.vn/f8-prod/banners/20/68010e5598e64.png',
                        },
                        {
                            title: 'Học ReactJS Miễn Phí!',
                            subtitle:
                                'Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả: có thể làm hầu hết dự án thường gặp.',
                            ctaText: 'Đăng ký ngay',
                            ctaHref: '#courses',
                            gradient: 'bg-linear-to-r from-[#2563eb] via-[#4f46e5] to-[#9333ea]',
                            rightImage:
                                'https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png',
                        },
                        {
                            title: 'Thành Quả của Học Viên',
                            subtitle: 'Xem những sản phẩm ấn tượng do học viên thực hiện.',
                            ctaText: 'Xem thành quả',
                            ctaHref: '#featured-posts',
                            gradient: 'bg-linear-to-r from-[#2563eb] to-[#06b6d4]',
                            rightImage:
                                'https://files.fullstack.edu.vn/f8-prod/banners/Banner_04_2.png',
                        },
                        {
                            title: 'F8 trên Youtube',
                            subtitle:
                                'Được nhắc tới ở mọi nơi, là cơ hội việc làm cho người yêu thích lập trình F8.',
                            ctaText: 'Đăng ký kênh',
                            ctaHref: 'https://www.youtube.com/@F8VNOfficial',
                            gradient: 'bg-linear-to-r from-[#ef4444] via-[#f97316] to-[#f59e0b]',
                            rightImage:
                                'https://files.fullstack.edu.vn/f8-prod/banners/Banner_03_youtube.png',
                        },
                    ]}
                />
            </section>

            {/* Courses grid */}
            <section id="pro" className="md:px-11 px-3 py-8 md:py-12">
                <SectionHeader title="Khóa học Pro" badge="Mới" actionHref="#" />
                {error ? (
                    <div className="mt-4 text-sm text-red-500">{error}</div>
                ) : loading && proCourses.length === 0 ? (
                    <div className="mt-4 text-sm text-gray-500">Đang tải khóa học...</div>
                ) : (
                    <CourseGrid variant="pro" courses={proCourses} />
                )}
            </section>

            <section id="courses" className="md:px-11 px-3 pb-8 md:pb-12">
                <SectionHeader
                    title="Khóa học miễn phí"
                    actionText="Xem lộ trình"
                    actionHref="learning-paths"
                />
                {error ? (
                    <div className="mt-4 text-sm text-red-500">{error}</div>
                ) : loading && freeCourses.length === 0 ? (
                    <div className="mt-4 text-sm text-gray-500">Đang tải khóa học...</div>
                ) : (
                    <CourseGrid variant="free" courses={freeCourses} />
                )}
            </section>

            {/* Featured Posts */}
            <section id="featured-posts" className="md:px-11 px-3 pb-8 md:pb-12">
                <SectionHeader title="Bài viết nổi bật" actionText="Xem tất cả" actionHref="blog" />
                <FeaturedPosts />
            </section>

            {/* Featured Videos */}
            <section id="featured-videos" className="md:px-11 px-3 pb-12 md:pb-16">
                <SectionHeader
                    title="Videos nổi bật"
                    actionText="Xem tất cả"
                    actionHref="https://www.youtube.com/c/F8VNOfficial/videos"
                />
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => {
                        const minutes = 3 + (i % 9);
                        const seconds = String((i * 7) % 60).padStart(2, '0');
                        const views = `${(120 + i * 45).toLocaleString()}k`;
                        const likes = `${200 + i * 17}`;
                        return (
                            <VideoCard
                                key={i}
                                title={`Sinh viên IT đi thực tập tại doanh nghiệp cần biết những gì? #${
                                    i + 1
                                }`}
                                image={`https://picsum.photos/seed/video-${i}/600/300`}
                                duration={`${minutes}:${seconds}`}
                                views={views}
                                likes={likes}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
