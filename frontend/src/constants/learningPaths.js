export const COMMON_SECTIONS = [
    {
        id: 1,
        title: '1. Tìm hiểu về ngành IT',
        primaryDesc:
            'Để theo ngành IT - Phần mềm cần rèn luyện những kỹ năng nào? Bạn đã có sẵn tố chất phù hợp với ngành chưa? Cùng thăm quan các công ty IT và tìm hiểu về văn hóa, tác phong làm việc của ngành này nhé các bạn.',
        courses: [
            {
                badge: 'Kiến Thức Nhập Môn IT',
                secondaryDesc:
                    'Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.',
                isFree: true,
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
            },
        ],
    },
    {
        id: 2,
        title: '2. HTML và CSS',
        primaryDesc:
            'Để học web Front-end chúng ta luôn bắt đầu với ngôn ngữ HTML và CSS, đây là 2 ngôn ngữ có mặt trong mọi website trên internet. Trong khóa học này F8 sẽ chia sẻ từ những kiến thức cơ bản nhất. Sau khóa học này bạn sẽ tự làm được 2 giao diện websites là The Band và Shopee.',
        courses: [
            {
                badge: 'HTML CSS Pro',
                secondaryDesc:
                    'Khóa học HTML CSS Pro phù hợp cho cả người mới bắt đầu, lên tới 8 dự án trên Figma, 300+ bài tập và flashcards, tặng 3+ games, tặng 20+ Figma để thực hành, cộng đồng học viên Pro nhiệt tình hỗ trợ nhau, mua một lần học mãi mãi.',
                isFree: false,
                originalPrice: '2.500.000đ',
                salePrice: '1.299.000đ',
                image: 'https://khoahochatde.com/wp-content/uploads/2025/01/62f13d2424a47.png',
            },
            {
                badge: 'Responsive & Grid System',
                secondaryDesc:
                    'Trong khóa này chúng ta sẽ học về cách xây dựng giao diện web responsive với Grid System, tương tự Bootstrap 4.',
                isFree: true,
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/3.png',
            },
        ],
    },
    {
        id: 3,
        title: '3. JavaScript',
        primaryDesc:
            'Với HTML, CSS bạn mới chỉ xây dựng được các websites tĩnh, chỉ bao gồm phần giao diện và gần như chưa có xử lý tương tác gì. Để thêm nhiều chức năng phong phú và tăng tính tương tác cho website bạn cần học Javascript.',
        courses: [
            {
                badge: 'JavaScript Cơ Bản',
                secondaryDesc:
                    'Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.',
                isFree: true,
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/1.png',
            },
            {
                badge: 'JavaScript Nâng Cao',
                secondaryDesc:
                    'Khóa học JavaScript nâng cao tập trung vào các kiến thức quan trọng để làm việc hiệu quả: scope, closure, async/await, Promise, this, prototype, module, pattern trong JavaScript. Xây dựng các dự án thực hành để luyện tập kỹ năng, best practice trong JavaScript, làm nền tảng vững chắc khi chuyển sang React, NodeJS hoặc các framework khác.',
                isFree: false,
                originalPrice: '2.000.000đ',
                salePrice: '1.200.000đ',
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/12.png',
            },
        ],
    },
    {
        id: 4,
        title: '4. Sử dụng Ubuntu/Terminal',
        primaryDesc:
            'Cách làm việc với hệ điều hành Ubuntu/Linux qua Windows Terminal & WSL. Khi đi làm, nhiều trường hợp bạn cần nắm vững các dòng lệnh cơ bản của Ubuntu/Linux.',
        courses: [
            {
                badge: 'Làm việc với Terminal & Ubuntu',
                secondaryDesc:
                    'Sở hữu một Terminal hiện đại, mạnh mẽ trong tùy biến và học cách làm việc với Ubuntu là một bước quan trọng trên con đường trở thành một Web Developer.',
                isFree: true,
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/14/624faac11d109.png',
            },
        ],
    },
];

export const FRONTEND_EXTRA = [
    {
        id: 5,
        title: '5. Libraries and Frameworks',
        primaryDesc:
            'Một websites hay ứng dụng hiện đại rất phức tạp, chỉ sử dụng HTML, CSS, Javascript theo cách code thuần (tự code từ đầu tới cuối) sẽ rất khó khăn. Vì vậy các Libraries, Frameworks ra đời nhằm đơn giản hóa, tiết kiệm chi phí và thời gian để hoàn thành một sản phẩm website hoặc ứng dụng mobile.',
        courses: [
            {
                badge: 'ReactJS Cơ Bản',
                secondaryDesc:
                    'Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS. Cuối khóa học này bạn sẽ sở hữu một dự án giống Tiktok.com, bạn có thể tự tin đi xin việc khi nắm chắc các kiến thức được chia sẻ trong khóa học này.',
                isFree: false,
                originalPrice: '2.000.000đ',
                salePrice: '1.200.000đ',
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/13/13.png',
            },
        ],
    },
];

export const BACKEND_EXTRA = [
    {
        id: 5,
        title: '5. Node.js & ExpressJS',
        primaryDesc:
            'Một ứng dụng Back-end hiện đại có thể rất phức tạp, việc sử dụng code thuần (tự tay code từ đầu) không phải là một lựa chọn tốt. Vì vậy các Libraries và Frameworks ra đời nhằm đơn giản hóa, tiết kiệm thời gian và tiền bạc để nhanh chóng tạo ra được sản phẩm cuối cùng.',
        courses: [
            {
                badge: 'NodeJS & ExpressJS',
                secondaryDesc:
                    'Học Back-end với Node & ExpressJS framework, hiểu các khái niệm khi làm Back-end và xây dựng RESTful API cho trang web.',
                isFree: true,
                image: 'https://files.fullstack.edu.vn/f8-prod/courses/6.png',
            },
        ],
    },
];

export const LEARNING_PATH_INTROS = {
    frontend: {
        paragraph1:
            'Hầu hết các websites hoặc ứng dụng di động đều có 2 phần là Front-end và Back-end. Front-end là phần giao diện người dùng nhìn thấy và có thể tương tác, đó chính là các ứng dụng mobile hay những website bạn đã từng sử dụng. Vì vậy, nhiệm vụ của lập trình viên Front-end là xây dựng các giao diện đẹp, dễ sử dụng và tối ưu trải nghiệm người dùng.',
        paragraph2:
            'Dưới đây là các khóa học F8 đã tạo ra dành cho bất cứ ai theo đuổi sự nghiệp trở thành một lập trình viên Front-end.',
        note: 'Các khóa học có thể chưa đầy đủ, F8 vẫn đang nỗ lực hoàn thiện trong thời gian sớm nhất.',
        salary: '16.000.000đ',
    },
    backend: {
        paragraph1:
            'Hầu hết các websites hoặc ứng dụng di động đều có 2 phần là Front-end và Back-end. Front-end là phần giao diện người dùng nhìn thấy và có thể tương tác. Back-end là nơi xử lý dữ liệu và lưu trữ. Vì vậy, nhiệm vụ của lập trình viên Back-end là phân tích thiết kế dữ liệu, xử lý logic nghiệp vụ của các chức năng trong ứng dụng.',
        paragraph2:
            'Dưới đây là các khóa học F8 đã tạo ra dành cho bất cứ ai theo đuổi sự nghiệp trở thành một lập trình viên Back-end.',
        note: 'Các khóa học có thể chưa đầy đủ, F8 vẫn đang nỗ lực hoàn thiện trong thời gian sớm nhất.',
        salary: '19.000.000đ',
    },
};
