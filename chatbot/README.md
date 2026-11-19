# Spør Norsk idrettsvitenskap – intern pilot

Status per 19.11.2026: **kodeprototype, ikke publisert eller driftsatt**.
Utvikles isolert i GitHub-grenen `feature/niv-chatbot-pilot-2026-11-19`.
`main` og den eksisterende nettsideprototypen er ikke publisert på nytt.

## Hva som er bygget

- `chatbot.js` og `chatbot.css`: tilgjengelig chatpanel på alle sider som inkluderer `site.js`.
- Uten server vises en tydelig merket **demomodus** med tre forhåndsskrevne eksempler. Fritekstspørsmål får aldri et oppdiktet AI-svar.
- `worker/src/index.js`: Cloudflare Worker med OpenAI Responses API, CORS-allowlist, inputgrenser, Cloudflare-rate-limit og `store: false`.
- `worker/src/retrieval.js`: enkel **leksikalsk** kildegjenfinning, med avgrenset normalisering av biomekaniske faguttrykk. Dette er ikke en semantisk vektordatabase.
- `worker/src/answer.js`: OpenAI Structured Outputs med eksplisitt påstandstype (`definisjon`, `observasjon`, `fortolkning`, `anbefaling`), minst én kilde per faglig påstand og obligatoriske begrensninger.
- `worker/src/sources.js`: 11 **faglige disposisjoner**, utdrag hentet fra nettstedets egne artikkelsider. Alle er merket **ikke fagfellevurdert**. Ingen original-PDF-er eller interne Drive/Dropbox-filer er tatt inn.
- `worker/test/`: tester for søk, manglende evidens, CORS, rate-limit, API-lagringsvalg, påstandstype, kilde-ID-er og en kuratert testliste med **24 spørsmål** (inkludert spørsmål utenfor korpuset).

Kildehenvisninger som [1] viser **disposisjoner på nettstedet**, ikke originalvitenskapelige publikasjoner. Piloten må ikke omtales som en fullstendig vitenskapelig kunnskapsbase.

## Lokal test (uten API-tilkobling)

Åpne prosjektet i en lokal terminal, gå til repo-roten og kjør:

```sh
python -m http.server 8000
```

Åpne `http://localhost:8000/`. Chatpanelet vises nederst til høyre. Uten Worker og API-nøkkel er funksjonen en eksplisitt demonstrasjon.

## Lokal test med AI-backend

1. Gå til `chatbot/worker/` og kjør `npm install`.
2. Kopier `.dev.vars.example` til `.dev.vars`, og sett en **egen API-nøkkel med begrenset budsjett** i `OPENAI_API_KEY`. Filen er gitignorert. **Ikke legg nøkkelen i GitHub, HTML eller JavaScript.**
3. Kjør `npm test`, deretter `npm run dev`. Worker lytter normalt på `http://localhost:8787`.
4. Kjør nettsiden i en annen terminal fra repo-roten: `python -m http.server 8000`.
5. Åpne **eksakt** `http://localhost:8000`. `chatbot.js` finner da `http://localhost:8787/chat` automatisk.

Bruk av API krever egen API-tilgang og medfører kostnader. Uten en gyldig nøkkel fungerer kun demotekstene.

## Sikkerhet før eventuell ekstern tilgang

**Ikke deploy denne Worker-en som offentlig API.** Koden avviser alle forespørsler som ikke kommer til en lokal server (`localhost`/`127.0.0.1`) i eksplisitt `PILOT_MODE=local`. Konfigurasjonen har `workers_dev=false`. Før fremtidig ekstern pilot må en egen, autentisert arkitektur bygges og testes.

- Et fremtidig eksternt endepunkt må beskyttes med **verifisert** autentisering, eksempelvis Cloudflare Access/JWT-validering eller en tilsvarende sikker reverse proxy. Den eksisterende Worker-en implementerer **ikke** ekstern autentisering. CORS og uverifiserte forespørselshoder er ikke tilgangskontroll.
- Sett `ALLOWED_ORIGIN` i `wrangler.toml` til nøyaktig opprinnelse for et adgangsbegrenset testmiljø. Standard er bevisst bare localhost.
- Juster `namespace_id` for rate-limit så den er unik i Cloudflare-kontoen. `6` forespørsler/minutt er et startpunkt, **ikke** et garantert økonomisk forbrukstak.
- Opprett et separat OpenAI-prosjekt og kontroller budsjett, rate limits, tillatte modeller og API-nøkkelens tilganger.
- Sett API-nøkkel med `npx wrangler secret put OPENAI_API_KEY`, aldri i `[vars]`.
- For en faktisk distribusjon legges i nettsidens `<head>`: `<meta name="niv-chat-endpoint" content="https://DIN-BESKYTTEDE-ENDPOINT/chat">`. **Ikke** legg til dette før tilgang, personvern og kostnadskontroll er prøvd.
- Ingen samtalelogg er implementert i kodeprototypen. Hosting- og API-leverandørenes egen behandling og eventuelle logger må vurderes i en personvern- og behandlingsprotokoll før deling med eksterne deltakere.
- Spør aldri brukerne om personopplysninger, helsedata eller annet sensitivt innhold. Vi må vurdere DPIA/behandlingsgrunnlag etter faktisk bruk.
- `workers_dev = false` og lokalvertsperre er aktivert for å unngå utilsiktet offentlig drift. Ikke kjør `wrangler deploy` eller slå på ekstern tilgang før en separat sikkerhetsgjennomgang.

## Vitenskapelig QA / lanseringskriterier

1. Kildene må etter hvert oppgraderes fra disposisjoner til redaksjonelt godkjente tekster og kontrollerte primærpublikasjoner.
2. Gjennomfør minst 30–50 blindede testspørsmål: dekning, faktakorrekthet, støtte på påstandsnivå, falske DOI/referanser, metodebevissthet, håndtering av ukjent spørsmål.
3. Evaluer også spørsmål utenfor korpus: ingen «fakta» skal konstrueres når kilder mangler.
4. Innfør et versjonert kilderegister med DOI, dokumentstatus, lisens, fagansvarlig, publisert/oppdatert dato og kildeendringer.
5. Først etter faglig og teknisk godkjenning: vurder søk med OpenAI vector stores / annen semantisk indeksering, der **kun godkjente** dokumenter indekseres.

## Kjente begrensninger

- Leksikalsk søk kan overse synonymer og feiltolke tematisk likhet som støtte. Modellen kan formulere uriktige påstander selv når riktig utkast er hentet.
- Den strukturerte svarformen krever en gyldig kildeliste **for hver påstand**, og viser type påstand og eksplisitte begrensninger. Den tekniske kontrollen påviser **ikke** om kildeutdraget faktisk støtter selve utsagnet. For slik vitenskapelig kontroll må fagpersoner vurdere påstand og primærpublikasjon.
- Ingen eksterne fagfellevurderte originalartikler er verifisert eller inkludert.
- Ingen integrasjon med GitHub Pages-produksjonen, Cloudflare-konto, betalingsoppsett eller publisert domene er aktivert.

## Teknologi

Eksisterende HTML/CSS/JS på nettsiden, Cloudflare Workers og OpenAI Responses API. API-kall gjøres kun fra Worker. Dagens backend er bevisst en avgrenset, sporbar kodepilot – ikke et autonomt litteratursøk.

## Kvalitetskontroll 19.11.2026

En syntaktisk kontroll av frontend, Worker og kildekontrollmodul er gjennomført. En **simulert** forespørselsflyt bekreftet:

- 24 av 24 manuelt merkede spørsmål ble håndtert som forventet av det leksikalske søket. Spørsmål om arbeidsøkonomi, kalibrering og behandling av skade avvises fordi testkorpuset ikke dekker dem.
- Gyldige strukturerte svar har kilde-ID, påstandstype og begrensningsavsnitt.
- Ugyldig kilde-ID avvises; modellens utilstrekkelig-svar og spørsmål utenfor korpus gir ikke konstruert faglig konklusjon.
- Forespørsler mot ikke-lokal vert avvises også når Origin-hodet er godkjent.
- Den konstruerte API-forespørselen har `store: false` og `text.format.type = json_schema`.

**Dette er ikke samme kontroll som `npm test` i ekte Node- og Wrangler-miljø, og det er ikke gjennomført live API-test med modell.** Begge deler gjenstår før intern end-to-end-testing.
