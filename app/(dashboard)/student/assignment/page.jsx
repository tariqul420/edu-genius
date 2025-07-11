import DataTable from "@/components/dashboard/data-table";
import AssignmentStats from "@/components/dashboard/student/assignment-stats";
import { studentAssignmentColumns } from "@/components/dashboard/table-columns";
import { getAssignmentsForStudent } from "@/lib/actions/assignment.action";

export default async function StudentAssignment({ searchParams }) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { assignments, pagination } = await getAssignmentsForStudent({
    limit: Number(pageSize || 10),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <section className="py-6">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and complete your assessments
          </p>
        </div>

        {/* Stats Cards */}
        <AssignmentStats />

        {/* Assignment Table Section */}

        <DataTable
          pageIndex={Number(pageIndex || "1")}
          pageSize={Number(pageSize || "10")}
          total={pagination.totalItems || 0}
          data={assignments || []}
          columns={studentAssignmentColumns || []}
          uniqueIdProperty="_id"
        />
      </div>
    </section>
  );
}
