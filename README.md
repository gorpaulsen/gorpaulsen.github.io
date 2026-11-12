# Norsk idrettsvitenskap – utviklingsutkast

Dette er et **utkast til nettsted**, utviklet i GitHub-grenen `design/tidsskrift-forside-2026`.

## Innhold

- `index.html`: forside med fire publikasjonsområder og første artikkelserie.
- `vitenskap.html`: vitenskapelige originalartikler og oversiktsartikler (narrative og systematiske reviews; metaanalyser der relevant). Beskriver metodiske krav og forskjellen fra pensum som bruksområde.
- `debatt.html`: fjerde publikasjonsområde med debattinnlegg, faglige kommentarer og replikker/tilsvar. Foreløpige redaksjonelle prinsipper; ingen innsending er aktivert.
- `artikler.html`: søkbart og kategorisert arkiv over planlagte artikkeltemaer.
- `artikler/*.html`: seks individuelle artikkelskisser med fungerende interne lenker, innholdsfortegnelse og utskriftsvisning.
- `styles.css`, `articles.css`: responsiv utforming.
- `site.js`: mobilmeny og dynamisk filtrering.

## Nettbasert forhåndsvisning (ingen publisering på hoveddomenet)

Åpne sidene direkte i nettleseren via HTML Preview, som leser de **offentlig tilgjengelige** filene i utviklingsgrenen:

- [Forsiden](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/index.html)
- [Artikkeloversikt](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler.html)
- [Forskning og oversiktsartikler](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/vitenskap.html)
- [Debatt og kommentar](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/debatt.html)
- [Eksempelartikkel: Hva er tretthet?](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/tretthet.html)

**Merk:** HTML Preview er en ekstern tredjepartsvisning, ikke GitHub Pages. Tjenesten henter HTML, CSS og JavaScript fra GitHub og kan ha begrensninger; den er bare ment for demonstrasjon. Ikke skriv inn personopplysninger eller andre sensitive data. Ved feil, bruk lokal forhåndsvisning nedenfor.

Lenkene følger utviklingsgrenen og endrer ikke `main`, `CNAME` eller innholdet på norskidrettsvitenskap.no.

## Forhåndsvisning (lokalt)

1. Last ned utviklingsgrenen som ZIP fra GitHub og pakk ut.
2. Åpne `index.html` i en nettleser. Lenker og filtrering fungerer uten server.
3. Eventuelt start en lokal server fra mappen: `python -m http.server 8000` og åpne `http://localhost:8000/`.

## Redaksjonell status

Alle artikkelsider er **skisser til videre faglig arbeid**. Vitenskaps- og debattsidene er forslag til redaksjonell organisering, ikke åpne kanaler for publisering. De er ikke ferdige, fagfellevurderte vitenskapelige artikler eller godkjent pensumlitteratur. Sidene har derfor ikke forfatter, DOI, referanselister eller publiseringsdato. Det er heller ikke aktivert manusinnsending.

## Publisering

Ikke slå sammen utkastet med `main` før innhold og design er gjennomgått og redaksjonelle rutiner avklart. GitHub Pages bruker eksisterende domeneoppsett i `CNAME`, som ikke endres her. Utviklingsgrenen endrer ikke den offentlige forsiden.
