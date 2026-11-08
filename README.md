# Trener · Siłownia

Aplikacja treningowa dla telefonu z Chrome (Android). Nie wymaga serwera ani konta. Działa jako strona internetowa, którą instalujesz na ekranie głównym.

## Zawartość

- `index.html` – cała aplikacja
- `manifest.json` – nazwa, ikona i tryb pełnoekranowy
- `sw.js` – zapis aplikacji, dzięki czemu otwiera się również bez internetu
- `icons/` – ikony aplikacji

## 1. Wgranie na GitHub

1. Zaloguj się na github.com i kliknij **New repository**. Nazwij je np. `silownia`.
2. Wybierz **Public**. GitHub Pages w darmowym koncie działa tylko z publicznymi repozytoriami.
3. Kliknij **Add file → Upload files** i przeciągnij na stronę pliki `index.html`, `manifest.json`, `sw.js` oraz cały folder `icons`. Kliknij **Commit changes**.

## 2. Włączenie strony

1. W repozytorium wejdź w **Settings → Pages**.
2. W polu **Source** wybierz **Deploy from a branch**, branch **main**, folder **/ (root)** i kliknij **Save**.
3. Po 1–3 minutach strona będzie pod adresem `https://TWOJ-LOGIN.github.io/silownia/`.

## 3. Instalacja na telefonie (Chrome)

1. Otwórz ten adres w Chrome.
2. Dotknij **⋮** (trzy kropki) w prawym górnym rogu.
3. Wybierz **Zainstaluj aplikację** lub **Dodaj do ekranu głównego**, a potem **Zainstaluj**.
4. Na ekranie pojawi się ikona Siłowni. Otwiera się bez paska adresu, jak zwykła aplikacja.

## 4. Aktualizacja aplikacji

Wgraj nowy `index.html` do repozytorium pod tą samą nazwą (Add file → Upload files → Commit changes). Przy następnym otwarciu z internetem aplikacja pobierze nową wersję. Jeśli zmian nie widać, zamknij aplikację i otwórz ją ponownie.

## 5. Dane treningowe

- Dane zapisują się w przeglądarce, na tym telefonie, dla tego adresu.
- Nie przenoszą się automatycznie z wersji w claude.ai ani na inny telefon.
- Regularnie rób kopię: **Ustawienia i edycja planu → Dane → Eksport**. Przywrócisz ją przyciskiem **Import**.
- Nie czyść danych przeglądarki dla tej strony, bo wtedy znikną treningi.
- Eksport na telefonie otwiera menu udostępniania. Plik możesz zapisać w Plikach albo na Dysku Google.
