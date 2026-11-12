# Norsk idrettsvitenskap – utviklingsutkast

Dette er et **utkast til nettsted**, utviklet i GitHub-grenen `design/tidsskrift-forside-2026`.

## Innhold

- `index.html`: forside med tre publikasjonsområder og første artikkelserie.
- `artikler.html`: søkbart og kategorisert arkiv over planlagte artikkeltemaer.
- `artikler/*.html`: seks individuelle artikkelskisser med fungerende interne lenker, innholdsfortegnelse og utskriftsvisning.
- `styles.css`, `articles.css`: responsiv utforming.
- `site.js`: mobilmeny og dynamisk filtrering.

## Forhåndsvisning (lokalt)

1. Last ned utviklingsgrenen som ZIP fra GitHub og pakk ut.
2. Åpne `index.html` i en nettleser. Lenker og filtrering fungerer uten server.
3. Eventuelt start en lokal server fra mappen: `python -m http.server 8000` og åpne `http://localhost:8000/`.

## Redaksjonell status

Alle artikkelsider er **skisser til videre faglig arbeid**. De er ikke ferdige, fagfellevurderte vitenskapelige artikler eller godkjent pensumlitteratur. Sidene har derfor ikke forfatter, DOI, referanselister eller publiseringsdato. Det er heller ikke aktivert manusinnsending.

## Publisering

Ikke slå sammen utkastet med `main` før innhold og design er gjennomgått og redaksjonelle rutiner avklart. GitHub Pages bruker eksisterende domeneoppsett i `CNAME`, som ikke endres her. Utviklingsgrenen endrer ikke den offentlige forsiden.
