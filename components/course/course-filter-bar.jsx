"use client";
import { LayoutGrid, LayoutList, TableOfContents } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchInput from "../shared/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import CourseFilterItem from "@/components/course/course-filter-item";
import useProvider from "@/hooks/useProvider";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const CourseFilterBar = ({ courses, total, categories }) => {
  const { setIsGridCol } = useProvider();
  const searchParams = useSearchParams();
  const router = useRouter();

  function onSelectCategory(sort) {
    let newUrl = "";
    if (sort && sort !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sort",
        value: sort,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["sort"],
      });
    }
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="filter-bar dark:text-light-bg container mx-auto my-3 flex min-h-[60px] flex-col justify-between rounded border from-white to-white px-2 py-4 shadow-md md:flex-row lg:max-w-6xl dark:bg-gradient-to-b dark:from-black dark:to-black dark:shadow-zinc-900">
      <div className="left-content order-2 mt-5 flex items-center gap-4 text-2xl md:order-1 md:mt-0">
        <Sheet>
          <SheetTrigger>
            <TableOfContents className="block lg:hidden" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="z-50 block w-[300px] pl-2.5 sm:w-[540px] md:pl-5 lg:hidden"
          >
            <SheetHeader>
              <SheetTitle>Filter Options Of Courses</SheetTitle>
            </SheetHeader>
            <CourseFilterItem categories={categories} />
          </SheetContent>
        </Sheet>

        <button
          onClick={() => setIsGridCol(false)}
          className="hidden cursor-pointer sm:block"
        >
          <LayoutGrid />
        </button>
        <button
          onClick={() => setIsGridCol(true)}
          className="hidden cursor-pointer sm:block"
        >
          <LayoutList />
        </button>
        <p className="text-sm">
          Showing {courses?.length} of {total} Results
        </p>
      </div>
      <div className="right-content order-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center md:order-2 md:gap-5">
        <div className="filter-course w-full text-gray-500 sm:w-auto">
          <Select onValueChange={(value) => onSelectCategory(value)}>
            <SelectTrigger className="w-full cursor-pointer rounded border border-gray-300 sm:w-[180px] dark:border-gray-800">
              <SelectValue placeholder="Filter Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="top-rated">Top Rated</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <SearchInput />
        </div>
      </div>
    </div>
  );
};

export default CourseFilterBar;
