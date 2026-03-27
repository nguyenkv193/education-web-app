import assets from '../assets';

const Footer = () => {
    return (
        <footer className="bg-[#181821] px-2.5 md:px-16 xl:px-[150px] pt-[30px] md:pt-[70px] md:pb-10 pb-22">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-[#a9b3bb]">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-10 w-10 rounded-md bg-linear-to-br from-orange-400 to-orange-600 text-white grid place-items-center text-2xl ">
                            E
                        </div>
                        <div className="text-sm font-bold tracking-wide text-white">EduMaster</div>
                    </div>
                    <p className="mt-5 text-sm">
                        Hệ thống đào tạo công nghệ — Lộ trình thực hành, hỗ trợ việc làm.
                    </p>
                    <ul className="text-sm flex flex-col gap-1">
                        <li>Điện thoại: 08 1919 8989</li>
                        <li>Email: contact@baoren.edu.vn</li>
                        <li>Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</li>
                        <ul>
                            <img src={assets.dmca} alt="" />
                        </ul>
                    </ul>
                </div>

                <div className="text-[#a9b3bb] md:pl-10">
                    <h4 className="font-semibold text-white uppercase">Về EduMaster</h4>
                    <ul className="mt-8 space-y-2 text-sm">
                        <li className="cursor-pointer">
                            <a href="#">Giới thiệu</a>
                        </li>
                        <li className="cursor-pointer">
                            <a href="#">Liên hệ</a>
                        </li>
                        <li className="cursor-pointer">
                            <a href="#">Điều khoản</a>
                        </li>
                        <li className="cursor-pointer">
                            <a href="#">Bảo mật</a>
                        </li>
                    </ul>
                </div>

                <div className="text-[#a9b3bb]">
                    <h4 className="font-semibold text-white uppercase">Sản phẩm</h4>
                    <ul className="mt-8 space-y-2 text-sm ">
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game Nester</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game CSS Diner</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game CSS Selectors</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game Froggy</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game Froggy Pro</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Game Scoops</a>
                        </li>
                    </ul>
                </div>

                <div className="text-[#a9b3bb]">
                    <h4 className="font-semibold text-white uppercase">Công cụ</h4>
                    <ul className="mt-8 space-y-2 text-sm">
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Tạo CV xin việc</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Rút gọn liên kết</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Clip-path maker</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Snippet generator</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>CSS Grid generator</a>
                        </li>
                        <li className="cursor-pointer hover:underline underline-offset-2">
                            <a>Cảnh báo sờ tay lên mặt</a>
                        </li>
                    </ul>
                </div>

                <div className="text-[#a9b3bb]">
                    <h4 className="font-semibold text-white uppercase">
                        CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC EDUMASTER
                    </h4>
                    <ul className="mt-2 space-y-2 text-sm">
                        <li>Mã số thuế: 123123123</li>
                        <li>Ngày thành lập: 04/03/2022</li>
                        <li>
                            Lĩnh vực hoạt động: Giáo dục, công nghệ - lập trình. Chúng tôi tập trung
                            xây dựng và phát triển các sản phẩm mang lại giá trị cho cộng đồng lập
                            trình viên Việt Nam.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6">
                <div className="text-sm text-gray-500">
                    © {new Date().getFullYear()} EduMaster — Bản quyền thuộc về EduMaster.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
