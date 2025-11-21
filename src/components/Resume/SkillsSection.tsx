"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Users, Award, Cpu, Zap } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useResume } from "@/contexts/ResumeContext";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

function SkillCard({
  title,
  icon: Icon,
  items,
  delay = 0,
}: {
  title: string;
  icon: any;
  items: string[];
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-primary/10 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {items.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: delay + index * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <motion.span 
                  className="text-primary mt-1 text-lg"
                  whileHover={{ scale: 1.3, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  •
                </motion.span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SkillsSection() {
  const { resumeData } = useResume();
  const { skills } = resumeData;

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-semibold text-primary">Umiejętności</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent px-4">
            Umiejętności i doświadczenie
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Profesjonalne i osobiste kompetencje, które pomagają tworzyć
            wyjątkowe projekty kulinarne
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <SkillCard
            title="Umiejętności kulinarne"
            icon={ChefHat}
            items={skills.culinary}
            delay={0}
          />
          <SkillCard
            title="Soft Skills"
            icon={Users}
            items={skills.soft}
            delay={0.15}
          />
          <SkillCard
            title="Certyfikaty"
            icon={Award}
            items={skills.certificates}
            delay={0.3}
          />
          <SkillCard
            title="Technologie"
            icon={Cpu}
            items={skills.technical}
            delay={0.45}
          />
        </div>
      </div>
    </section>
  );
}
