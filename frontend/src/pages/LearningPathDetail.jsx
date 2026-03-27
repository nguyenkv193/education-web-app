import { useNavigate, useParams, Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import {
    COMMON_SECTIONS,
    FRONTEND_EXTRA,
    BACKEND_EXTRA,
    LEARNING_PATH_INTROS,
} from '../constants/learningPaths';

const slugify = text =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

const getCourseSlug = badge => slugify(badge);

export default function LearningPathDetail() {
    const navigate = useNavigate();
    const { type } = useParams();

    const isFrontend = type === 'front-end-development';
    const isBackend = type === 'back-end-development';

    if (!isFrontend && !isBackend) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => navigate('/learning-paths')}
                        className="text-sm mb-6 text-blue-600 hover:text-blue-800"
                    >
                        ← Quay lại lộ trình học
                    </button>
                    <p className="text-gray-600">Không tìm thấy lộ trình phù hợp.</p>
                </div>
            </div>
        );
    }

    const title = isFrontend ? 'Lộ trình học Front-end' : 'Lộ trình học Back-end';
    const intro = isFrontend ? LEARNING_PATH_INTROS.frontend : LEARNING_PATH_INTROS.backend;
    const sections = [...COMMON_SECTIONS, ...(isFrontend ? FRONTEND_EXTRA : BACKEND_EXTRA)];

    return (
        <div className="min-h-screen md:px-11 px-3">
            {/* Header */}
            <div className="md:mt-8 mt-5 md:mb-20 mb-10">
                <SectionHeader title={title} />
                <div className="text-sm leading-relaxed text-[#292929] max-w-[840px] space-y-3 mt-8">
                    {/* Intro paragraphs */}
                    <p>{intro.paragraph1}</p>
                    <p>
                        Tại Việt Nam,
                        <a
                            href="https://jobsgo.vn/muc-luong-lap-trinh-frontend/ha-noi.html"
                            target="_blank"
                            className="text-[#f05123] font-bold underline underline-offset-2 cursor-pointer"
                        >
                            {' '}
                            lương trung bình
                        </a>{' '}
                        cho lập trình viên {isFrontend ? 'Front-end' : 'Back-end'} vào khoảng{' '}
                        <span className="font-bold">{intro.salary}</span> / tháng.
                    </p>
                    <p>{intro.paragraph2}</p>

                    {/* Note line with orange border */}
                    <div className="mt-2 pl-4 border-l-3 border-[#f05123] text-[13px] text-[#6d6d6d]">
                        {intro.note}
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 pb-20">
                {/* Sections list */}
                <div className="flex-2 2xl:pr-40 space-y-10">
                    {sections.map(section => (
                        <div key={section.id} className="space-y-4">
                            {/* Section title */}
                            <SectionHeader title={section.title} />

                            <p className="text-sm leading-relaxed text-black">
                                {section.primaryDesc}
                            </p>

                            {section.courses?.map(course => (
                                <div
                                    key={course.badge}
                                    className="flex flex-col md:flex-row gap-3 md:gap-4 bg-white border-2 border-[#e5e5e5] rounded-2xl p-4"
                                >
                                    <div className="w-full sm:w-[260px] flex items-center justify-center overflow-hidden">
                                        <a href="#" className="block w-full h-full">
                                            <img
                                                src={course.image}
                                                alt={course.badge}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </a>
                                    </div>

                                    {/* Right course info */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-lg font-bold text-black mb-1 cursor-pointer">
                                            <a href="#">{course.badge}</a>
                                        </h3>
                                        {course.isFree ? (
                                            <p className="text-base text-[#f05123] font-semibold mb-1">
                                                Miễn phí
                                            </p>
                                        ) : (
                                            <p className="text-base flex items-center gap-2">
                                                <span className="text-xs text-black line-through">
                                                    {course.originalPrice}
                                                </span>
                                                <span className="font-semibold text-[#f05123]">
                                                    {course.salePrice}
                                                </span>
                                            </p>
                                        )}

                                        <p className="text-[13px] md:text-sm text-black leading-relaxed mb-3 line-clamp-2">
                                            {course.secondaryDesc}
                                        </p>
                                        <Link
                                            to={`/courses/${getCourseSlug(course.badge)}`}
                                            className="flex md:w-max w-full items-center justify-center rounded-full bg-[#0093fc] hover:opacity-90 text-white text-sm font-semibold px-5 py-1.5 uppercase tracking-wide cursor-pointer"
                                        >
                                            Xem khóa học
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {/* Right sidebar (promo area) */}
                <div className="hidden sm:flex lg:flex-col flex-row gap-4 lg:max-w-[300px] flex-1">
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src="https://files.fullstack.edu.vn/f8-prod/banners/21/63db7cc59001b.png"
                            alt="facebook-image"
                        />
                    </div>

                    {/* YouTube Section */}
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src="https://files.fullstack.edu.vn/f8-prod/banners/31/6421141abacbe.png"
                            alt="youtube-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
