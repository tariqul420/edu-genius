/* eslint-disable no-shadow */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AIDescription from "./ai-description";
import AISheet from "./ai-sheet";
import AiTitles from "./ai-titles";

import CategoryForm from "@/components/shared/category-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCategory } from "@/lib/actions/category.action";
import { createCourse, updateCourse } from "@/lib/actions/course.action";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Category is required." }), // Category ID
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL." }),
  language: z
    .string()
    .min(2, { message: "Language must be at least 2 characters." }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({
      message: "Level must be Beginner, Intermediate, or Advanced.",
    }),
  }),
  discount: z
    .number()
    .min(0, { message: "Discount must be at least 0%." })
    .max(100, { message: "Discount cannot exceed 100%." })
    .optional(),
  price: z.number().min(0, { message: "Price must be at least 0." }),
  duration: z
    .number()
    .min(0, { message: "Duration must be at least 0 hours." })
    .optional(),
});

export default function CourseForm({ course }) {
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get a specific query parameter
  const category = searchParams.get("cq");

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category?._id || "",
      thumbnail: course?.thumbnail || "",
      language: course?.language || "",
      level: course?.level || "Beginner",
      discount: course?.discount ?? "",
      price: course?.price || "",
      duration: course?.duration || "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    if (course) {
      toast.promise(
        updateCourse({
          courseId: course._id,
          data: values,
          path: pathname,
        }),
        {
          loading: "Updating course...",
          success: () => {
            router.push(pathname, { scroll: false });
            router.refresh();
            form.reset();
            return "Course updated!";
          },
          error: (error) => {
            console.error("Error creating course:", error);
            return "Failed to create course.";
          },
        },
        { id: "create-course" },
      );
    } else {
      toast.promise(
        createCourse({ data: values, path: pathname }),
        {
          loading: "Creating course...",
          success: () => {
            router.push(pathname, { scroll: false });
            router.refresh();
            form.reset();
            return "Course created successfully!";
          },
          error: (error) => {
            console.error("Error creating course:", error);
            return "Failed to create course.";
          },
        },
        { id: "create-course" },
      );
    }
  }

  //  Get category from server action
  useEffect(() => {
    const fetchCategory = async () => {
      const result = await getCategory(category);
      if (!result) return;
      setCategories(result);
    };

    fetchCategory();
  }, [category]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          className="col-span-1 sm:col-span-2"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Course Title</FormLabel>
                <AISheet value={field.value}>
                  <AiTitles title={field.value} onSelect={field.onChange} />
                </AISheet>
              </div>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Category</FormLabel>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <CategoryForm />

                    {/* Map through categories and create SelectItem for each category */}
                    {categories.map((cate) => (
                      <SelectItem key={cate._id} value={cate._id}>
                        {cate.name}
                      </SelectItem>
                    ))}
                    {/* Example static categories */}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail */}
        <div>
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <CldUploadWidget
                    uploadPreset="edu-genius"
                    onSuccess={(result) => {
                      const { info } = result;
                      form.setValue("thumbnail", info.secure_url); // Set the thumbnail URL in the form state
                    }}
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                    }}
                  >
                    {({ open }) => (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Upload thumbnail"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mb-2"
                          disabled
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => (open ? open() : null)}
                          className="w-fit"
                        >
                          <ImageUp strokeWidth={1} />
                        </Button>
                      </div>
                    )}
                  </CldUploadWidget>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Enter course language" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Level */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Level</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount */}
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter discount percentage"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter course price"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (hours)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter course duration"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel>Course Description</FormLabel>
                <AISheet value={field.value}>
                  <AIDescription
                    title={form.getValues("title")}
                    category={form.getValues("category")}
                    level={form.getValues("level")}
                    onSelect={field.onChange}
                  />
                </AISheet>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Enter course description"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="col-span-1 sm:col-span-2"
          disabled={form.formState.isSubmitting}
        >
          {course ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
