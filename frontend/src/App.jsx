import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
const HomePage = React.lazy(() => import("./pages/HomePage"));
const LearningPaths = React.lazy(() => import("./pages/LearningPaths"));
const LearningPathDetail = React.lazy(
  () => import("./pages/LearningPathDetail"),
);
const CourseLessonDetail = React.lazy(
  () => import("./pages/CourseLessonDetail"),
);
const CourseLearn = React.lazy(() => import("./pages/CourseLearn"));
const CourseCheckout = React.lazy(() => import("./pages/CourseCheckout"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const CreateBlog = React.lazy(() => import("./pages/CreateBlog"));
const MyBlogPosts = React.lazy(() => import("./pages/MyBlogPosts"));
const SavedBlogPosts = React.lazy(() => import("./pages/SavedBlogPosts"));
const MyCourses = React.lazy(() => import("./pages/MyCourses"));
const Settings = React.lazy(() => import("./pages/Settings"));
const MainLayout = React.lazy(() => import("./components/MainLayout"));

import { AuthProvider } from "./contexts/AuthContext";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scroller = document.scrollingElement || document.documentElement;
    if (scroller) {
      scroller.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTopOnRouteChange />

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Fullscreen Learning Route */}
            <Route
              path="/courses/:courseSlug/learn/:lessonId?"
              element={<CourseLearn />}
            />

            {/* Routes with layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/learning-paths" element={<LearningPaths />} />
              <Route
                path="/learning-paths/:type"
                element={<LearningPathDetail />}
              />
              <Route
                path="/courses/:courseSlug"
                element={<CourseLessonDetail />}
              />
              <Route
                path="/courses/:courseSlug/checkout"
                element={<CourseCheckout />}
              />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/create" element={<CreateBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/my-blog-posts" element={<MyBlogPosts />} />
              <Route path="/saved-blog-posts" element={<SavedBlogPosts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
