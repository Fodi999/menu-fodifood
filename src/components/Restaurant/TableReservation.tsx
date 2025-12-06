'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Phone, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { toast } from 'sonner';

export function TableReservation() {
  const { isEditMode } = useRestaurant();
  
  const [sectionData, setSectionData] = useState({
    title: 'Zarezerwuj stolik',
    subtitle: 'Gwarantujemy najlepsze miejsce i indywidualną obsługę',
  });

  const [benefits, setBenefits] = useState([
    {
      id: 1,
      icon: Calendar,
      title: 'Wygodna rezerwacja',
      description: 'Wybierz dogodną datę i godzinę online. Potwierdzimy rezerwację w ciągu 15 minut.',
    },
    {
      id: 2,
      icon: Users,
      title: 'Dowolna liczba gości',
      description: 'Od romantycznej kolacji dla dwojga po wielkie przyjęcie do 20 osób.',
    },
    {
      id: 3,
      icon: Clock,
      title: 'Elastyczny harmonogram',
      description: 'Czynne codziennie od 10:00 do 22:00. Ostatnia rezerwacja o 21:00.',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (field: string, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  const handleBenefitUpdate = (id: number, field: string, value: string) => {
    setBenefits(prev => prev.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Отправить бронь на backend
      console.log('📅 Reservation Data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Спасибо! Ваша бронь принята. Мы свяжемся с вами для подтверждения.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '2',
      });
    } catch (error) {
      toast.error('Ошибка при отправке брони. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            <EditableText
              value={sectionData.title}
              onSave={(value) => handleUpdate('title', value)}
              
              className="text-3xl sm:text-4xl font-bold"
            />
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            <EditableText
              value={sectionData.subtitle}
              onSave={(value) => handleUpdate('subtitle', value)}
              
              className="text-base sm:text-lg md:text-xl text-muted-foreground"
            />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">
                      <EditableText
                        value={benefit.title}
                        onSave={(value) => handleBenefitUpdate(benefit.id, 'title', value)}
                        
                        className="font-bold text-base sm:text-lg"
                      />
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <EditableText
                        value={benefit.description}
                        onSave={(value) => handleBenefitUpdate(benefit.id, 'description', value)}
                        
                        multiline
                        className="text-sm sm:text-base text-muted-foreground"
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-xl">
              <div className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Twoje imię *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Jan Kowalski"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="+48 123 456 789"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Godzina *
                    </label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    >
                      <option value="">Wybierz</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                      <option value="21:00">21:00</option>
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Liczba gości *
                  </label>
                  <select
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'gość' : i === 1 || i === 2 || i === 3 ? 'gości' : 'gości'}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2 mt-2 text-sm sm:text-base py-2.5 sm:py-3"
                  disabled={isSubmitting || !formData.name || !formData.phone || !formData.date || !formData.time}
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isSubmitting ? 'Wysyłanie...' : 'Zarezerwuj stolik'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Pola wymagane. Skontaktujemy się w celu potwierdzenia rezerwacji.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
