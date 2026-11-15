# Norsk idrettsvitenskap – nettsideutkast

Dette er et **arbeidsutkast** på GitHub-grenen `design/tidsskrift-forside-2026`. Den offentlige siden på `main` er ikke oppdatert.

## Grafisk profil

Den godkjente logoen er en mørkegrønn **N** med en kvinnelig løpersilhuett i lys grønn og en mannlig løpersilhuett i mørkere grønn, uten draktdetaljer. Logoen brukes konsekvent på nettstedets sider:

- `assets/niv-mark.svg`: symbolvariant for toppmeny og nettstedikon.
- `assets/niv-logo.svg`: full logo med ordmerke, vist under mandatet på forsiden.

Logoene er klargjort som skalerbare SVG-containere med integrerte, transparente PNG-motiver; de er ikke manuelt nytegnet som rene vektorbaner. Ved senere profesjonell logoferdigstilling bør de vektoriseres og kontrolleres for varemerke- og rettighetskonflikter. Endringer på utviklingsgrenen publiseres ikke automatisk på det offentlige domenet.


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

## To logovarianter

- **Logo 1 (hovedlogo):** Mørkegrønn N med kvinnelig og mannlig løpersilhuett. Brukes i toppmenyen, nettstedikonet og på presentasjonens forside. Ressurser: `assets/niv-mark.svg` og `assets/niv-logo.svg`.
- **Logo 2 (vitenskapelig symbol):** To buede kurver, akser og markert punkt. Brukes i temaseriens grønne forsidekort og som diskret markør på siden for vitenskapelige artikler. Ressurser: `assets/niv-graph-mark.svg`, `assets/niv-graph-mark-light.svg` og `assets/niv-graph-logo.svg`.

Grafen er **et stilisert symbol, ikke en framstilling av forskningsdata**. Begge logovariantene er forslag til visuell identitet; offentlig bruk bør forutgås av kontroll for likhet med eksisterende varemerker.

## Mulige fremtidige formidlingsformater

Under **Trening forklart** er **infografikk** og **podkast** presentert som mulige formidlingsformater, ikke lanserte tjenester. Infografikk skal gi sporbar, faglig kvalitetssikret visualisering; podkast skal ha kildeliste og tekstversjon. 2027-budsjettet vurderer tre nivåer: basis, basis med infografikk, og basis med infografikk og podkast. Beslutning forutsetter finansiering, ressurser og redaksjonell kvalitetssikring.

## Redaksjon, fagredaktører og fagfellepool

Se [redaksjon og fagfellevurdering](redaksjon.html). Den foreslåtte oppstartsmodellen omfatter **én ansvarlig redaktør, fire fagredaktører, vitenskapelig redaksjonsråd (3–5) og en fagfellepool på 30–40 forskere**. Fagredaktørene har delegert håndteringsansvar, mens ansvarlig redaktør har øverste ansvar for publiseringsbeslutninger. Verken navn eller roller er oppnevnt ennå.

Etter § 7 i utkastet til vedtekter oppnevnes ansvarlig redaktør av styret, redaksjonsrådet skal ha minst tre forskningskompetente medlemmer, og styret kan ikke instruere redaktøren i enkeltsaker. § 8 krever uavhengig fagfellevurdering for vitenskapelige artikler.

DOAJ veileder om minst **to uavhengige fagfeller** per vitenskapelig artikkel og anbefaler **minst fem kvalifiserte redaktører** i redaksjonskollegiet. Rekruttering, faglige habilitetsregler og skille mellom vitenskapelige artikler og øvrig formidling må være på plass før ordningen fremstilles som operativ.

## Nasjonalt institusjonssamarbeid

Dette er et **selvstendig hovedpunkt i mandatet**. Se [Nasjonalt samarbeid](samarbeid.html): en felles nasjonal arena for institusjoner med idrettsutdanning, idrettsvitenskapelige forskningsmiljøer og flerinstitusjonelle forskningsprosjekter.

**Eksisterende samordning:** UHR har allerede et Nasjonalt fagorgan for idrett og kroppsøving (oppført leder ved OsloMet). Det første steget er å avklare arbeidsdeling og mulig samarbeid før noen ny rådsstruktur etableres. En foreløpig institusjonsliste og invitasjonsplan er lagret som arbeidsdokumenter i prosjektmappen i Google Drive.

**Anbefalt modell under drøfting:** Styret beholder 3–5 medlemmer, valgt av årsmøtet med hensyn til faglig og institusjonell bredde. Alle relevante institusjoner kan foreslå kandidater, men det foreslås **ikke en automatisk styreplass for hver institusjon**. Deltakende institusjoner inviteres i stedet til å oppnevne én kontaktperson hver til et rådgivende *nasjonalt institusjonsråd*. Rådet kan ta initiativ til samarbeid og faglige prosjekter, men kan ikke instruere styret eller redaktøren i publiseringssaker.

Forslaget utvider ikke automatisk hvem som er medlemmer av foreningen; vedtektsutkast v1.1 gir medlemskap til **personer**. Endringer i institusjonsrepresentasjon må vedtas uttrykkelig. Uavhengig vitenskapelig redaksjon, institusjonsråd og foreningsstyre er tre forskjellige funksjoner.
