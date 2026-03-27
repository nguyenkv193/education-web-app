import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function PostCard({ id, title, image, author, meta }) {
    return (
        <article className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col">
            <Link to={`/blog/${id}`} className="block">
                <div className="h-30 sm:h-40 md:h-48 w-full">
                    <img src={image} alt="post_image" className="w-full h-full object-cover" />
                </div>
            </Link>
            <div className="p-2.5 sm:p-4 bg-[#f7f7f7] flex-1 flex flex-col gap-3">
                <Link to={`/blog/${id}`} className="font-semibold line-clamp-2">
                    {title}
                </Link>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <div className="hidden sm:flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <span>{author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        <span>{meta}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
