"use client";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { BlogPost } from "@/types/contentful";
import "dayjs/locale/es";

dayjs.locale("es");

interface Props {
  el: BlogPost;
}

export default function BlogCard({ el }: Props) {
  const [currentDate, setCurrentDate] = React.useState("");

  React.useEffect(() => {
    setCurrentDate(dayjs(el.sys.createdAt).format("dddd D MMMM YYYY"));
  }, [el.sys.createdAt]);
  return (
    <div>
      <a href={`blog/${el.fields.slug}`} className="cursor-pointer w-full">
        <div className="w-full shadow-md rounded-b-lg relative lg:flex">
          <Image
            src={`https:${el.fields.cover.fields.file.url}`}
            width={600}
            height={400}
            alt={el.fields.title}
            className="w-full h-44 lg:w-40 lg:h-auto rounded-t-lg lg:rounded-none object-cover"
          />
          <div className="pb-3">
            <div className="px-5 py-5">
              <h2 className="font-bold text-sm">{el.fields.title}</h2>
              <p className="text-xs pt-3">{el.fields.description}</p>
            </div>
            <div className="px-5 pb-5 flex flex-wrap gap-2">
              {el.fields.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1  rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs rounded-xl px-5">{currentDate}</span>
          </div>
        </div>
      </a>
    </div>
  );
}
