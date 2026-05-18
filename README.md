# PlayerSignal 🎮

**Gaming Sentiment Intelligence Platform** — aplikacja do analizy nastrojów społeczności graczy po premierze gier.

## O projekcie

PlayerSignal to narzędzie dla redaktorów gamingowych, które automatycznie analizuje recenzje użytkowników z platformy RAWG i generuje raporty sentymentu dla każdej gry. Zamiast ręcznie przeglądać setki recenzji, redaktor wpisuje tytuł gry i w kilka sekund otrzymuje:

- **Wynik sentymentu** (0–100) z wizualnym wskaźnikiem
- **Rozkład nastrojów** — % pozytywnych, mieszanych i negatywnych recenzji
- **Wykryte sygnały** — słowa kluczowe dominujące w recenzjach
- **Podgląd każdej recenzji** z indywidualnym wynikiem

## Stack technologiczny

- **React 18** + **Vite 5** — nowoczesny frontend
- **RAWG API** — baza danych gier + recenzje użytkowników
- **Analiza sentymentu** — własny silnik (bez zewnętrznych bibliotek AI)

---

## Uruchomienie lokalne

```bash
# 1. Wejdź do folderu projektu
cd playersignal

# 2. Zainstaluj zależności
npm install

# 3. Uruchom serwer deweloperski
npm run dev

# 4. Otwórz http://localhost:5173
```

---

## Wdrożenie na Netlify przez GitHub

### Krok 1 — Utwórz repozytorium GitHub

1. Wejdź na [github.com](https://github.com) i zaloguj się
2. Kliknij **+** → **New repository**
3. Nadaj nazwę, np. `playersignal`
4. Kliknij **Create repository**

### Krok 2 — Wgraj kod na GitHub

Otwórz terminal (np. Git Bash lub PowerShell) w folderze `playersignal`:

```bash
git init
git add .
git commit -m "Initial commit - PlayerSignal"
git branch -M main
git remote add origin https://github.com/TWOJA_NAZWA/playersignal.git
git push -u origin main
```

> Zamień `TWOJA_NAZWA` na swoją nazwę użytkownika GitHub.

### Krok 3 — Połącz z Netlify

1. Wejdź na [netlify.com](https://netlify.com) i zaloguj się (możesz przez GitHub)
2. Kliknij **Add new site** → **Import an existing project**
3. Wybierz **GitHub** i autoryzuj dostęp
4. Wybierz repozytorium `playersignal`
5. Netlify automatycznie wykryje ustawienia z `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Kliknij **Deploy site**

Po 1–2 minutach aplikacja będzie dostępna pod automatycznie wygenerowanym adresem (np. `https://playersignal-xyz.netlify.app`).

---

## Struktura projektu

```
playersignal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Nagłówek z zegarem i statusem
│   │   ├── SearchBar.jsx     # Pole wyszukiwania
│   │   ├── GameCard.jsx      # Karta wyniku wyszukiwania
│   │   ├── SentimentGauge.jsx  # Wskaźnik sentymentu (łuk SVG)
│   │   └── SentimentReport.jsx # Główny raport analizy
│   ├── rawg.js               # Serwis RAWG API
│   ├── sentiment.js          # Silnik analizy sentymentu
│   ├── App.jsx               # Główny komponent
│   ├── main.jsx              # Punkt wejścia
│   └── index.css             # Style globalne
├── index.html
├── vite.config.js
├── netlify.toml
└── package.json
```

---

*Projekt zaliczeniowy — PlayerSignal v1.0*
