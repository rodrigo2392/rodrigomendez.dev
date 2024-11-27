import React from "react";
import Image from "next/image";
import { YoutubeVideo } from "@/types/contentful";

interface Props {
  videos: YoutubeVideo[];
}

const Videos = ({ videos }: Props) => {
  return (
    <div className="pb-10">
      <h2 className="text-center font-bold text-3xl">Videos</h2>
      <a href="https://www.youtube.com/@rodrigomendezdev">
        <div className="flex flex-row mb-6 justify-center items-center pt-4">
          <p className="font-bold  text-center mr-2">Mi canal de youtube</p>
          <Image
            src="/icons/youtube.svg"
            width={30}
            height={30}
            alt="Canal de youtube"
          />
        </div>
      </a>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3 w-full">
        {videos.map((el) => (
          <a
            href={el.fields.url}
            target="_blank"
            className="cursor-pointer w-full"
            key={el.sys.id}
            rel="noreferrer"
          >
            <div className=" w-full shadow-md rounded-b-lg relative">
              <Image
                src={`https:${el.fields.image.fields.file.url}`}
                width={326}
                height={260}
                alt={el.fields.title}
                className="w-full h-52 lg:h-36 rounded-t-lg object-cover"
              />
              <div className="px-5 py-5 pb-5 ">
                <h2 className="font-bold">{el.fields.title}</h2>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Videos;
