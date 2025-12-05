-- Create portfolio table (single-user portfolio)
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    theme VARCHAR(100) NOT NULL DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default portfolio
INSERT INTO portfolio (slug, theme, data)
VALUES (
    'dmytro-fomin',
    'default',
    '{
        "hero": {
            "name": "Dmytro Fomin",
            "title": "Szef Kuchni / Chef",
            "bio": "Profesjonalny kucharz z 20-letnim doświadczeniem w pracy w restauracjach w różnych krajach: Polsce, Litwie, Estonii, Niemczech, Francji i Kanadzie. Specjalizuję się w tworzeniu nowych produktów, kontroli jakości i szkoleniu personelu.",
            "avatar": "/00029.jpg",
            "email": "fodi85999@gmail.com",
            "phone": "+48 576 212 418",
            "location": "Gdańsk, Polska",
            "telegram": "@fodifood",
            "github": "",
            "linkedin": "",
            "website": "",
            "available": true
        },
        "skills": [
            {
                "id": "1",
                "name": "Owoce morza",
                "level": 95,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "2",
                "name": "Kuchnia autorska",
                "level": 90,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "3",
                "name": "Opracowywanie nowych produktów",
                "level": 95,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "4",
                "name": "Badanie jakości produktów",
                "level": 90,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "5",
                "name": "Boulangerie & Patisserie",
                "level": 85,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "6",
                "name": "Konfigurowanie procesów produkcyjnych",
                "level": 88,
                "category": "Umiejętności kulinarne"
            },
            {
                "id": "7",
                "name": "Celowy i towarzyski",
                "level": 90,
                "category": "Soft Skills"
            },
            {
                "id": "8",
                "name": "Odporny na stres",
                "level": 95,
                "category": "Soft Skills"
            },
            {
                "id": "9",
                "name": "Pomysłowy i kreatywny",
                "level": 92,
                "category": "Soft Skills"
            },
            {
                "id": "10",
                "name": "Szkolenie personelu",
                "level": 90,
                "category": "Soft Skills"
            },
            {
                "id": "11",
                "name": "Zarządzanie zespołem",
                "level": 88,
                "category": "Soft Skills"
            },
            {
                "id": "12",
                "name": "Znajomość produktów",
                "level": 95,
                "category": "Soft Skills"
            }
        ],
        "experience": [
            {
                "id": "1",
                "company": "Boulangerie Patisserie WAWEL",
                "position": "Kucharz",
                "location": "Montreal, Canada",
                "startDate": "2022-12-01",
                "endDate": "2023-08-01",
                "current": false,
                "description": "Praca w piekarni-cukierni, produkcja wypieków i deserów, kontrola jakości produktów, praca w międzynarodowym zespole",
                "responsibilities": ["Praca w piekarni-cukierni", "Produkcja wypieków i deserów", "Kontrola jakości produktów", "Praca w międzynarodowym zespole"],
                "achievements": ["Opanowanie technik boulangerie i patisserie", "Doświadczenie pracy w Kanadzie"]
            },
            {
                "id": "2",
                "company": "Restauracja Charlemagne",
                "position": "Kucharz - Owoce morza",
                "location": "Agde, Francja",
                "startDate": "2022-06-10",
                "endDate": "2022-11-16",
                "current": false,
                "description": "Specjalizacja w owocach morza, przygotowanie dań z świeżych produktów morskich",
                "responsibilities": ["Specjalizacja w owocach morza", "Przygotowanie dań z świeżych produktów morskich", "Praca w restauracji śródziemnomorskiej", "Utrzymanie standardów jakości"],
                "achievements": ["Doświadczenie w kuchni francuskiej", "Specjalizacja w owocach morza"]
            },
            {
                "id": "3",
                "company": "FISH in HOUSE",
                "position": "Szef Kuchni",
                "location": "Dniepr, Ukraina",
                "startDate": "2018-06-10",
                "endDate": "2022-06-01",
                "current": false,
                "description": "Opracowywanie nowych produktów, badanie jakości i zwiększanie trwałości, zakup urządzeń do procesów produkcyjnych",
                "responsibilities": ["Opracowywanie nowych produktów", "Badanie jakości i zwiększanie trwałości", "Zakup urządzeń do procesów produkcyjnych", "Szkolenie personelu i HACCP", "Konfigurowanie procesów produkcyjnych"],
                "achievements": ["Zwiększenie wolumenów sprzedaży", "Wdrożenie systemu HACCP", "Optymalizacja procesów produkcyjnych", "Rozwinięcie nowych linii produktowych"]
            },
            {
                "id": "4",
                "company": "Restauracja Autorska Miód Malina",
                "position": "Kucharz",
                "location": "Zgorzelec, Polska",
                "startDate": "2017-05-01",
                "endDate": "2018-05-20",
                "current": false,
                "description": "Przygotowanie dań kuchni autorskiej, praca w restauracji",
                "responsibilities": ["Przygotowanie dań kuchni autorskiej", "Praca w restauracji", "Współpraca z zespołem kuchennym"],
                "achievements": ["Doświadczenie w kuchni polskiej", "Praca w restauracji autorskiej"]
            }
        ],
        "education": [],
        "certifications": [
            {
                "id": "1",
                "name": "Dyplomowany kucharz z wyróżnieniem",
                "issuer": "",
                "date": "",
                "credentialId": ""
            },
            {
                "id": "2",
                "name": "HACCP",
                "issuer": "",
                "date": "",
                "credentialId": ""
            },
            {
                "id": "3",
                "name": "Sprawozdanie z badań Nr. 17061/562/2023",
                "issuer": "",
                "date": "2023",
                "credentialId": "17061/562/2023"
            },
            {
                "id": "4",
                "name": "Staż w restauracji Charlie''s",
                "issuer": "Charlie''s Restaurant",
                "date": "",
                "credentialId": ""
            }
        ],
        "portfolio": [
            {
                "id": "1",
                "title": "Sushi Philadelphia",
                "description": "Sushi",
                "image": "/products/philadelphia.jpg",
                "link": "",
                "tags": ["Sushi"],
                "category": "Sushi"
            },
            {
                "id": "2",
                "title": "California Roll",
                "description": "Sushi",
                "image": "/products/california.jpg",
                "link": "",
                "tags": ["Sushi"],
                "category": "Sushi"
            },
            {
                "id": "3",
                "title": "Nigiri z łososiem",
                "description": "Sushi",
                "image": "/products/nigiri-salmon.jpg",
                "link": "",
                "tags": ["Sushi"],
                "category": "Sushi"
            },
            {
                "id": "4",
                "title": "Mix Set",
                "description": "Sety",
                "image": "/products/mix-set.jpg",
                "link": "",
                "tags": ["Sety"],
                "category": "Sety"
            },
            {
                "id": "5",
                "title": "Napoje",
                "description": "Napoje",
                "image": "/products/cola.jpg",
                "link": "",
                "tags": ["Napoje"],
                "category": "Napoje"
            }
        ]
    }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);
