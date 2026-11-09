# Silownia plan treningowy – aplikacja na Androida (PWA)

W paczce: `index.html` (aplikacja), `manifest.webmanifest`, `sw.js` (praca offline), folder `icons/`, `.gitlab-ci.yml` (tylko dla GitLaba).
Pliki nie zawierają żadnych Twoich danych – wpisy zostają w pamięci telefonu.

## 1. Wystaw aplikację pod adresem https

### GitHub Pages (prościej)
1. github.com → **New repository** → nazwa np. `kalendarz-pracy`, widoczność **Public** → Create repository.
2. **uploading an existing file** → przeciągnij `index.html`, `manifest.webmanifest`, `sw.js` i cały folder `icons` → **Commit changes**.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, Branch: `main`, folder `/ (root)` → Save.
4. Po minucie, dwóch aplikacja działa pod `https://TWOJ-LOGIN.github.io/kalendarz-pracy/`.

### GitLab Pages
1. **New project → Create blank project**, nazwa np. `kalendarz-pracy`.
2. Wgraj `index.html`, `manifest.webmanifest`, `sw.js`, `icons/`. Plik `.gitlab-ci.yml` utwórz przyciskiem **+ → New file** i wklej:

```yaml
pages:
  stage: deploy
  script:
    - mkdir public
    - cp -r index.html manifest.webmanifest sw.js icons public/
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

3. Po zakończeniu pipeline'u adres znajdziesz w **Deploy → Pages**. Jeśli projekt jest prywatny, w **Settings → General → Visibility** ustaw dostęp do Pages na **Everyone** (aplikacja nie zawiera danych), inaczej telefon nie zainstaluje aplikacji.
4. GitLab bywa, że prosi o weryfikację konta przed pierwszym pipeline'em.

## 2. Instalacja na telefonie
1. Otwórz adres w **Chrome** na Androidzie.
2. Menu ⋮ → **Zainstaluj aplikację** (lub **Dodaj do ekranu głównego → Zainstaluj**).
3. Uruchamiaj z ikony „Kalendarz" – otwiera się w osobnym oknie, bez paska przeglądarki. Po pierwszym wejściu działa też bez internetu.

## 3. Dane
- Dane zapisują się automatycznie w pamięci tej aplikacji na telefonie.
- Przeniesienie z obecnej wersji: w starym pliku **Eksportuj dane**, w zainstalowanej aplikacji **Importuj dane**.
- Co jakiś czas rób **Eksportuj dane** jako kopię zapasową. Wyczyszczenie danych witryny w Chrome lub odinstalowanie aplikacji kasuje wpisy.

## 4. Aktualizacja
Podmień `index.html` w repozytorium (wgraj plik o tej samej nazwie). Po wejściu do aplikacji z internetem nowa wersja załaduje się sama; jeśli nie, zamknij i otwórz aplikację jeszcze raz.
