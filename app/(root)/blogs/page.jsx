import BlogFilterBar from "@/components/blogs/blog-filter-bar";
import BlogFilterItem from "@/components/blogs/blog-filter-item";
import InsightsCard from "@/components/home/insights-card";
import InfiniteScroll from "@/components/shared/infinite-scroll";
import NoResult from "@/components/shared/no-result";
import { getBlogs } from "@/lib/actions/blog.action";
import { getCategory } from "@/lib/actions/category.action";

const BlogPage = async ({ searchParams }) => {
  const { category, search, page } = await searchParams;

  const categoryParams = category || "";

  const {
    blogs = [],
    total = 0,
    hasNextPage = false,
  } = await getBlogs({
    categories: categoryParams.split(","),
    search: search?.trim(),
    page: Number(page) || 1,
    limit: 4,
  });

  const categories = await getCategory();

  return (
    <section className="py-5">
      <div className="container mx-auto px-2 md:px-5 lg:max-w-6xl">
        {/* Filter Bar */}
        <BlogFilterBar blogs={blogs} total={total} categories={categories} />

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:mt-8 lg:grid-cols-12">
          {/* Blog Posts Section */}
          <div className="lg:col-span-9">
            {blogs?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {blogs?.map((blog) => (
                  <InsightsCard key={blog?.slug} insights={blog} />
                ))}

                {/* InfiniteScroll */}
                <div className="col-span-full">
                  <InfiniteScroll hasNextPage={hasNextPage} />
                </div>
              </div>
            ) : (
              <NoResult />
            )}
          </div>

          {/* Sidebar (Categories) */}
          <div className="courses-filter col-span-3 hidden rounded-md bg-white px-4 py-1.5 shadow-md lg:block dark:bg-black">
            <BlogFilterItem categories={categories} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
