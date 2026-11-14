# Slik redigerer du Norsk idrettsvitenskap selv

Nettstedet er bygget som HTML-filer i GitHub. For små tekstendringer trenger du ikke kodekompetanse eller et eget program.

## Den enkleste metoden: rediger i GitHub-nettleseren

1. Gå til [prosjektet i GitHub](https://github.com/gorpaulsen/gorpaulsen.github.io/tree/design/tidsskrift-forside-2026).
2. Åpne filen som inneholder teksten (se tabellen nedenfor).
3. Klikk **blyantikonet** («Edit this file»). Bruk søk (Ctrl+F) for å finne ordene du vil endre.
4. Erstatt bare ordene **mellom HTML-taggene**; behold selve `<h1>`, `<p>`, `<a>`, `href` og `class` urørt.
5. Klikk **Commit changes**, skriv for eksempel «Endre teksten på forsiden», og lagre endringen **direkte på utviklingsgrenen** `design/tidsskrift-forside-2026`. Ikke velg `main`.
6. For å se **det ferdige designet**, åpne utviklingsgrenen i GitHub, velg **Code → Download ZIP**, pakk ut mappen og dobbeltklikk `index.html`. Dette er en lokal kopi; last ned ZIP-filen på nytt etter senere endringer.

**Eksempel:** Dersom koden er `<h2>Et sted for faglig uenighet.</h2>`, kan du skrive `<h2>Faglig debatt</h2>`. Ikke fjern `<h2>` eller `</h2>`.

## Hvilken fil skal jeg endre?

| Innhold | Fil |
| --- | --- |
| Forsiden: tittel, ingress, publikasjonsområder | [index.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/index.html) |
| Pensumartikler og temaliste | [artikler.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler.html) |
| Populærvitenskapelig formidling | [trening-forklart.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/trening-forklart.html) |
| Originalforskning, reviews, metaanalyser | [vitenskap.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/vitenskap.html) |
| Debatt og kommentar | [debatt.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/debatt.html) |
| «Hva er tretthet?» | [artikler/tretthet.html](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/tretthet.html) |

De øvrige faglige disposisjonene ligger også i mappen `artikler`. Artikkeloversikten i `artikler.html` viser alle elleve temaene.

## Endre mange filer på én gang

I GitHub kan du trykke **punktum (.)** mens du er på prosjektets side. Da åpnes `github.dev` (en nettbasert kodeeditor). Bruk **Ctrl+Shift+F** til å søke etter tekst på tvers av filene. Endre teksten, og bruk **Source Control** til å lagre/committe og pushe endringene. Dette er mest aktuelt hvis et uttrykk finnes mange steder.

## Viktige avklaringer

- **Google Drive og ZIP:** ZIP-filen du har lastet opp til Google Drive, er en *kopi*. Endringer i kopien oppdaterer ikke automatisk nettstedet.
- **GitHub:** GitHub er originalen vi arbeider i. Endringer på utviklingsgrenen blir tilgjengelige når en ny ZIP er lastet ned, men ikke på `norskidrettsvitenskap.no`.
- **Publisering:** Når innholdet er gjennomgått, kan utviklingsgrenen senere slås sammen med `main` for å oppdatere den offentlige nettsiden.
- **Artikkelskisser:** Disposisjonene er ikke fagfellevurderte artikler. Det er viktig å skille mellom en tekstidé og en faktisk publisert vitenskapelig artikkel.

## Hva med å redigere uten HTML?

For jevnlig publisering av artikler anbefales et **redaksjonelt redigeringsgrensesnitt (CMS)** som lagrer innholdet som Markdown eller annen strukturert tekst i GitHub. Da kan du redigere overskrifter, avsnitt og referanser omtrent som i et tekstbehandlingsprogram, mens designet oppdateres automatisk. Dette krever en engangs ombygging og er **ikke satt opp ennå**.
