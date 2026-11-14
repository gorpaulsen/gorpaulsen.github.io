# Norsk idrettsvitenskap – nettsideutkast

Dette er et **arbeidsutkast** på GitHub-grenen `design/tidsskrift-forside-2026`. Den offentlige siden på `main` er ikke oppdatert.

[**Slik redigerer du tekstene selv i GitHub**](REDIGERING.md) · [**Faglig mandat og prinsipper**](MANDAT.md)

## Hovedstruktur

Nettstedet organiseres i **fire redaksjonelle områder**, mens faglige artikkeltemaer kan deles inn i underkategorier.

| Område | Side | Innhold / redaksjonelt formål |
| --- | --- | --- |
| Pensum og faggrunnlag | `artikler.html` | Faglige grunnlagsartikler for utdanning; artikkelutkast og kritiske kunnskapsvurderinger |
| Trening forklart | `trening-forklart.html` | Populærvitenskapelig formidling for allmennhet, trenere og utøvere |
| Vitenskapelige artikler | `vitenskap.html` | Originalstudier og oversiktsartikler: narrative/kritiske reviews, systematiske reviews og metaanalyser når relevant |
| Debatt og kommentar | `debatt.html` | Debattinnlegg, faglige kommentarer samt replikk og tilsvar |

**Viktig kategoriskille:** Originalforskning og oversiktsartikler er *publikasjonstyper*. Pensum er en *tiltenkt anvendelse/målgruppe*. En vitenskapelig oversiktsartikkel kan derfor også være egnet som pensumlitteratur. En metaanalyse er en statistisk syntesemetode, ikke en garanti for kvalitet.

### Planlagt første artikkelserie

`artikler.html` har søk og filtrering for fire emnegrupper:
- **Begreper og definisjoner**: tretthet; styrke; utholdenhet; motorikk og motorisk læring.
- **Modeller og mekanismer**: superkompensasjon og treningsprinsippene; laktat og treningsresponser; vevsskade og treningstilpasning; inflammasjon ved trening; restitusjon, reparasjon og treningstilpasning.
- **Effekter av trening**: helseeffekter, prestasjonseffekter og fysiologiske tilpasninger.
- **Utøverutvikling**: fra barn til senior.

De elleve individuelle disposisjonene under `artikler/` er **redaksjonelle skisser**, ikke ferdige eller fagfellevurderte vitenskapelige artikler.

## Filer

- `index.html`: forside og inngang til de fire publikasjonsområdene.
- `artikler.html`: oversikt over planlagte pensumtemaer.
- `artikler/*.html`: elleve artikkeldisposisjoner med innholdsfortegnelse og interne lenker.
- `trening-forklart.html`: populærvitenskap, under utvikling.
- `vitenskap.html`: originalforskning, reviews og metaanalyser – foreløpige redaksjonelle standarder.
- `debatt.html`: debatt og kommentar – foreløpige redaksjonelle prinsipper.
- `styles.css` og `articles.css`: responsiv utforming.
- `site.js`: mobilnavigasjon, søk og emnefiltre.

## Åpne en fungerende forhåndsvisning

Den tidligere foreslåtte tredjepartstjenesten for HTML-forhåndsvisning er fjernet fra prosjektanvisningene fordi lenkene ikke fungerte pålitelig.

**Følg disse trinnene for å se det komplette nettstedet med design og fungerende interne lenker:**

1. Åpne [GitHub-prosjektets utviklingsgren](https://github.com/gorpaulsen/gorpaulsen.github.io/tree/design/tidsskrift-forside-2026).
2. Kontroller at grenen øverst heter **`design/tidsskrift-forside-2026`** – ikke `main`.
3. Klikk den grønne **Code**-knappen og velg **Download ZIP**.
4. Høyreklikk ZIP-filen i Windows og velg **Pakk ut alle**.
5. Åpne mappen og dobbeltklikk **`index.html`**. Nettstedet åpnes i nettleseren.

Dette er en lokal kopi. Endringer i GitHub blir synlige i den lokale kopien først etter at du har lastet ned en ny ZIP.

### Les eller rediger enkeltfiler i GitHub

GitHubs filvisning er en **kodevisning**, ikke en ferdig designvisning:

- [Forsiden (`index.html`)](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/index.html)
- [Artikkeloversikten (`artikler.html`)](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler.html)
- [Vevsskade og treningstilpasning](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/vevsskade-tilpasning.html)
- [Inflammasjon ved trening](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/inflammasjon-trening.html)
- [Restitusjon, reparasjon og treningstilpasning](https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/restitusjon-adaptasjon.html)

Vi kan senere sette opp en **egen nettbasert forhåndsvisning** på en separat adresse uten å endre `main` eller det offentlige domenet. En slik forhåndsvisning er ennå ikke konfigurert.

## Før publisering

Det er **ikke** etablert innsending eller behandling av manuskripter, DOI, redaksjon, formelle retningslinjer for fagfellevurdering eller publiserte artikler. Den faglige og redaksjonelle kvalitetssikringen må avklares før lansering.

Ikke slå sammen grenen med `main` før innhold, design og publiseringsrutiner er gjennomgått. Filen `CNAME` for `norskidrettsvitenskap.no` skal forbli urørt frem til publisering.
