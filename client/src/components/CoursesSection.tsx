import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getCoursesConfig, getLocalCoursesConfig } from "@/lib/coursesStorage";
import type { CoursesConfig } from "@/data/defaultCourses";

export default function CoursesSection() {
  const sectionRef = useScrollReveal();
  const [config, setConfig] = useState<CoursesConfig>(getLocalCoursesConfig);

  useEffect(() => {
    getCoursesConfig().then(setConfig);

    const onUpdate = () => getCoursesConfig().then(setConfig);
    window.addEventListener("courses-updated", onUpdate);
    return () => window.removeEventListener("courses-updated", onUpdate);
  }, []);

  const { sectionTitle, sectionSubtitle, courses } = config;

  return (
    <section id="courses" className="py-20 bg-white" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {sectionTitle}
          </h2>
          <p className="text-lg text-foreground/60">{sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {courses.slice(0, 3).map((course, i) => (
            <div key={course.id} className="scroll-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <CourseCard
                title={course.title}
                description={course.description}
                tools={course.tools}
                originalPrice={course.originalPrice}
                discountPrice={course.discountPrice}
                instructorImage=""
                instructorName=""
                badge={course.badge}
                badgeColor={course.badgeColor}
                backgroundImage={course.backgroundImage}
                detailPath={course.detailPath}
              />
            </div>
          ))}
        </div>

        {courses.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.slice(3).map((course, i) => (
              <div key={course.id} className="scroll-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <CourseCard
                  title={course.title}
                  description={course.description}
                  tools={course.tools}
                  originalPrice={course.originalPrice}
                  discountPrice={course.discountPrice}
                  instructorImage=""
                  instructorName=""
                  badge={course.badge}
                  badgeColor={course.badgeColor}
                  backgroundImage={course.backgroundImage}
                  detailPath={course.detailPath}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
