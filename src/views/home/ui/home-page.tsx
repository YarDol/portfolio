import { PersonJsonLd } from "@/shared/seo";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Hero } from "@/widgets/hero";
import { About } from "@/widgets/about";
import { Skills } from "@/widgets/skills";
import { Experience } from "@/widgets/experience";
import { Projects } from "@/widgets/projects";
import { PetProjects } from "@/widgets/pet-projects";
import { LinkedInPosts } from "@/widgets/linkedin-posts";
import { Contact } from "@/widgets/contact";
import { AiChat } from "@/widgets/ai-chat";
import { VoiceWidget } from "@/widgets/voice-assistant";

export function HomePage({ locale }: { locale: string }) {
  return (
    <>
      <PersonJsonLd locale={locale} />
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <PetProjects />
      <LinkedInPosts />
      <Contact />

      <AiChat locale={locale} />
      <VoiceWidget locale={locale} />
      <Footer />
    </>
  );
}
