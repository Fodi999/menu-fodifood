# 📝 Przewodnik po trybie edycji (Edit Mode Guide)

## 🔐 Aktywacja trybu edycji

1. **Przewiń na dół strony** - w prawym dolnym rogu zobaczysz panel admin
2. **Wprowadź hasło**: `admin123`
3. **Kliknij "Разблокировать"** (Odblokuj)
4. Pojawi się czerwony pasek na górze: **"Режим редактирования активен"**

---

## 🎨 Co możesz edytować?

### 1️⃣ **Hero Section (Sekcja główna)**

#### ✏️ Teksty:
- **Imię i nazwisko** - kliknij na "Dmytro Fomin"
- **Stanowisko** - kliknij na "Szef Kuchni / Chef"
- **Opis** - kliknij na długi tekst z opisem
- **Email, telefon, telegram** - kliknij na przyciski

#### 🖼️ Zdjęcie profilowe:
- Najedź na awatar
- Kliknij ikonę edycji
- Wybierz:
  - **Wklej URL** - wstaw link do zdjęcia
  - **Upload** - prześlij plik (będzie wyświetlony jako data URL)

---

### 2️⃣ **Skills Section (Umiejętności)**

Każda karta ma edytowalne elementy:

#### ➕ Dodawanie:
- Na dole listy kliknij **"Dodaj umiejętność"**
- Wpisz nazwę i zatwierdź ✓

#### ✏️ Edycja:
- Najedź na element listy
- Kliknij ikonę ołówka (Edit2)
- Zmień tekst i zatwierdź ✓

#### 🗑️ Usuwanie:
- Najedź na element listy
- Kliknij ikonę kosza (Trash2)
- Element zostanie usunięty (minimum 1 musi pozostać)

**4 kategorie:**
- 👨‍🍳 Umiejętności kulinarne
- 👥 Soft Skills
- 🏆 Certyfikaty
- 💻 Technologie

---

### 3️⃣ **Experience Section (Doświadczenie)** ⚠️ *W trakcie implementacji*

Obecnie doświadczenie można edytować tylko przez:
1. Tryb edycji → Resetuj dane
2. Ręczna edycja w `src/types/resume.ts`

**Planowane funkcje:**
- Edycja okresów pracy
- Edycja stanowisk i firm
- Edycja obowiązków i osiągnięć
- Dodawanie/usuwanie pozycji

---

### 4️⃣ **Portfolio Section (Wybrane prace)** ✅

#### ➕ Dodawanie nowego dania:
1. W trybie edycji pojawi się **karta "Dodaj nowe danie"**
2. Kliknij na nią
3. Automatycznie utworzy się nowy element z:
   - Tytuł: "Nowe danie"
   - Kategoria: "Kategoria"
   - Zdjęcie: placeholder

#### ✏️ Edycja istniejącego:
- **Zdjęcie**: Najedź i kliknij ikonę edycji
  - Wklej URL lub prześlij plik
- **Kategoria**: Kliknij na badge na górze (np. "Sushi")
- **Tytuł**: Najedź na kartę → w overlay kliknij na nazwę

#### 🗑️ Usuwanie:
- W prawym górnym rogu karty pojawi się przycisk 🗑️
- Kliknij aby usunąć (minimum 1 element musi pozostać)

**Wskazówki:**
- Lepsze zdjęcia = lepsze wrażenie
- Używaj kategorii: Sushi, Sety, Główne, Napoje, Desery
- Krótkie, chwytliwe nazwy dań

---

### 5️⃣ **Contact Section (Kontakt)**

W sekcji kontaktowej edytujesz:
- **Email** - kliknij na pole email
- **Telefon** - kliknij na numer
- **Telegram** - kliknij na @username
- **Adres** - kliknij na lokalizację

---

## 💾 Zapisywanie

**Automatyczne zapisywanie:**
- Każda zmiana jest **natychmiast zapisywana** w `localStorage`
- Nie musisz klikać "Zapisz"
- Dane pozostają nawet po odświeżeniu strony

---

## 🔄 Reset do wartości domyślnych

Jeśli coś pójdzie nie tak:

1. W panelu admin kliknij przycisk **↻** (obok Редактировать)
2. Potwierdź: "Сбросить все данные к значениям по умолчанию (Dmytro Fomin)?"
3. Wszystkie dane wrócą do oryginalnych

**UWAGA:** To usunie WSZYSTKIE Twoje zmiany!

---

## 🚪 Wyjście z trybu edycji

**Opcja 1:** Kliknij 🔒 (Lock) w prawym dolnym rogu

**Opcja 2:** Kliknij ✖️ "Выйти" w czerwonym pasku na górze

---

## ⚙️ Techniczne szczegóły

### Komponenty edytowalne:

#### `EditableText`
- Używany do: imię, email, telefon, opisy
- Kliknij → edytuj → Enter lub ✓ aby zapisać
- Escape lub ✖️ aby anulować

#### `EditableImage`
- Używany do: avatar, zdjęcia portfolio
- Dwa warianty:
  - `variant="avatar"` - okrągły (Hero)
  - `variant="portfolio"` - kwadratowy (Portfolio)

#### `EditableSkillsList`
- Lista z możliwością dodawania/usuwania/edycji
- Animacje przy dodawaniu/usuwaniu

### Gdzie są dane?

- **Wyświetlane**: `src/types/resume.ts` → `defaultResumeData`
- **Zapisane**: `localStorage.resumeData`
- **Kontekst**: `src/contexts/ResumeContext.tsx`

---

## 🐛 Rozwiązywanie problemów

### Problem: Zdjęcie nie ładuje się
**Rozwiązanie:**
1. Sprawdź czy URL jest poprawny
2. Użyj direct image URL (np. z imgur, cloudinary)
3. Unikaj linków wymagających autentykacji

### Problem: Zmiany znikają po odświeżeniu
**Rozwiązanie:**
1. Sprawdź czy localStorage nie jest zablokowany
2. Otwórz Console (F12) → Application → Local Storage
3. Sprawdź czy jest klucz `resumeData`

### Problem: Nie mogę wejść w tryb edycji
**Rozwiązanie:**
1. Upewnij się że hasło to: `admin123`
2. Sprawdź czy nie ma błędów w konsoli
3. Odśwież stronę (Ctrl+Shift+R)

### Problem: Stare dane (Иван Иванов) nadal widoczne
**Rozwiązanie:**
1. Otwórz Console (F12)
2. Wpisz: `localStorage.clear()`
3. Odśwież stronę
4. Lub użyj przycisku ↻ Reset w trybie admin

---

## 🎯 Najlepsze praktyki

### Zdjęcia:
- ✅ Używaj obrazów 800x800px lub większych
- ✅ Format: JPG, PNG, WEBP
- ✅ Kompresuj przed uploadem
- ✅ Używaj CDN (imgur, cloudinary)

### Teksty:
- ✅ Krótkie i treściwe opisy
- ✅ Używaj polskiego języka (lub preferowanego)
- ✅ Sprawdź pisownię przed zapisaniem
- ✅ Używaj emoji oszczędnie (jeśli w ogóle)

### Portfolio:
- ✅ Minimum 3-6 najlepszych prac
- ✅ Różnorodne kategorie
- ✅ Wysokiej jakości zdjęcia
- ✅ Opisowe nazwy ("Sushi Philadelphia" > "Sushi 1")

---

## 📱 Responsywność

Tryb edycji działa na:
- ✅ Desktop (pełna funkcjonalność)
- ⚠️ Tablet (może być niewygodny)
- ❌ Mobile (nie zalecane - za małe przyciski)

**Rekomendacja:** Edytuj na komputerze, przeglądaj na telefonie

---

## 🔐 Bezpieczeństwo

**Obecne:**
- Hasło: `admin123` (hardcoded)
- Tylko frontend protection
- Brak autentykacji backendowej

**Dla produkcji (TODO):**
- [ ] Przenieś hasło do `.env`
- [ ] Dodaj hash hasła
- [ ] Implementuj JWT tokens
- [ ] Backend API do zapisywania
- [ ] Rate limiting

**UWAGA:** To rozwiązanie jest dla osobistego portfolio. W wersji produkcyjnej dla klientów potrzebna jest prawdziwa autentykacja!

---

## 📞 Kontakt

Jeśli potrzebujesz pomocy:
- Email: fodi85999@gmail.com
- Telegram: @fodifood
- GitHub Issues: [Fodi999/menu-fodifood](https://github.com/Fodi999/menu-fodifood)

---

**Ostatnia aktualizacja:** 23 listopada 2025
**Wersja:** 1.0.0
