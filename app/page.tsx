import { HeroSection } from "@/components/hero-section"
import { AdvocacySection } from "@/components/advocacy-section"
import { GallerySection } from "@/components/gallery-section"
import { AboutSection } from "@/components/about-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { CertificationsSection } from "@/components/certifications-section"
import { ContactSection } from "@/components/contact-section"
import { SlideNav } from "@/components/slide-nav"
import { CustomCursor } from "@/components/custom-cursor"
import { supabase } from "@/lib/supabase"

const galleryImages1 = [
  { src: "/images/gallery-1.jpg", alt: "Teaching" },
  { src: "/images/gallery-2.jpg", alt: "Students" },
  { src: "/images/gallery-3.jpg", alt: "Outreach" },
  { src: "/images/gallery-4.jpg", alt: "Demonstration" },
  { src: "/images/gallery-5.jpg", alt: "Community" },
]

const galleryImages2 = [
  { src: "/images/gallery-6.jpg", alt: "Field Work" },
  { src: "/images/gallery-7.jpg", alt: "Conference" },
  { src: "/images/gallery-8.jpg", alt: "Teamwork" },
  { src: "/images/gallery-9.jpg", alt: "Advocacy" },
  { src: "/images/gallery-10.jpg", alt: "Healthcare" },
]

export const dynamic = 'force-dynamic';

// Dynamic Section Renderer based on Supabase DB entries
function SectionRenderer({ section }: { section: any }) {
  const { section_key, content_json, id } = section;

  switch (section_key) {
    case 'hero':
      return <HeroSection key={id} data={content_json} />;
    case 'advocacy':
      return <AdvocacySection key={id} data={content_json} />;
    case 'gallery-1':
      return <GallerySection key={id} id="gallery-1" title={content_json?.title} subtitle={content_json?.subtitle} images={content_json?.images} caption={content_json?.caption} />;
    case 'about':
      return <AboutSection key={id} data={content_json} />;
    case 'education':
      return <EducationSection key={id} data={content_json} />;
    case 'experience':
      return <ExperienceSection key={id} data={content_json} />;
    case 'certifications':
      return <CertificationsSection key={id} data={content_json} />;
    case 'gallery-2':
      return <GallerySection key={id} id="gallery-2" title={content_json?.title} subtitle={content_json?.subtitle} images={content_json?.images} caption={content_json?.caption} />;
    case 'contact':
      return <ContactSection key={id} data={content_json} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  // 1. Fetch live CMS content from Supabase dynamically
  const { data: contentRows, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page_key', 'home')
    .eq('is_visible', true)
    .order('order_index', { ascending: true });

  const hasDynamicContent = contentRows && contentRows.length > 0;

  return (
    <main className="relative">
      <CustomCursor />
      <SlideNav />

      {/* 2. If DB has content, map the dynamic sections array.
          Otherwise, gracefully fallback to the static layout so the UI never breaks. */}
      {hasDynamicContent ? (
        contentRows.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <>
          <HeroSection />
          <AdvocacySection />
          <GallerySection
            id="gallery-1"
            title="In the Field"
            subtitle="Visual Stories"
            images={galleryImages1}
            caption="Moments captured during health advocacy campaigns and community outreach programmes across Nigeria."
          />
          <AboutSection />
          <EducationSection />
          <ExperienceSection />
          <CertificationsSection />
          <GallerySection
            id="gallery-2"
            title="Moments of Impact"
            subtitle="More Stories"
            images={galleryImages2}
            caption="From conferences to community health screenings — every moment counts in the journey towards health equity."
          />
          <ContactSection />
        </>
      )}
    </main>
  )
}
