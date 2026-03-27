// Test helper: Inject mock enrolled course data to localStorage for debugging
export function injectTestEnrolledCourse() {
  const mockUser = {
    _id: "test-user-123",
    fullName: "Test User",
    email: "test@example.com",
    enrolledCourses: [
      {
        courseId: "course-1",
        title: "HTML CSS Cơ Bản",
        slug: "html-css",
        enrolledAt: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days ago
        progress: 45,
        thumbnail: "https://via.placeholder.com/300x200?text=HTML+CSS",
      },
      {
        courseId: "course-2",
        title: "JavaScript Nâng Cao",
        slug: "javascript-advanced",
        enrolledAt: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
        progress: 0,
        thumbnail: "https://via.placeholder.com/300x200?text=JavaScript",
      },
      {
        courseId: "course-3",
        title: "React.js Beginner",
        slug: "reactjs-beginner",
        enrolledAt: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 day ago
        progress: 75,
        thumbnail: "https://via.placeholder.com/300x200?text=React",
      },
    ],
  };

  localStorage.setItem("user", JSON.stringify(mockUser));
  console.log("✓ Test enrolled courses injected to localStorage", mockUser);
}

// Clear test data
export function clearTestData() {
  localStorage.removeItem("user");
  console.log("✓ Test data cleared");
}
