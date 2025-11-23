"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, Building2, ListChecks, Trophy, Circle } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { EditableText } from "@/components/EditableText";
import { EditableSkillsList } from "@/components/EditableSkillsList";

function ExperienceItem({
  experience,
  index,
  onUpdate,
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
  onUpdate: (field: string, value: any) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0 group"
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
        className="absolute left-0 top-1.5 sm:top-2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary border-3 sm:border-4 border-background shadow-lg shadow-primary/20 group-hover:scale-125 transition-transform"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <Card className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group-hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-card to-card/50 overflow-hidden">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-4 sm:pb-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
            <motion.div 
              className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md flex-shrink-0"
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            >
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </motion.div>
            <div className="flex-1 min-w-0 w-full">
              <motion.div 
                className="text-xs sm:text-sm font-medium text-primary mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 flex-wrap"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-words">
                  <EditableText
                    value={experience.period}
                    onSave={(newValue) => onUpdate('period', newValue)}
                  />
                </span>
              </motion.div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent break-words">
                <EditableText
                  value={experience.position}
                  onSave={(newValue) => onUpdate('position', newValue)}
                />
              </h3>
              <div className="text-sm sm:text-base text-primary font-semibold flex items-start gap-1.5 sm:gap-2 break-words">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">
                  <EditableText
                    value={experience.company}
                    onSave={(newValue) => onUpdate('company', newValue)}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ListChecks className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </span>
                Obowiązki:
              </h4>
              <EditableSkillsList 
                items={experience.responsibilities} 
                onUpdate={(newItems) => onUpdate('responsibilities', newItems)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.2 + 0.7 }}
            >
              <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </span>
                Osiągnięcia:
              </h4>
              <EditableSkillsList 
                items={experience.achievements} 
                onUpdate={(newItems) => onUpdate('achievements', newItems)}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ExperienceSection() {
  const { resumeData, updateData } = useResume();
  const { experience } = resumeData;

  const handleUpdateExperience = (expId: string, field: string, value: any) => {
    const updatedExperience = experience.map(exp => 
      exp.id === expId ? { ...exp, [field]: value } : exp
    );
    updateData({ experience: updatedExperience });
  };

  return (
    <section id="experience" className="min-h-screen flex items-center py-12 sm:py-16 md:py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto w-full">
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
            <ExperienceItem 
              key={exp.id} 
              experience={exp} 
              index={index}
              onUpdate={(field, value) => handleUpdateExperience(exp.id, field, value)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
