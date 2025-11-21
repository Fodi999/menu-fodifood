"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, Building2, ListChecks, Trophy, Circle } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";

function ExperienceItem({
  experience,
  index,
}: {
  experience: {
    id: string;
    period: string;
    position: string;
    company: string;
    responsibilities: string[];
    achievements: string[];
  };
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Timeline line */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        style={{ transformOrigin: "top" }}
      />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
        className="absolute left-0 top-2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/20 group-hover:scale-125 transition-transform"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <Card className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group-hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-card to-card/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md"
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            >
              <Briefcase className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex-1">
              <motion.p 
                className="text-sm font-medium text-primary mb-1 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                <Calendar className="w-4 h-4" />
                {experience.period}
              </motion.p>
              <h3 className="text-xl md:text-2xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {experience.position}
              </h3>
              <p className="text-primary font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {experience.company}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <ListChecks className="w-4 h-4 text-primary" />
                </span>
                Обязанности:
              </h4>
              <ul className="space-y-2">
                {experience.responsibilities.map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="text-sm text-muted-foreground flex items-start gap-3 group/item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.2 + 0.6 + i * 0.1 }}
                  >
                    <motion.div 
                      className="text-primary mt-1"
                      whileHover={{ scale: 1.3 }}
                    >
                      <Circle className="w-2 h-2 fill-current" />
                    </motion.div>
                    <span className="group-hover/item:text-foreground transition-colors">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.2 + 0.7 }}
            >
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </span>
                Достижения:
              </h4>
              <ul className="space-y-2">
                {experience.achievements.map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="text-sm text-muted-foreground flex items-start gap-3 group/item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.2 + 0.8 + i * 0.1 }}
                  >
                    <motion.div 
                      className="text-primary mt-0.5"
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      transition={{ type: "spring" }}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                    </motion.div>
                    <span className="group-hover/item:text-foreground transition-colors font-medium">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ExperienceSection() {
  const { resumeData } = useResume();
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Doświadczenie zawodowe</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            20 lat profesjonalnej pracy w restauracjach w różnych krajach
          </p>
        </motion.div>

        <div className="relative">
          {experience.map((exp, index) => (
            <ExperienceItem key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
