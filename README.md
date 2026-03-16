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

## Stato attuale

- i riferimenti video in `index.html` sono allineati ai file reali
- il lightbox mostra un fallback leggibile se un video non può essere riprodotto
- `main` è stato aggiornato e i video sono stati pushati con Git LFS

