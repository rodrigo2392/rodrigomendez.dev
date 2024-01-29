import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import BackTop from "@/components/BackTop";
import Header from "@/components/sections/Header";
import About from "@/components/sections/About";
import BlogList from "@/components/sections/BlogList";
import Videos from "@/components/sections/Videos";
import Social from "@/components/sections/Social";
import Contact from "@/components/sections/Contact";
import {getBlog, getVideos} from '@/contentful'



export default async function Home() {

  const videos = await getVideos();
  const blogs = await getBlog();

  const Sections = [
    {
        section: <Header />,
        id: "inicio",
    },
    {
      section: <About />,
      id: "acerca",
    },
    {
        section: <BlogList blogs={blogs} />,
        id: "blog",
    },
    
    {
      section: <Videos videos={videos} />,
      id: "videos",
  },
  {
      section: <Social />,
      id: "redes",
  },
  {
      section: <Contact />,
      id: "contacto",
  },
];


  return (
    <main>
      <Navbar />
      {Sections.map((section, index) => (
                        <Container
                            key={section.id}
                            id={section.id}
                            gray={index % 2 === 0}
                            noPaddingTop={index === 0}
                        >
                            {section.section}
                        </Container>
                    ))}

        <BackTop />
        <Footer />
    </main>
  );
}
