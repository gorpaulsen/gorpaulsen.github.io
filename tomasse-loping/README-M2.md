# M2 – todimensjonal hybrid tomassemodell (utviklingsversjon)

**Status 23.11.2026:** Regne- og visningsmodell implementert på `feature/tomasse-loping-m1`. Dette er **ikke** en validert sprintmodell, og `main` er uendret.

**Filer:** `model2d.mjs` (beregninger), `2d.html` (interaktiv visning), `tests/test-model2d.mjs` (automatiske tester).
Tidligere `model.mjs`, `index.html` og `tests/test-model.mjs` er bevart som M1.

## Hva er faktisk nytt fra M1?

M1 beregner én vertikal landing med en deformérbar kontakt med underlaget. M2 legger til:

1. Et todimensjonalt koordinatsystem, med `x` horisontalt og `y` vertikalt.
2. Én distal punktmasse `m_f` og én overkroppsmasse `m_b`; sum `M`.
3. En *hybrid* veksling mellom stiv, ikke-glidende standfase og fri bevegelse i svevfasen.
4. En eksplisitt, styrt beinsving som er kilde til **positivt og negativt aktuatorarbeid**.
5. Fotlanding som en støthendelse med eksplisitt impuls og kinetisk energitap.
6. Impuls-/bevegelsesmengdebalanse i både horisontal og vertikal retning samt samlet energiregnskap.

### Viktig anatomisk presisering

**Dette er ikke en anatomisk modell med to bein.** Den samme distale massen flyttes fram igjen mellom støttene; beinsvingen styres etter en gitt bane. Den er derfor verken prediksjon av svingtid, automatisk stabil gangart eller en komplett simulering av sprintprestasjon. `bodyVX` er *initial* horisontal fart, ikke en påtvunget eller konstant fart.

## 1. Bevegelseslikninger under standfase

Definer `m_f = alpha*M`, `m_b=(1-alpha)*M`; `r=(x_b-x_f,y_b-y_f)`, `L=|r|`, `e=r/L`.
Beinet har en komprimerbar, men ikke trekkfast fjær-/demperkomponent:

```
C = max(0, L_rest - L)
F_leg = max(0, k_leg*C - c_leg*(dL/dt)*C/(C+delta))
```

Tidsavledningen `dL/dt` er positiv ved forlengelse. Demperen virker under både kompresjon og forlengelse, men er glatt slått av når `C → 0`. I tilfeller der summen ellers ville vært negativ, er aksial kraft null.

I *standfasen* er foten stasjonær: `x_f = konstant`, `y_f = 0`, `v_f = 0`. Bevegelseslikningene for den større massen er:

```
m_b * a_bx = F_leg*e_x
m_b * a_by = F_leg*e_y - m_b*g
```

Kontaktreaksjonen som kreves av fotens geometriske binding, er:

```
R_x = F_leg*e_x
R_y = m_f*g + F_leg*e_y
```

Den ikke-glidende bindingen er bare fysisk mulig dersom `R_y >= 0` og `|R_x| <= mu*R_y`. Modellen **flagger** brudd, men har ennå ingen egen glidemodus. Variabelen `maxFrictionUsage` er maksimalt beregnet `|R_x|/(mu*R_y)`.

### Toe-off-hendelse

Når den aksiale fjæren ikke lenger er komprimert, og overkroppen beveger seg forbi foten med økende avstand, frigjøres foten til svev. Fjærenergien er da null, slik at frigjøringen ikke skaper mekanisk energi. Det kreves en aktiv bevegelse for å løfte fotmassen fra underlaget.

## 2. Svevfase: kinematisk mål, dynamisk aktuator

I svev virker tyngden på begge masser og et par av like store og motsatt rettede aktuatoriske krefter mellom dem:

```
m_f * a_f = F_swing - m_f*g_y
m_b * a_b = -F_swing - m_b*g_y
```

`g_y` betyr her den vertikale tyngdeakselerasjonsvektoren. Denne modellen bruker en oppgitt svingtid og en referansebane for fotens horisontale/vertikale posisjon. En styrt aktuator med feedforward og PD-ledd følger referansebanen.

Derfor er ikke beinsvingen «gratis». Med `F_swing` som kraften på fotmassen føres det mekaniske arbeid som:

```
W_swing = integral F_swing · (v_f - v_b) dt
```

Positive og negative deler av arbeidet bokføres separat. Summen av disse med fortegn gir netto aktuatorarbeid. Vi bruker ikke dette som mål på metabolsk energiforbruk.

Den aksiale standfasefjæren er deaktivert under sving; ved ny landing velges en *ubelastet* effektiv lengde, `min(L_rest, L_touch)`. Denne omkonfigurasjonen ved null fjærkraft modellerer ikke detaljert leddarbeidet som ville vært nødvendig i en anatomisk modell.

## 3. Landing: diskret, plastisk kontakt

Når foten treffer `y_f=0` på vei ned, settes distal fotmasse momentant i ro i dette forsøksoppsettet. Dette er en **idealisert, fullstendig uelastisk kollisjon**, ikke en kontinuerlig bakkekraftkurve.

```
J_x = -m_f * v_fx^-
J_y = -m_f * v_fy^-
E_collision = 0.5*m_f*(v_fx^-² + v_fy^-²)
```

Den resulterende støtimpulsen må ha `J_y >= 0` og `|J_x| <= mu*J_y` for at en fullstendig ikke-glidende landing skal være konsistent. Manglende oppfyllelse skal flagges. Fotens gjennomslag gjennom bakken unngås med tidslokalisering (bisection, 25 iterasjoner) innenfor integrasjonssteget.

Et punktstøt gir en ideell, momentant konsentrert kraft: en **krafttopp i N/BW kan ikke avledes av støtimpulsen alene**. `peakBW` i denne modellen viser den *kontinuerlige* standfasereaksjonen uten støtimpulsen.

## 4. Mekaniske og numeriske kontrollstørrelser

Samlet horisontal og vertikal impuls (inkludert plastiske støt):

```
delta_p_x = integral R_x dt + sum J_x
delta_p_y = integral R_y dt + sum J_y - M*g*T
```

Energiregnskap:

```
E_mech = K_body + K_foot + U_gravity + 0.5*k_leg*C²
E_mech(t) + E_damping(t) + E_collision(t) - W_swing(t) ≈ E_mech(0)
```

For kontaktfjæren under standfase foregår intet mekanisk arbeid mot et fast underlag: fotens hastighet er null. Demping og plastisk kollisjon har ikke-negative tap, mens svingaktuatoren kan tilføre eller ta opp arbeid.

Nominelt tidssteg er **0,1 ms** med RK4, 25-iterasjons hendelseslokalisering for landing. Fraspark identifiseres med tidsstegoppløsning. Tidsstegfølsomhet testes mot 0,05 ms.

## 5. Første illustrative eksempel

Start: `M=75 kg`, distal andel `alpha=0.08`, `k_leg=20 kN/m`, `mu=0.90`, initial overkroppshøyde `0.88 m`, initial horisontal overkroppsfart `5 m/s`, initial vertikal fart `−0.5 m/s`. Svingtid satt til `0.22 s`, landingsfart satt til `−1.0 m/s`. Varighet `0.75 s`.

- Fraspark ca. **104,9 ms**, ny landing **324,9 ms**.
- Neste fraspark ca. **487,6 ms**, neste landing **707,6 ms**.
- Største *kontinuerlige* vertikale støttefasekraft ca. **4,31 BW** (uten plastisk støtimpuls).
- Tap ved de to kollisjonene samlet ca. **6,01 J**.
- Positivt aktuatorarbeid ca. **431 J**, negativt ca. **441 J**, netto ca. **−9,9 J**.
- Største energibalansefeil ca. **0,00013 J**.
- Samlet impulsbalanseavvik i hver akse er numerisk svært lite.

Dette er **beregnede tall fra en illustrativ parameterkombinasjon**; ingen av dem kan brukes som referanseverdier for sprintere.

## 6. Faglige begrensninger og neste utviklingstrinn

1. **Én distal masse:** Det eksisterer ikke en høyre og en venstre benkjede med egne ledd og massefordeling.
2. **Rigid fotisett:** Kontinuerlig kollisjonskraft og tidlig krafttopp er ikke modellert; bare impuls ved kollisjon. Det må innføres en fysisk kontaktdynamikk før hele målte kraftkurver kan predikeres.
3. **Friksjonsbegrensninger:** Støtten forutsetter ikke-glidning; ved for høyt friksjonsbehov markeres simulasjonen ugyldig. Glidning må få egne dynamiske tilstandslikninger.
4. **Styrt svingfase:** Svingtid og fotbanemål er gitt utenfra, og motorens arbeid kan være høyt. Svingtiden må ikke presenteres som en uavhengig modellprediksjon.
5. **Ingen vedvarende gangart:** Uten aktiv standfasemuskulatur er det ikke garantert at mekanisk energi og hastighet kan opprettholdes over mange steg.
6. **Ingen anatomiske seneestimater:** Ingen direkte modell av akillessenen, muskelarkitektur eller metabolsk løpsøkonomi.
7. **Ikke empirisk validert:** Må først testes mot individdata ved 2,5–4,5 m/s, deretter relevante sprintdata. Kontakt, støtteimpuls, kollisjonsimpuls, asymmetri og kraftkurvens form må vurderes hver for seg.

Forsvarlig neste trinn er en **M2.1 med kompliant fot–bakke-kollisjon og riktig hendelseslogikk**, eller M3 med separat høyre/venstre bein og kraftbegrenset standfaseaktuator. Det bør avgjøres av hvilken mekanisme vi ønsker å teste empirisk.

## Kjøring og reproduksjon

```bash
node tomasse-loping/tests/test-model2d.mjs
node tomasse-loping/tests/test-model.mjs
python -m http.server 8000
```

Åpne `http://localhost:8000/tomasse-loping/2d.html` fra lokal repo-rot.

## Primære kilder

- Blickhan (1989). *The spring-mass model for running and hopping*. DOI [10.1016/0021-9290(89)90224-8](https://doi.org/10.1016/0021-9290(89)90224-8).
- Clark & Weyand (2014). *Are running speeds maximized with simple-spring stance mechanics?* DOI [10.1152/japplphysiol.00174.2014](https://doi.org/10.1152/japplphysiol.00174.2014).
- Clark, Ryan & Weyand (2017). *A general relationship links gait mechanics and running ground reaction forces*. DOI [10.1242/jeb.138057](https://doi.org/10.1242/jeb.138057). Deres to-masse-beskrivelse er en annen modellarkitektur enn koden her.

**Ingen endring er gjort i `hoppemodell-loping/index.html` på `main`.**
