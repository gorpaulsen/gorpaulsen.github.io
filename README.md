# Norsk idrettsvitenskap – nettsideutkast

Dette er et **arbeidsutkast** på GitHub-grenen `design/tidsskrift-forside-2026`. Den offentlige siden på `main` er ikke oppdatert.

[**Slik redigerer du tekstene selv i GitHub**](REDIGERING.md)

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
- **Modeller og mekanismer**: superkompensasjon og treningsprinsippene; laktat, muskelskade og adaptasjon.
- **Effekter av trening**: helseeffekter, prestasjonseffekter og fysiologiske tilpasninger.
- **Utøverutvikling**: fra barn til senior.

De åtte individuelle disposisjonene under `artikler/` er **redaksjonelle skisser**, ikke ferdige eller fagfellevurderte vitenskapelige artikler.

## Filer

- `index.html`: forside og inngang til de fire publikasjonsområdene.
- `artikler.html`: oversikt over planlagte pensumtemaer.
- `artikler/*.html`: åtte artikkeldisposisjoner med innholdsfortegnelse og interne lenker.
- `trening-forklart.html`: populærvitenskap, under utvikling.
- `vitenskap.html`: originalforskning, reviews og metaanalyser – foreløpige redaksjonelle standarder.
- `debatt.html`: debatt og kommentar – foreløpige redaksjonelle prinsipper.
- `styles.css` og `articles.css`: responsiv utforming.
- `site.js`: mobilnavigasjon, søk og emnefiltre.

## Nettbasert forhåndsvisning

Disse lenkene bruker en **ekstern** HTML-viser som leser offentlig tilgjengelige filer direkte fra GitHub. Dette er ikke en egen GitHub Pages-utgivelse.

- [Forsiden](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/index.html)
- [Pensum og faggrunnlag](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler.html)
- [Trening forklart](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/trening-forklart.html)
- [Vitenskapelige artikler](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/vitenskap.html)
- [Debatt og kommentar](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/debatt.html)
- [Eksempel på artikkelskisse: Hva er tretthet?](https://htmlpreview.github.io/?https://github.com/gorpaulsen/gorpaulsen.github.io/blob/design/tidsskrift-forside-2026/artikler/tretthet.html)

HTML-viseren er en tredjepartstjeneste og kan ha tekniske begrensninger. Ikke bruk skjemaer der eller oppgi personopplysninger. Den faktiske visningen er ikke nettlesertestet.

## Lokal forhåndsvisning

1. Last ned utviklingsgrenen som ZIP fra GitHub og pakk ut.
2. Åpne `index.html` i nettleseren.
3. Eventuelt start `python -m http.server 8000` og åpne `http://localhost:8000/`.

## Før publisering

Det er **ikke** etablert innsending eller behandling av manuskripter, DOI, redaksjon, formelle retningslinjer for fagfellevurdering eller publiserte artikler. Den faglige og redaksjonelle kvalitetssikringen må avklares før lansering.

Ikke slå sammen grenen med `main` før innhold, design og publiseringsrutiner er gjennomgått. Filen `CNAME` for `norskidrettsvitenskap.no` skal forbli urørt frem til publisering.
