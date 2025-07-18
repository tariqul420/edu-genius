import AssignmentForm from "@/components/dashboard/instructor/assignment-form";
import CourseForm from "@/components/dashboard/instructor/course-form";
import ModuleForm from "@/components/dashboard/instructor/module-form";
import QuizForm from "@/components/dashboard/instructor/quiz-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAssignmentById } from "@/lib/actions/assignment.action";
import {
  getCourseBySlug,
  getCourseCurriculum,
} from "@/lib/actions/course.action";
import { getQuizById } from "@/lib/actions/quiz.action";

export default async function EditCourse({ params }) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  const curriculum = await getCourseCurriculum(course._id);
  const quiz = await getQuizById(course._id);
  const assignment = await getAssignmentById(course._id);

  return (
    <>
      <section>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="container mx-auto max-w-4xl px-5 py-6">
            <h1 className="mb-5 text-3xl font-bold">Edit Course</h1>
            <Tabs
              defaultValue="basic"
              className="w-full space-y-5 rounded border px-3 py-3 shadow-xl md:px-8 md:py-5"
            >
              <TabsList className="dark:bg-dark-hover bg-light-bg w-full rounded px-1.5 py-5 shadow-sm">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:text-main dark:from-dark-bg dark:to-dark-hover rounded from-white to-white px-6 py-4 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-sm dark:data-[state=active]:bg-gradient-to-b dark:data-[state=active]:text-white"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="data-[state=active]:text-main dark:from-dark-bg dark:to-dark-hover rounded from-white to-white px-6 py-4 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-sm dark:data-[state=active]:bg-gradient-to-b dark:data-[state=active]:text-white"
                >
                  Curriculum
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <CourseForm course={course} />
              </TabsContent>

              <TabsContent value="curriculum">
                <ModuleForm
                  courseId={course._id}
                  curriculum={curriculum}
                  slug={course.slug}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <section>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="container mx-auto max-w-4xl px-5 py-6">
            <Tabs
              defaultValue="quiz"
              className="w-full space-y-5 rounded border px-3 py-3 shadow-xl md:px-8 md:py-5"
            >
              <TabsList className="dark:bg-dark-hover bg-light-bg w-full rounded px-1.5 py-5 shadow-sm">
                <TabsTrigger
                  value="quiz"
                  className="data-[state=active]:text-main dark:from-dark-bg dark:to-dark-hover rounded from-white to-white px-6 py-4 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-sm dark:data-[state=active]:bg-gradient-to-b dark:data-[state=active]:text-white"
                >
                  Quiz
                </TabsTrigger>
                <TabsTrigger
                  value="assignment"
                  className="data-[state=active]:text-main dark:from-dark-bg dark:to-dark-hover rounded from-white to-white px-6 py-4 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-sm dark:data-[state=active]:bg-gradient-to-b dark:data-[state=active]:text-white"
                >
                  Assignment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quiz">
                <QuizForm
                  quiz={quiz}
                  courseId={course._id}
                  slug={course.slug}
                />
              </TabsContent>

              <TabsContent value="assignment">
                <AssignmentForm
                  assignment={assignment}
                  courseId={course._id}
                  slug={course.slug}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
