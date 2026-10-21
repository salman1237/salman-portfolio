import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import CompetitiveProgramming from "@/components/CompetitiveProgramming";
import Achievements from "@/components/Achievements";
import Workshops from "@/components/Workshops";
import LeadershipEducation from "@/components/LeadershipEducation";
import Contact from "@/components/Contact";
import { getProfile } from "@/lib/data";

export const revalidate = 0;

export default async function Home() {
  const profile = await getProfile();
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <CompetitiveProgramming />
      <Achievements />
      <Workshops />
      <LeadershipEducation />
      <Contact profile={profile} />
    </main>
  );
}
