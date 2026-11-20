import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  // Available Courses
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");

  // My Courses
  const [myCourses, setMyCourses] = useState([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(true);
  const [myCoursesError, setMyCoursesError] = useState("");

  // Enrollment
  const [enrolling, setEnrolling] = useState("");
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  // Selected Course
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Get Student Profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Please login to continue.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(response.data);
      } catch (error) {
        setMessage("Unable to load your profile. Please login again.");
      }
    };

    getProfile();
  }, []);

  // Get All Available Courses
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");

        setCourses(response.data);
      } catch (error) {
        setCoursesError("Unable to load courses.");
      } finally {
        setCoursesLoading(false);
      }
    };

    getCourses();
  }, []);

  // Get My Enrolled Courses
  const getMyCourses = async () => {
    try {
      setMyCoursesLoading(true);
      setMyCoursesError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/enrollments/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMyCourses(response.data.courses);
    } catch (error) {
      setMyCoursesError(
        error.response?.data?.message ||
          "Unable to load your enrolled courses.",
      );
    } finally {
      setMyCoursesLoading(false);
    }
  };

  // Fetch My Courses on Dashboard Load
  useEffect(() => {
    if (user?.role === "student") {
      getMyCourses();
    }
  }, [user]);

  // Enroll Student in Course
  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      setEnrollmentMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/enrollments",
        {
          courseId: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEnrollmentMessage(response.data.message);

      // Refresh My Courses after enrollment
      await getMyCourses();
    alert("Lesson completed successfully!");
    } catch (error) {
      setEnrollmentMessage(
        error.response?.data?.message || "Enrollment failed.",
      );
    } finally {
      setEnrolling("");
    }
  };

  // Complete Lesson Function
  const handleCompleteLesson = async () => {
    try {
      setCompletingLesson(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/enrollments/complete-lesson",
        {
          courseId: selectedCourse._id,
          lessonId: selectedLesson._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await getMyCourses();

      alert("Lesson completed successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to complete lesson.");
    } finally {
      setCompletingLesson(false);
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onLogout) {
      onLogout();
    }
  };
  const handleAddCourse = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        user.role === "admin"
          ? "http://localhost:5000/api/admin/courses"
          : "http://localhost:5000/api/instructor/courses",
        {
          title: courseTitle,
          description: courseDescription,
          instructor: user.name,
          duration: courseDuration,
          category: courseCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

setCourses((prevCourses) => [...prevCourses, response.data.course]);
      setCourseTitle("");
      setCourseDescription("");
      setCourseCategory("");
      setShowCourseForm(false);
      setCourseDuration("");

      alert("Course added successfully!");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
      );
    }
  };
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const url =
        user.role === "admin"
          ? `http://localhost:5000/api/admin/courses/${courseId}`
          : `http://localhost:5000/api/instructor/courses/${courseId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses((prevCourses) =>
    prevCourses.filter((course) => course._id !== courseId)
);

      alert("Course deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete course");
    }
  };
  const handleEditCourse = async (course) => {
    const newTitle = window.prompt("Enter new course title:", course.title);

    if (!newTitle || !newTitle.trim()) return;

    const newDescription = window.prompt(
      "Enter new description:",
      course.description,
    );

    if (!newDescription || !newDescription.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const url =
        user.role === "admin"
          ? `http://localhost:5000/api/admin/courses/${course._id}`
          : `http://localhost:5000/api/instructor/courses/${course._id}`;

      const response = await axios.put(
        url,
        {
          title: newTitle,
          description: newDescription,
          instructor: course.instructor,
          duration: course.duration,
          category: course.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCourses((prevCourses) =>
    prevCourses.map((item) =>
        item._id === course._id ? response.data.course : item
    )
);

      alert("Course updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update course");
    }
  };
  const handleAddLesson = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url =
        user.role === "admin"
          ? `http://localhost:5000/api/admin/courses/${selectedCourseId}/lessons`
          : `http://localhost:5000/api/instructor/courses/${selectedCourseId}/lessons`;

      const response = await axios.post(
        url,
        {
          title: lessonTitle,
          description: lessonDescription,
          content: lessonContent,
          videoUrl: lessonVideoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCourses((prevCourses) =>
    prevCourses.map((course) =>
        course._id === selectedCourseId ? response.data.course : course
    )
);

      setLessonTitle("");
      setLessonDescription("");
      setLessonContent("");
      setLessonVideoUrl("");
      setSelectedCourseId("");
      setShowLessonForm(false);

      alert("Lesson added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to add lesson");
    }
  };
  if (message) {
    return (
      <div className="dashboard-message">
        {selectedCourse && (
          <div className="course-details-section">
            <button
              className="course-button"
              onClick={() => {
                setSelectedCourse(null);
                setSelectedLesson(null);
              }}
            >
              ← Back to Dashboard
            </button>

            <h1>{selectedCourse.title}</h1>

            <p>{selectedCourse.description}</p>

            <div className="course-info">
              <p>
                <strong>Instructor:</strong> {selectedCourse.instructor}
              </p>

              <p>
                <strong>Category:</strong> {selectedCourse.category}
              </p>

              <p>
                <strong>Duration:</strong> {selectedCourse.duration}
              </p>
            </div>

            <div className="lessons-section">
              <h2>Course Lessons</h2>

              {!selectedCourse.lessons ||
              selectedCourse.lessons.length === 0 ? (
                <p>No lessons added yet.</p>
              ) : (
                <div className="lessons-layout">
                  <div className="lessons-list">
                    {selectedCourse.lessons.map((lesson, index) => (
                      <button
                        key={lesson._id || index}
                        className="lesson-button"
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <span>▶</span>
                        {lesson.title}
                      </button>
                    ))}
                  </div>

                  <div className="lesson-content">
                    {selectedLesson ? (
                      <>
                        <h2>{selectedLesson.title}</h2>

                        <p>{selectedLesson.description}</p>

                        {selectedLesson.videoUrl && (
                          <iframe
                            width="100%"
                            height="315"
                            src={selectedLesson.videoUrl}
                            title={selectedLesson.title}
                            allowFullScreen
                          />
                        )}

                        <div className="lesson-text">
                          <h3>Lesson Content</h3>
                          <p>{selectedLesson.content}</p>
                        </div>
                      </>
                    ) : (
                      <h3>Select a lesson to start learning!</h3>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <h2>{message}</h2>
        <button onClick={handleLogout}>Back to Login</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        {message || "Loading your dashboard..."}
      </div>
    );
  }
  const firstName = user.name.split(" ")[0];
  // Admin and Instructor Dashboard
  if (user.role === "admin" || user.role === "instructor") {
    return (
      <div className="dashboard-layout admin-dashboard">
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-title">
              <h2>
                {user.role === "admin"
                  ? "Admin Dashboard"
                  : "Instructor Dashboard"}
              </h2>
              <p>Welcome to LearnHub</p>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

          <div className="dashboard-content">
            <section className="welcome-section">
              <div>
                <p className="welcome-label">
                  {user.role.toUpperCase()} PORTAL
                </p>
                <h1>Welcome back, {firstName}!</h1>
                <p className="welcome-description">
                  Manage courses and support the LearnHub learning community.
                </p>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <p>Total Available Courses</p>
                <h2>{courses.length}</h2>
              </div>

              <div className="stat-card">
                <p>Your Role</p>
                <h2>{user.role}</h2>
              </div>
            </section>

            <section className="courses-section">
              <div className="courses-section-header">
                <h2>Available Courses</h2>

                <button onClick={() => setShowCourseForm(!showCourseForm)}>
                  {showCourseForm ? "Cancel" : "+ Add Course"}
                </button>
              </div>

              {showCourseForm && (
                <form onSubmit={handleAddCourse} className="add-course-form">
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course Duration (e.g. 8 Weeks)"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Course Description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Course Category"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    required
                  />

                  <button type="submit">Save Course</button>
                </form>
              )}

              <div className="courses-grid">
                {courses.map((course) => (
                  <div className="course-card" key={course._id}>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <p>{course.category}</p>
                    <button onClick={() => handleDeleteCourse(course._id)}>
                      Delete Course
                    </button>
                    <button onClick={() => handleEditCourse(course)}>
                      Edit Course
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setShowLessonForm(true);
                      }}
                    >
                      Add Lesson
                    </button>
                  </div>
                ))}
              </div>
              {showLessonForm && (
                <form onSubmit={handleAddLesson} className="add-course-form">
                  <h3>Add New Lesson</h3>

                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    required
                  />

                  <textarea
                    placeholder="Lesson Description"
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    required
                  />

                  <textarea
                    placeholder="Lesson Content"
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Video URL (Optional)"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                  />

                  <button type="submit">Save Lesson</button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonForm(false);
                      setSelectedCourseId("");
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </section>
          </div>
        </main>
      </div>
    );
  }

  // Get IDs of already enrolled courses
  const enrolledCourseIds = myCourses.map(
    (enrollment) => enrollment.course?._id,
  );

  const selectedEnrollment = myCourses.find(
    (enrollment) => enrollment.course?._id === selectedCourse?._id,
  );
  const getCourseProgress = (enrollment) => {
    const totalLessons = enrollment.course?.lessons?.length || 0;

    const completedLessons = enrollment.completedLessons?.length || 0;

    if (totalLessons === 0 || completedLessons === 0) {
      return {
        percentage: 0,
        status: "Not Started",
      };
    }

    const percentage = Math.round((completedLessons / totalLessons) * 100);

    return {
      percentage,
      status: percentage === 100 ? "Completed" : "In Progress",
    };
  };
  const completedCount = selectedEnrollment?.completedLessons?.length || 0;

  const totalLessons = selectedCourse?.lessons?.length || 0;

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentLessonIndex = selectedCourse?.lessons?.findIndex(
    (lesson) => lesson._id === selectedLesson?._id,
  );

  return (
    <div className="dashboard-layout">
      {selectedCourse && (
        <div className="course-details-section">
          <button
            className="course-button"
            onClick={() => setSelectedCourse(null)}
          >
            ← Back to Dashboard
          </button>

          <h1>{selectedCourse.title}</h1>

          <p>{selectedCourse.description}</p>

          <div className="course-info">
            <p>
              <strong>Instructor:</strong> {selectedCourse.instructor}
            </p>

            <p>
              <strong>Category:</strong> {selectedCourse.category}
            </p>

            <p>
              <strong>Duration:</strong> {selectedCourse.duration}
            </p>
          </div>

          <div className="lessons-section">
            <h2>Course Lessons</h2>
            <div className="course-progress">
              <h3>Your Progress: {progressPercentage}%</h3>

              <p>
                {completedCount} / {totalLessons} Lessons Completed
              </p>

              <progress value={progressPercentage} max="100" />
            </div>
            {!selectedCourse.lessons || selectedCourse.lessons.length === 0 ? (
              <p>No lessons added yet.</p>
            ) : (
              <div className="lessons-layout">
                <div className="lessons-list">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <button
                      key={lesson._id || index}
                      className="lesson-button"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <span>▶</span>
                      {lesson.title}
                    </button>
                  ))}
                </div>

                <div className="lesson-content">
                  {selectedLesson ? (
                    <>
                      <h2>{selectedLesson.title}</h2>

                      <p>{selectedLesson.description}</p>

                      {selectedLesson.videoUrl && (
                        <iframe
                          width="100%"
                          height="315"
                          src={selectedLesson.videoUrl}
                          title={selectedLesson.title}
                          allowFullScreen
                        />
                      )}

                      <div className="lesson-text">
                        <h3>Lesson Content</h3>
                        <p>{selectedLesson.content}</p>
                      </div>
                      <button
                        className="course-button"
                        onClick={handleCompleteLesson}
                        disabled={
                          completingLesson ||
                          selectedEnrollment?.completedLessons?.includes(
                            selectedLesson._id,
                          )
                        }
                      >
                        {completingLesson
                          ? "Saving..."
                          : selectedEnrollment?.completedLessons?.includes(
                                selectedLesson._id,
                              )
                            ? "✓ Lesson Completed"
                            : "Mark as Complete"}
                      </button>
                      <div className="lesson-navigation">
                        <button
                          className="course-button"
                          disabled={currentLessonIndex <= 0}
                          onClick={() =>
                            setSelectedLesson(
                              selectedCourse.lessons[currentLessonIndex - 1],
                            )
                          }
                        >
                          ← Previous Lesson
                        </button>

                        <button
                          className="course-button"
                          disabled={
                            currentLessonIndex >=
                            selectedCourse.lessons.length - 1
                          }
                          onClick={() =>
                            setSelectedLesson(
                              selectedCourse.lessons[currentLessonIndex + 1],
                            )
                          }
                        >
                          Next Lesson →
                        </button>
                      </div>
                    </>
                  ) : (
                    <h3>Select a lesson to start learning!</h3>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">L</div>
          <span>LearnHub</span>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          <a
            href="#overview"
            className="nav-link active"
            onClick={() => setMenuOpen(false)}
          >
            <span>⌂</span> Overview
          </a>

          <a
            href="#courses"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <span>▤</span> Explore Courses
          </a>

          <a
            href="#my-courses"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <span>▣</span> My Courses
          </a>

          <a
            href="#progress"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <span>◷</span> My Progress
          </a>

          <a
            href="#profile"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <span>♙</span> My Profile
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>
            <strong>Need help?</strong>
            <p>Keep learning and growing with LearnHub.</p>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <span>↪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      {!selectedCourse && (
        <main className="dashboard-main" id="overview">
          {/* Top Navbar */}
          <header className="dashboard-header">
            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <div className="header-title">
              <h2>Dashboard</h2>
              <p>Your learning space</p>
            </div>

            <div className="header-profile" id="profile">
              <div className="avatar">{firstName.charAt(0).toUpperCase()}</div>

              <div className="profile-info">
                <strong>{user.name}</strong>
                <span>Student</span>
              </div>
            </div>
          </header>

          <div className="dashboard-content">
            {/* Welcome Section */}
            <section className="welcome-section">
              <div>
                <p className="welcome-label">STUDENT PORTAL</p>

                <h1>Welcome back, {firstName}!</h1>

                <p className="welcome-description">
                  Your journey of learning starts here. Keep exploring and
                  building new skills.
                </p>
              </div>

              <div className="welcome-decoration">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
              </div>
            </section>

            {/* Statistics */}
            <section className="stats-grid" id="progress">
              <div className="stat-card">
                <div className="stat-icon blue">▤</div>
                <p>Available Courses</p>
                <h2>{courses.length}</h2>
                <span>Courses on LearnHub</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <p>My Enrolled Courses</p>
                <h2>{myCourses.length}</h2>
                <span>Your learning journey</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">◷</div>
                <p>Learning Hours</p>
                <h2>0</h2>
                <span>Your learning time</span>
              </div>
            </section>

            {/* Explore Courses */}
            <section className="courses-section" id="courses">
              <div className="section-heading">
                <div>
                  <h2>Explore Available Courses</h2>
                  <p>Discover courses and build new skills.</p>
                </div>
              </div>

              {enrollmentMessage && (
                <p className="enrollment-message">{enrollmentMessage}</p>
              )}

              {coursesLoading && (
                <div className="empty-courses">
                  <h3>Loading courses...</h3>
                </div>
              )}

              {coursesError && (
                <div className="empty-courses">
                  <h3>{coursesError}</h3>
                </div>
              )}

              {!coursesLoading && !coursesError && courses.length === 0 && (
                <div className="empty-courses">
                  <div className="empty-icon">▤</div>
                  <h3>No courses available yet</h3>
                  <p>New courses will appear here when they are added.</p>
                </div>
              )}

              {!coursesLoading && !coursesError && courses.length > 0 && (
                <div className="courses-grid">
                  {courses.map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course._id);

                    return (
                      <div className="course-card" key={course._id}>
                        <div className="course-card-top">
                          <span className="course-category">
                            {course.category}
                          </span>

                          <div className="course-card-icon">▤</div>
                        </div>

                        <h3>{course.title}</h3>

                        <p className="course-description">
                          {course.description}
                        </p>

                        <div className="course-info">
                          <span>
                            <strong>Instructor:</strong> {course.instructor}
                          </span>

                          <span>
                            <strong>Duration:</strong> {course.duration}
                          </span>
                        </div>

                        <button
                          className="course-button"
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrolling === course._id || isEnrolled}
                        >
                          {enrolling === course._id
                            ? "Enrolling..."
                            : isEnrolled
                              ? "Already Enrolled"
                              : "Enroll Now"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* My Courses Section */}
            <section className="courses-section" id="my-courses">
              <div className="section-heading">
                <div>
                  <h2>My Courses</h2>
                  <p>Continue learning from your enrolled courses.</p>
                </div>
              </div>

              {myCoursesLoading && (
                <div className="empty-courses">
                  <h3>Loading your courses...</h3>
                </div>
              )}

              {myCoursesError && (
                <div className="empty-courses">
                  <h3>{myCoursesError}</h3>
                </div>
              )}

              {!myCoursesLoading &&
                !myCoursesError &&
                myCourses.length === 0 && (
                  <div className="empty-courses">
                    <div className="empty-icon">▤</div>

                    <h3>You haven't enrolled in any course yet</h3>

                    <p>
                      Explore available courses and enroll to start learning.
                    </p>
                  </div>
                )}

              {!myCoursesLoading && !myCoursesError && myCourses.length > 0 && (
                <div className="courses-grid">
                  {myCourses.map((enrollment) => {
                    const course = enrollment.course;

                    if (!course) {
                      return null;
                    }

                    return (
                      <div className="course-card" key={enrollment._id}>
                        <div className="course-card-top">
                          <span className="course-category">
                            {course.category}
                          </span>

                          <div className="course-card-icon">✓</div>
                        </div>

                        <h3>{course.title}</h3>
                        {(() => {
                          const progress = getCourseProgress(enrollment);

                          return (
                            <div className="course-progress">
                              <p>Status: {progress.status}</p>

                              <p>Progress: {progress.percentage}%</p>

                              <progress value={progress.percentage} max="100" />
                            </div>
                          );
                        })()}
                        <p className="course-description">
                          {course.description}
                        </p>

                        <div className="course-info">
                          <span>
                            <strong>Instructor:</strong> {course.instructor}
                          </span>

                          <span>
                            <strong>Duration:</strong> {course.duration}
                          </span>

                          <span>
                            <strong>Enrolled:</strong>{" "}
                            {new Date(
                              enrollment.enrolledAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          className="course-button"
                          onClick={() => {
                            setSelectedCourse(course);
                            setSelectedLesson(null);
                          }}
                        >
                          Start Learning →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Account Information */}
            <section className="account-section">
              <div className="section-heading">
                <div>
                  <h2>Account Information</h2>
                  <p>Your registered student details.</p>
                </div>
              </div>

              <div className="account-card">
                <div className="account-avatar">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="account-details">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <small>LearnHub Student</small>
                </div>

                <div className="account-status">
                  <span></span> Account Active
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="dashboard-footer">
              <span>© 2026 LearnHub</span>
              <span>Learn something new every day.</span>
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
