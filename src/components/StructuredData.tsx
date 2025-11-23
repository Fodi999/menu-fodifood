"use client";

import { useResume } from "@/contexts/ResumeContext";
import { useEffect, useState } from "react";

export function StructuredData() {
  const { resumeData } = useResume();
  const { hero, experience, skills, contact } = resumeData;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Не рендерим на сервере, только на клиенте после монтирования
  if (!mounted) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.name,
    jobTitle: hero.role,
    description: hero.description,
    image: hero.avatar,
    email: hero.email,
    telephone: hero.phone,
    url: "https://fodifood.com",
    sameAs: [
      `https://t.me/${hero.telegram.replace('@', '')}`,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: contact.location.split(',')[0] || "Gdańsk",
      addressCountry: "PL",
    },
    alumniOf: {
      "@type": "Organization",
      name: "Culinary Professional",
    },
    knowsAbout: [
      ...skills.culinary,
      ...skills.technical,
    ],
    worksFor: experience.map(exp => ({
      "@type": "Organization",
      name: exp.company,
      description: exp.position,
    })),
    hasOccupation: {
      "@type": "Occupation",
      name: hero.role,
      description: hero.description,
      skills: [...skills.culinary, ...skills.soft],
      experienceRequirements: "20 years",
    },
  };

  const resumeStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: hero.name,
      jobTitle: hero.role,
      description: hero.description,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeStructuredData) }}
      />
    </>
  );
}
