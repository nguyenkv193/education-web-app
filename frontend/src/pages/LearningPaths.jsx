import React from 'react';
import SectionHeader from '../components/SectionHeader';
import assets from '../assets';
import { Link } from 'react-router-dom';

export default function LearningPaths() {
    return (
        <div className="min-h-screen space-y-8 md:px-11 px-3">
            {/* Header */}
            <div className="mt-8 md:mb-20 mb-10">
                <SectionHeader title="Lộ trình học" />
                <p className="text-gray-700 leading-relaxed max-w-[840px] my-4 text-sm ">
                    Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để
                    đi làm với vị trí "Lập trình viên Front-end", bạn nên tập trung vào lộ trình
                    "Front-end".
                </p>
            </div>

            {/* Lộ trình học */}
            <div className="flex lg:flex-row flex-col items-center gap-6">
                {/* Front-end */}
                <div className="border-2 border-gray-200 rounded-xl w-full lg:max-w-[500px] p-4  shadow-sm">
                    <div className="flex items-start gap-2">
                        <div className="space-y-2">
                            <SectionHeader title="Lộ trình học Front-end" low />
                            <p className="text-gray-600 mb-6 text-sm leading-[1.6]">
                                Lập trình viên Front-end là người xây dựng ra giao diện websites.
                                Trong phần này EduMaster sẽ chia sẻ cho bạn lộ trình để trở thành
                                lập trình viên Front-end.
                            </p>
                        </div>
                        <div className="flex items-center justify-center mt-4 md:mt-0 md:ml-4 w-30 h-30 border-5 border-[#f05123] rounded-full p-2  shrink-0">
                            <Link
                                to="/learning-paths/front-end-development"
                                className="block w-full h-full rounded-full overflow-hidden"
                            >
                                <img
                                    src="https://files.fullstack.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png"
                                    alt="Lộ trình học Front-end"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="mb-6 flex items-center gap-2">
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Kiến thức nhập môn IT"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.task}
                                    alt="task-image"
                                    className="w-full h-full grayscale-75"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="HTML CSS Pro"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.html}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Responsive với Grid System"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.css}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Lập trình Javascript Cơ Bản"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.js}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Lập trình Javascript Nâng Cao"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.js}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Làm việc với Terminal & Ubuntu"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.ubuntu}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Xây dựng Website với ReactJS"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.react}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                    </div>
                    <Link
                        to="/learning-paths/front-end-development"
                        className="inline-block px-4 py-2 bg-[#0093fc] text-white rounded-full hover:opacity-90 transition uppercase text-sm font-semibold tracking-wider"
                    >
                        Xem chi tiết
                    </Link>
                </div>

                {/* Back-end */}
                <div className="border-2 border-gray-200 rounded-xl w-full lg:max-w-[500px] p-4 shadow-sm">
                    <div className="flex items-start gap-2">
                        <div className="space-y-2">
                            <SectionHeader title="Lộ trình học Back-end" low />
                            <p className="text-gray-600 mb-6 text-sm leading-[1.6] ">
                                Trái với Front-end thì lập trình viên Back-end là người làm việc với
                                dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm
                                hiểu thêm về lộ trình học Back-end nhé.
                            </p>
                        </div>
                        <div className="flex items-center justify-center mt-4 md:mt-0 md:ml-4 w-30 h-30 border-5 border-[#f05123] rounded-full p-2  shrink-0">
                            <Link
                                to="/learning-paths/back-end-development"
                                className="block w-full h-full rounded-full overflow-hidden"
                            >
                                <img
                                    src="https://files.fullstack.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png"
                                    alt="Lộ trình học Back-end"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="mb-6 flex items-center gap-2">
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Kiến thức nhập môn IT"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.task}
                                    alt="task-image"
                                    className="w-full h-full grayscale-75"
                                />
                            </a>
                        </div>

                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Lập trình Javascript Cơ Bản"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.js}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Lập trình Javascript Nâng Cao"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.js}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="Làm việc với Terminal & Ubuntu"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.ubuntu}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="NodeJS & ExpressJS"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.node}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                        <div
                            className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            title="HTML CSS Pro"
                        >
                            <a className="w-3/5 h-3/5 overflow-hidden">
                                <img
                                    src={assets.html}
                                    alt="task-image"
                                    className="w-full h-full grayscale-100"
                                />
                            </a>
                        </div>
                    </div>
                    <Link
                        to="/learning-paths/back-end-development"
                        className="inline-block px-4 py-2 bg-[#0093fc] text-white rounded-full hover:opacity-90 transition uppercase text-sm font-semibold tracking-wider"
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>

            {/* Cộng đồng Facebook */}
            <div className="mt-[50px] py-6 flex justify-between items-center">
                <div className="lg:w-[400px] md:mb-0 flex flex-col gap-5">
                    <SectionHeader title="Tham gia cộng đồng học viên F8 trên Facebook" low />
                    <p className="text-gray-600 mb-5 text-sm">
                        Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp,
                        chia sẻ và hỗ trợ nhau trong quá trình học nhé.
                    </p>
                    <a
                        href="https://www.facebook.com/groups/f8official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 text-sm font-semibold py-1.5 border-2 rounded-full hover:bg-black/80 hover:text-white transition self-start"
                    >
                        Tham gia nhóm
                    </a>
                </div>
                <div className="hidden sm:block lg:w-[420px] w-[360px] overflow-hidden shrink-0">
                    {' '}
                    <img
                        src={assets.fb_group}
                        alt="fb-group"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
