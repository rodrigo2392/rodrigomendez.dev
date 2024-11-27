import React from "react";
import Navbar from "@/components/Navbar";
import BlogPost from "@/components/BlogPost";
import Footer from "@/components/Footer";
import SEO from "@/components/Seo";
import { getPost } from "../../../contentful";
import { BlogPost as Post } from "@/types/contentful";
import StoreProvider from "@/app/storeprovider";
import Main from "@/components/Main";

interface PageProp {
  params: {
    slug: string;
  };
}
export default async function Home({ params }: PageProp) {
  const { slug } = params;
  let posts = await getPost(slug?.toString() || "");
  let post = posts[0] as unknown as Post;

  return (
    <StoreProvider>
      <SEO
        title={post?.fields.title}
        description={post?.fields.description}
        tags={post?.fields.tags.join()}
        image={`https:${post?.fields.cover.fields.file.url}`}
        url={`https://rodrigomendez.dev/blog/${slug}`}
      />
      <Main>
        <Navbar />
        <div className="flex justify-center pt-10pb-10 md:px-10" id="inicio">
          <div className="max-w-4xl">
            <BlogPost post={post} />
          </div>
        </div>
        <Footer />
      </Main>
    </StoreProvider>
  );
}
