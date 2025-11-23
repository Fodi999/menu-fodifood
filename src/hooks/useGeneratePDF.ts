import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export function useGeneratePDF() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (fileName: string = 'CV_Dmytro_Fomin.pdf') => {
    setIsGenerating(true);
    
    try {
      // Создаём временный стиль для PDF с простыми цветами
      const tempStyle = document.createElement('style');
      tempStyle.id = 'pdf-temp-styles';
      tempStyle.textContent = `
        * {
          color: #1a1a1a !important;
          border-color: #d1d5db !important;
          background-color: transparent !important;
          box-shadow: none !important;
          text-shadow: none !important;
          background-image: none !important;
          background-clip: border-box !important;
        }
        body {
          background: #ffffff !important;
        }
        main {
          background: #ffffff !important;
        }
        [class*="bg-primary"], .bg-primary {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        [class*="text-primary"], .text-primary {
          color: #2563eb !important;
        }
        [class*="bg-muted"], .bg-muted {
          background-color: #f9fafb !important;
        }
        [class*="text-muted"], .text-muted, [class*="muted-foreground"] {
          color: #6b7280 !important;
        }
        .card, [class*="card"], [role="group"] {
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #111827 !important;
        }
        img {
          box-shadow: none !important;
          border-radius: 8px;
        }
        .gradient, [class*="gradient"] {
          background-image: none !important;
          background-color: #f3f4f6 !important;
        }
        [class*="shadow"], [class*="ring"] {
          box-shadow: none !important;
          ring: none !important;
        }
      `;
      document.head.appendChild(tempStyle);

      // Скрываем элементы которые не нужны в PDF
      const hideSelectors = [
        '.scroll-indicator',
        '[data-pdf-hide="true"]',
        'button',
        '.edit-controls',
        'nav',
        '.fixed',
        'header',
        '[class*="animate"]',
      ];

      const elementsToHide: Array<{ element: HTMLElement; display: string }> = [];
      hideSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el instanceof HTMLElement) {
            elementsToHide.push({ 
              element: el, 
              display: el.style.display 
            });
            el.style.display = 'none';
          }
        });
      });

      // Задержка для применения стилей
      await new Promise(resolve => setTimeout(resolve, 500));

      // Получаем контейнер main
      const mainElement = document.querySelector('main');
      if (!mainElement) {
        throw new Error('Main element not found');
      }

      // Конвертируем в canvas с отключением проблемных функций
      const canvas = await html2canvas(mainElement as HTMLElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        imageTimeout: 15000,
        allowTaint: true,
        foreignObjectRendering: false,
        windowWidth: 1200,
        windowHeight: mainElement.scrollHeight,
        ignoreElements: (element) => {
          // Игнорируем проблемные элементы
          const tagName = element.tagName;
          const classList = element.classList;
          
          return tagName === 'BUTTON' || 
                 tagName === 'NAV' ||
                 tagName === 'SCRIPT' ||
                 tagName === 'STYLE' ||
                 classList.contains('fixed') ||
                 classList.contains('absolute') && !classList.contains('avatar');
        },
        onclone: (clonedDoc) => {
          // Дополнительная очистка в клонированном документе
          const clonedMain = clonedDoc.querySelector('main');
          if (clonedMain) {
            // Убираем все анимации
            clonedDoc.querySelectorAll('[class*="animate"]').forEach(el => {
              el.classList.forEach(className => {
                if (className.includes('animate')) {
                  el.classList.remove(className);
                }
              });
            });
            
            // Убираем градиенты из текста
            clonedDoc.querySelectorAll('[class*="bg-clip-text"]').forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.backgroundClip = 'border-box';
                el.style.webkitBackgroundClip = 'border-box';
                el.style.color = '#111827';
              }
            });
          }
        },
      });

      // Создаем PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Добавляем первую страницу
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 2 * margin);

      // Добавляем дополнительные страницы если нужно
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 2 * margin);
      }

      // Удаляем временные стили
      tempStyle.remove();

      // Восстанавливаем элементы
      elementsToHide.forEach(({ element, display }) => {
        element.style.display = display;
      });

      // Сохраняем PDF
      pdf.save(fileName);

      toast.success('PDF został wygenerowany!', {
        description: 'Twoje CV zostało pomyślnie pobrane.',
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Удаляем временные стили если они остались
      const tempStyle = document.getElementById('pdf-temp-styles');
      if (tempStyle) tempStyle.remove();
      
      toast.error('Błąd podczas generowania PDF', {
        description: 'Spróbuj odświeżyć stronę i ponownie.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
}



