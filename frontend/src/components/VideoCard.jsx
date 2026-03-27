import { faComment, faEye, faPlay, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VideoCard({ title, image, duration, views, likes }) {
    return (
        <article className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-300 overflow-hidden">
            <a href="#" className="block relative">
                <div className="h-30 sm:h-40 md:h-48 w-full bg-gray-100 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <img src={image} alt="video_thumbnail" className="w-full h-full object-cover" />
                </div>
                <span className="absolute right-2 bottom-2 px-3 py-1 border-2 border-white text-white text-[10px] rounded-full">
                    {duration}
                </span>
                <span className="absolute left-2 bottom-2 grid place-items-center bg-white/90 w-6 h-6 rounded-full text-black text-xs font-semibold">
                    <FontAwesomeIcon icon={faPlay} />
                </span>
            </a>
            <div className="p-4 bg-[#f7f7f7]">
                <h3 className="font-semibold line-clamp-2 min-h-11">{title}</h3>
                <div className="mt-3 flex justify-between items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faEye} />
                        </span>
                        <span>{views}</span>
                    </div>
                    <div className="hidden sm:flex just items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </span>
                        <span>{likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>
                            <FontAwesomeIcon icon={faComment} />
                        </span>
                        <span>{likes}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
