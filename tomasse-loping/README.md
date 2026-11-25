# Tomassemodell for landing – M1 (eksperimentell)

**Ny M2-prototype på samme utviklingsgren:** [2D-interaktiv visning](2d.html) · [M2-metodenotat](README-M2.md) · [beregningskjerne](model2d.mjs). M1-koden er bevart uendret.

**Status: dynamisk, én-dimensjonal prototype. Ikke validert som løpe- eller sprintmodell.**

Dette prosjektet ligger i `gorpaulsen/gorpaulsen.github.io` i egen utviklingsgren og er **ikke** en endring i den publiserte fjærbeinmodellen. Den er heller ikke en kopi av Clark, Ryan og Weyands tomassemodell fra 2017. Den studien dekomponerte målte vertikale kraftforløp i to overlappende masse-/impulsbidrag, gitt målte kontakt- og svevtider og distal akselerasjon. **Denne prototypen løser derimot bevegelseslikninger for to koblede masser.**

## Formål

Teste om en eksplisitt distal masse, en komprimerbar intern fjær og en ettergivende bakkekontakt kan generere en tidlig vertikal landingsrespons; undersøke parameterfølsomhet uten å bryte Newtons lover eller energiregnskap.

**Avgrensning:** Kun vertikal landing over et tidsvindu på 0,30 s. Ingen horisontal løpshastighet, fotens vinkel, svingbein, automatisk fraspark, syklisk periodisitet, aktiv muskulær aktuator eller metabolsk beregning. Standardverdiene for stivhet/demping er pedagogiske og ikke hentet ved individuell kalibrering.

## Kildekode og filstruktur

- `model.mjs` – ren JS-modul med RK4-integrator, Newtons lover, energibalanse, énmassekontroll og oppsummeringsmål
- `index.html` – interaktive parametere, vertikal kraftkurve, masseposisjoner og kvalitetssjekker
- `tests/test-model.mjs` – regresjonstester for enheter/fortegn, impuls, passiv energibalanse og tidsstegfølsomhet

## Kjør lokalt

Fra rotkatalogen i repoet:

```bash
node tomasse-loping/tests/test-model.mjs
python -m http.server 8000
```

Åpne `http://localhost:8000/tomasse-loping/`. Filen importerer `./model.mjs`, og en lokal HTTP-server unngår begrensninger ved `file://`.

## Tilstandsvariabler og likninger

La `z1, v1` beskrive den distale massen og `z2, v2` den øvre massen. Positiv retning er oppover:

```
m1 = alpha*m                  m2 = (1-alpha)*m
C = max(0, l0-(z2-z1))        P = max(0, -z1)
delta = 0.005 m (kontinuerlig aktivering av viskøs motstand)
Fleg = kleg*C + cleg*max(0,v1-v2)*C/(C+delta)
Fground = kground*P + cground*max(0,-v1)*P/(P+delta)

m1*a1 = Fground-Fleg-m1*g
m2*a2 = Fleg-m2*g
```

Den interne kraften opptrer med motsatte fortegn på de to massene og kanselleres ved summering:

```
Fground - m*g = m1*a1 + m2*a2.
```

### Energi

```
E = (m1*v1²+m2*v2²)/2 + g*(m1*z1+m2*z2)
  + kleg*C²/2 + kground*P²/2 + Ediss
dEdiss/dt = cleg*max(0,v1-v2)²*C/(C+delta) + cground*max(0,-v1)²*P/(P+delta)
```

Cumulative dissipation and elastic energy are tracked so `E(t) ≈ E(0)` is a numerical conservation test. Potential energy includes arbitrary zero; the physically relevant quantity is the difference `E(t)-E(0)`.

Et standardscenario benytter 75 kg, distal masseandel 8 %, `kleg=16 kN/m`, `kground=240 kN/m`, `cleg=200 Ns/m`, `cground=1300 Ns/m`, distal initialfart `−2,0 m/s` og øvre initialfart `−0,7 m/s` (negative = nedover).

**Merk:** Den distale massen er ikke nødvendigvis anatomisk hele leggen/foten i hvert segmenteringssystem. En parameterandel på 8 % er fra Clark mfl. (2017) som illustrasjon, ikke som bevis på at vår dynamiske modell er kalibrert.

## Første kvalitetstester

For standardscenario:
- første vertikale bakkekontakt ved ca. 23,7 ms
- maksimal vertikal bakkekraft ca. 3,85 × kroppsvekt (BW)
- akkumulert disipasjon ved 300 ms ca. 44,3 J
- maksimalt energibalanseavvik ca. 0,00005 J
- numerisk impulsbalanseavvik ca. +0,0006 N·s
- reduksjon av tidssteg fra 0,10 til 0,05 ms endrer beregnet topp med under 0,001 %

**Dette er genererte modellverdier, ikke målte sprintdata.** Et meget lite energiregnskapsavvik er bare en numerisk konsistenskontroll og ikke en empirisk validering.

## Veien til en faktisk løpemodell

1. **M1, landingsmodul:** Kontroller fortegn, impuls, energi, påvirkning av tidssteg og om den tidlige krafttoppen avhenger av distal masse/hastighet. Ferdig som prototype, men ikke validert.
2. **M2, 2D-hybridmodell:** Horisontal+vertikal bevegelse, masseposisjoner, fotisett og fraspark, hendelsesdeteksjon, flytfase og neste landing. Test samlet vertikal impuls `mg*T` og netto horisontal impuls for periodiske steg på plant underlag.
3. **M3, aktivt system:** Kraft-/arbeidsbegrenset aktuator, separat ledd-/MTU-mekanikk, samt streng energibalanse.
4. **Empiri:** Konfronter hele kraftkurver, særlig første/andre kontakthalvdel, mot Fukuchi 2017 (2,5–4,5 m/s) og en egen sprintdatabase ved 7–11 m/s. Forhåndsdefiner trenings- og testutvalg for kalibrering.

## Kilder

- Blickhan, R. (1989). *The spring-mass model for running and hopping*. J Biomech. DOI [10.1016/0021-9290(89)90224-8](https://doi.org/10.1016/0021-9290(89)90224-8).
- Clark, K. P. & Weyand, P. G. (2014). *Are running speeds maximized with simple-spring stance mechanics?* J Appl Physiol. DOI [10.1152/japplphysiol.00174.2014](https://doi.org/10.1152/japplphysiol.00174.2014).
- Clark, K. P., Ryan, L. J. & Weyand, P. G. (2017). *A general relationship links gait mechanics and running ground reaction forces*. J Exp Biol 220:247–258. DOI [10.1242/jeb.138057](https://doi.org/10.1242/jeb.138057). Deres tomasse-/impulsmodell har annen modellarkitektur enn koden her.

## Endringspolicy

`main` er publisert referanse. Den nye koden ligger inntil videre bare i `feature/tomasse-loping-m1`. **Ikke slå sammen PR-en** før numeriske og empiriske kriterier er godkjent og vi har avklart om 1D-landingsmodulen skal omtales som et eget undervisningsverktøy eller være en del av en samlet 2D-løpemodell.
