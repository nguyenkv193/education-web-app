import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlayCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import assets from '../assets';

const formatCurrency = value => {
    if (value === null || value === undefined) return null;
    try {
        return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
    } catch {
        return value;
    }
};

export default function CourseCard({
    title,
    image,
    teacher,
    lessons,
    duration,
    price,
    originalPrice,
    variant = 'pro',
}) {
    const displayedPrice = formatCurrency(price);
    const displayedOriginalPrice = formatCurrency(originalPrice);

    return (
        <article className="rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 duration-300 transition">
            <div className="block">
                <div className="h-30 sm:h-40 md:h-48 w-full bg-gray-100 relative">
                    <img
                        src={image}
                        alt="course_image"
                        className="w-full h-full object-cover object-center"
                    />
                    {variant === 'pro' && (
                        <div className="w-5 h-5 absolute top-2 left-2 bg-black/40 flex items-center justify-center rounded-md">
                            <img
                                src={assets.vip}
                                alt=""
                                className="w-3/5 h-3/5 object-cover object-center"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="sm:py-4 sm:px-5 p-2.5 flex flex-col gap-3 bg-[#f7f7f7]">
                <div className="flex flex-col gap-2 sm:gap-3">
                    <p className="text-base text-[#292929] font-bold line-clamp-1">{title}</p>
                    {variant === 'pro' ? (
                        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-1">
                            {displayedOriginalPrice ? (
                                <span className="line-through text-gray-600 mr-2 text-sm">
                                    {displayedOriginalPrice}
                                </span>
                            ) : null}
                            {displayedPrice ? (
                                <span className="font-semibold text-orange-600">
                                    {displayedPrice}
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <div className="text-[#f54a00] font-semibold text-sm">Miễn phí</div>
                    )}
                </div>
                <div className="sm:mt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="hidden sm:flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <span>{teacher || 'Sơn Đặng'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faPlayCircle} />
                        </span>
                        <span>{lessons || '27 bài'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        <span>{duration || '6h10p'}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
