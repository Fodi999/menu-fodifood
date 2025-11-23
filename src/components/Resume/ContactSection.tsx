"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Phone, MapPin, Send, User, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useResume } from "@/contexts/ResumeContext";
import { EditableText } from "@/components/EditableText";

export function ContactSection() {
  const { resumeData, updateData, isEditMode } = useResume();
  const { contact } = resumeData;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Proszę wypełnić wszystkie pola", {
        className: "animate-shake",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Wiadomość została wysłana!", {
        description: "Skontaktuję się z Tobą wkrótce.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: "from-blue-500/20 to-blue-500/10",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
      color: "from-green-500/20 to-green-500/10",
    },
    {
      icon: MessageCircle,
      label: "Telegram",
      value: contact.telegram,
      href: `https://t.me/${contact.telegram.replace('@', '')}`,
      color: "from-cyan-500/20 to-cyan-500/10",
    },
    {
      icon: MapPin,
      label: "Lokalizacja",
      value: contact.location,
      href: "#",
      color: "from-red-500/20 to-red-500/10",
    },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center py-12 sm:py-16 md:py-20 px-4 bg-muted/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Send className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-semibold text-primary">Skontaktuj się ze mną</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent px-4">
            Kontakt
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Otwarty na dyskusję o ofertach pracy i współpracy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-primary/10 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
              <CardContent className="pt-6 overflow-x-hidden">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </motion.div>
                  Как со мной связаться
                </h3>
                <div className="space-y-3">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${info.color} hover:shadow-lg transition-all group border border-primary/5`}
                    >
                      <motion.div 
                        className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md flex-shrink-0"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <info.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm text-muted-foreground font-medium">
                          {info.label}
                        </p>
                        <div className="font-semibold group-hover:text-primary transition-colors break-words">
                          {isEditMode ? (
                            <EditableText
                              value={info.value}
                              multiline={info.label === "Lokalizacja"}
                              onSave={(newValue) => {
                                if (info.label === "Email") {
                                  updateData({ contact: { email: newValue } });
                                } else if (info.label === "Telefon") {
                                  updateData({ contact: { phone: newValue } });
                                } else if (info.label === "Telegram") {
                                  updateData({ contact: { telegram: newValue } });
                                } else if (info.label === "Lokalizacja") {
                                  updateData({ contact: { location: newValue } });
                                }
                              }}
                            />
                          ) : (
                            <a href={info.href} className="hover:underline break-words block">
                              {info.value}
                            </a>
                          )}
                        </div>
                      </div>
                      {!isEditMode && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="text-primary flex-shrink-0"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-primary/10 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
              <CardContent className="pt-6 overflow-x-hidden">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail className="w-5 h-5 text-primary" />
                  </motion.div>
                  Отправить сообщение
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Имя
                    </Label>
                    <motion.div
                      animate={{
                        scale: focusedField === "name" ? 1.02 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        id="name"
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className="mt-2 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <motion.div
                      animate={{
                        scale: focusedField === "email" ? 1.02 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className="mt-2 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Сообщение
                    </Label>
                    <motion.div
                      animate={{
                        scale: focusedField === "message" ? 1.02 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Textarea
                        id="message"
                        placeholder="Ваше сообщение..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className="mt-2 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      className="w-full group relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Clock className="w-4 h-4" />
                            </motion.div>
                            Отправка...
                          </>
                        ) : (
                          <>
                            Отправить
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Send className="w-4 h-4" />
                            </motion.div>
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
