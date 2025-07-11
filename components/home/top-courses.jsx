import CourseCard from "../shared/course-card";

import TopCoursesBtn from "./top-courses-btn";

import Heading from "@/components/shared/heading";
import NoResult from "@/components/shared/no-result";

const TopCourses = async ({ courses, categories }) => {
  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-2 md:px-5 lg:max-w-6xl">
        <Heading
          badge={"Top Courses"}
          title={"Master Digital Skills"}
          subTitle={`Become proficient in web development & graphic design
video editing and digital marketing courses`}
        />

        {/* Category Buttons */}
        <TopCoursesBtn categories={categories} />

        {/* Course Cards */}
        {courses?.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 px-3 sm:px-0 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {courses.map((course, index) => (
              <div key={index} className="flex flex-col">
                <CourseCard
                  key={index}
                  course={JSON.parse(JSON.stringify(course))}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <NoResult />
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCourses;
