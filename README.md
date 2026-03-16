# Per Voi

Piccolo sito statico personale in HTML, CSS e JavaScript.

## Media nel repository

- immagini e audio stanno nel repository Git normale
- i video in `assets/video/` sono tracciati con **Git LFS**
- il tracking LFS è definito in `.gitattributes`

## Nota importante sul deploy

Se pubblichi il sito con **GitHub Pages**, i video tracciati con Git LFS possono non essere serviti correttamente.
In pratica la pagina può vedere il file pointer LFS invece del video reale.

### Soluzioni consigliate

1. **hosting esterno dei video**
   - GitHub Releases
   - Cloud storage/CDN
   - YouTube non in elenco / Drive pubblico
2. **cambiare hosting del sito** verso una piattaforma che serve correttamente gli asset richiesti
3. **convertire i video in MP4 più compatibili** se vuoi massimizzare il supporto browser

## Pubblicazione GitHub Pages (pronta)

Il repository contiene un workflow GitHub Actions in `.github/workflows/deploy-pages.yml`.
Il deploy:

- parte su push su `main`
- scarica i file LFS (`git lfs pull`)
- pubblica artefatto statico su GitHub Pages

### Attivazione (una volta sola)

1. apri il repository su GitHub
2. vai su **Settings -> Pages**
3. in **Build and deployment**, scegli **Source: GitHub Actions**
4. fai un push su `main` (o lancia il workflow manualmente)

### URL previsto

Per questo repository l'URL pubblico atteso e' di tipo:

`https://maton111.github.io/per-voi/`

## File web aggiunti per produzione

- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- meta SEO/Open Graph/Twitter in `index.html`

## Quando cambi dominio o URL

Aggiorna questi punti:

- `index.html` -> `link rel="canonical"`, `og:url`, `og:image`, `twitter:image`
- `robots.txt` -> riga `Sitemap:`
- `sitemap.xml` -> valore `<loc>`

## Stato attuale

- i riferimenti video in `index.html` sono allineati ai file reali
- il lightbox mostra un fallback leggibile se un video non può essere riprodotto
- `main` è stato aggiornato e i video sono stati pushati con Git LFS
