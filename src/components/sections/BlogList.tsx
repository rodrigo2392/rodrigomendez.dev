import React from "react";
import { BlogPost } from "@/types/contentful";
import BlogCard from "@/components/BlogCard";

interface Props {
  blogs: BlogPost[];
}

const BlogList = ({ blogs }: Props) => {
  return (
    <div className="pb-10">
      <h2 className="text-center font-bold text-3xl">Blog</h2>
      <a href="https://www.youtube.com/@rodrigomendezdev">
        <div className="flex flex-row mb-6 justify-center items-center pt-4">
          <p className="font-bold text-center mr-2">Mi blog personal 📖</p>
        </div>
      </a>

      <div className="grid grid-cols-1 gap-7 xl:grid-cols-2  w-full">
        {blogs?.map((el) => {
          return <BlogCard el={el} key={el.fields.slug} />;
        })}
      </div>
    </div>
  );
};

export default BlogList;
