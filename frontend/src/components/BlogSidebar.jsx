import React from "react";

const BlogSidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Topics Section */}
      <div>
        <h3 className="text-sm uppercase font-medium text-[#757575] mb-4 whitespace-nowrap">
          Xem các bài viết theo chủ đề
        </h3>
        <ul className="flex flex-wrap gap-2">
          {[
            "Front-end / Mobilde apps",
            "Back-end / Devops",
            "UI / UX / Design",
            "Others",
          ].map((item, idx) => (
            <li
              key={idx}
              className="text-sm text-[#333] font-medium px-4 py-1.5 bg-[#f2f2f2] rounded-full whitespace-nowrap"
            >
              <a href="">{item}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Course Promo Section */}
      <div className="hidden sm:flex lg:flex-col flex-row gap-4 lg:max-w-[300px]">
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://files.fullstack.edu.vn/f8-prod/banners/26/63dc61f2a061e.png"
            alt="facebook-image"
          />
        </div>

        {/* YouTube Section */}
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://files.fullstack.edu.vn/f8-prod/banners/32/6421144f7b504.png"
            alt="youtube-image"
          />
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
