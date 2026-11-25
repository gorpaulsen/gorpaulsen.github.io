# Modellavklaring: M0 → M1B → M2A versus tidligere M1/M2 på GitHub
**Status 24. november 2026. Arbeidsnotat, ikke empirisk validering.**

## To distinkte tomassefamilier

1. **M0 → M1B → M2A (Python)**: Direkte videreføring av M0s seriekoblede distale sene- og proksimale fjær. M1B har én distal masse som er begrenset til vertikal bevegelse; M2A legger til en proksimal aktuator med eksplisitt mekanisk arbeid i *én støttefase*. Den komplette kjørbare kildepakken, med M0, M1B, M2A og tester, ligger i [Drive: M1B_M2A_aktuator_arbeidspakke_2026-11-24.zip](https://drive.google.com/file/d/1DL0ym7O9KEeEb99km9S5kIynCgRqrHrc/view). Sjekksummene fra M1B er kontrollert. Python-pakken er foreløpig **ikke** kopiert fil-for-fil til GitHub.
2. **Tidligere GitHub-M1 og GitHub-M2 (JavaScript)**: `model.mjs` simulerer vertikal landing med to masser, og `model2d.mjs` simulerer en separat, hybrid 2D-modell med rigid fotkontakt og styrt beinsving. Disse er **ikke mekanisk ekvivalente** med M1B og skal ikke betegnes som direkte M0-utvidelser.

Ingen resultater fra disse to familiene bør sammenlignes som om alle øvrige antakelser var identiske.

## Hva som er kontrollert i den nye M2A-pakken

- Med aktuatorparameter A=0 gjenskapes M1B sin kontakttid (98,832535 ms) og hele vertikale kraftkurven.
- M2A-regnskapet holder `E_mekanisk + E_dissipert − W_aktuator ≈ konstant` ved én kontakt.
- Impulsbalansen i begge retninger er numerisk konsistent.
- Ved fraspark kan det estimeres hvor lenge et ballistisk massesenter vil bruke til å komme tilbake til inngangshøyden. Det beregnede avviket fra periodisk inngangshastighet rapporteres, ikke tvangstilpasses.
- Rask kontroll av halvert integrasjonssteg er gjennomført.

### Pilot: sprintersnitt M0 ved 10,36 m/s

Fast M1B-initiering: 75 kg, 8 % distal masse, 16 kN/m fjærbeinstivhet, distal demping ζ=0,25.

| Maks. aktuatorparameter A | Beregnet positivt arbeid | Distalt energitap | F første/andre halvdel |
|---:|---:|---:|---:|
| 0 N | 0,0 J | 35,4 J | 1,43 |
| 500 N | 36,9 J | 40,7 J | 1,20 |
| 1000 N | 74,1 J | 49,6 J | 1,02 |
| 2000 N | 150,0 J | 79,6 J | 0,77 |

En proksimal aktuator som bare tilfører arbeid under forlengelse, gir i dette eksemplet vesentlig lavere asymmetri når arbeidet øker. At tilført arbeid omtrent tilsvarer dempingstap **gir ikke** automatisk en periodisk løpsløsning. Timing og randbetingelser må inngå.

## Sentrale metodiske forbehold

- L2 i M1B oppnår forholdet 1,47 uten demping. Påstanden «demping er nødvendig for asymmetri» er derfor for sterk. For en nærmere spesifisert initialtilstand (Clarks ankelmarkørhastighet som modellens distalmassehastighet) var asymmetrien 1,09 uten demping.
- M0s eksakte match til 100 ms er en valgt kalibrering av beinstivhet, ikke uavhengig prediksjon.
- Clark–Ryan–Weyand (2017) bygger på et annet, delvis målingsstyrt tomasse-/impulssystem. `F_y=m_1(a_{1y}+g)+m_2(a_{2y}+g)` er en eksakt Newton-identitet, men alene ikke en validering av anatomisk kraftdeling.
- M1B estimerer m1s initialhastighet fra en filtrert **ankelmarkør**, som ikke automatisk kan likestilles med sentrumshastigheten for en hel distal masse.
- I motsetning til en periodisk modell er M2A fortsatt én støttefase. Nødvendige krav ved gjentatte steg: riktig vinkel/fotplassering og svingkinematikk, netto horisontal impuls=0 ved konstant fart, vertikal impuls=MgT, energi tilbake til periodisk tilstand samt eventuell motorens nettoarbeid og tap.

## Hva vi bør gjøre nå

1. Innhent samplingsfrekvens, koordinatsystem, filter, ankel-/fot-/leggmarkører og kontaktdefinisjon fra synkroniserte Qualisys-opptak. Der det finnes GRF, bør de også brukes.
2. Utvid M2A-aktuatoren med justerbar *timing*, arbeid og maksimumseffekt. Forhåndsdefiner ytelseskrav: asymmetri nær 1,55, kontakttid, delta-t1 og null horisontal impuls, vertikal periodisitet.
3. Gjør en periodisk shooting-/randverdiløser med full flytfase og nytt isett. Ingen manuelt «speilet» kraftkurve etter integrasjon.
4. Før videre GitHub-publisering: legg Python-kilde fra ZIP under egen `tomasse-loping/m0-m1b-m2a/` katalog med originale hasher, og kjør testene i CI. Behold tidligere JS-M2 uendret som alternativ.

**PR #6 forblir draft.** Ikke merge denne modellen inn i nettsidens `main` eller beskriv M2A som en periodisk sprintmodell.
