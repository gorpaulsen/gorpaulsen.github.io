/* Norsk idrettsvitenskap: tilgjengelig, kildebasert pilotpanel.
   Ingen nøkkel eller personlige data lagres i nettleserens storage. */
(() => {
  if (document.getElementById("niv-chat-launcher")) return;
  const rawEndpoint = document.querySelector('meta[name="niv-chat-endpoint"]')?.content?.trim() ||\n    (window.location.hostname === "localhost" && window.location.port === "8000"\n      ? "http://localhost:8787/chat" : "");
  let endpoint = "";
  if (rawEndpoint) {
    try {
      const parsed = new URL(rawEndpoint);
      if (parsed.protocol === "https:" || (parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
        endpoint = parsed.href;
      }
    } catch { /* demomodus */ }
  }
  const DEMOS = [
    {
      q: "Hva er forskjellen på tretthet og trettbarhet?",
      a: "Disposisjonen skiller mellom subjektiv opplevelse av tretthet, målt reduksjon i prestasjon og mekanismer som kan forklare endringen. Hvert nivå krever en egen operasjonell definisjon og egnede målinger. Den tilgjengelige disposisjonen er ikke en fullstendig vitenskapelig dokumentasjon.",
      source: { title: "Hva er tretthet?", url: "/artikler/tretthet.html", status: "Faglig disposisjon – ikke fagfellevurdert" }
    },
    {
      q: "Hva er styrke?",
      a: "Disposisjonen skiller mellom muskelkraft, leddmoment og prestasjon i en spesifikk styrketest. Resultater fra 1RM og isometriske tester må tolkes ut fra testprotokoll og mekaniske betingelser. Her er dette et disposisjonsutdrag, ikke en ferdig forskningsoversikt.",
      source: { title: "Hva er styrke?", url: "/artikler/styrke.html", status: "Faglig disposisjon – ikke fagfellevurdert" }
    },
    {
      q: "Er muskelskade nødvendig for muskelvekst?",
      a: "Disposisjonen peker på at forekomst av muskelskade etter trening ikke i seg selv viser at skade er en nødvendig betingelse for hypertrofi. En slik årsakspåstand må vurderes mot eksperimentelle originalstudier, som ennå ikke er kontrollert i denne piloten.",
      source: { title: "Vevsskade og treningstilpasning", url: "/artikler/vevsskade-tilpasning.html", status: "Faglig disposisjon – ikke fagfellevurdert" }
    }
  ];
  const root = document.createElement("div");
  root.className = "niv-chat";
  root.innerHTML = `
    <button type="button" class="niv-chat-launcher" id="niv-chat-launcher" aria-expanded="false" aria-controls="niv-chat-panel">
      <span aria-hidden="true">?</span><span>Spør fagassistenten</span>
    </button>
    <section id="niv-chat-panel" class="niv-chat-panel" role="dialog" aria-label="Spør Norsk idrettsvitenskap" hidden>
      <header class="niv-chat-head">
        <div><p class="niv-chat-eyebrow">NORSK IDRETTSVITENSKAP</p><h2>Spør fagassistenten</h2></div>
        <button type="button" class="niv-chat-close" aria-label="Lukk chatboten">×</button>
      </header>
      <div class="niv-chat-status" role="status"></div>
      <div class="niv-chat-messages" aria-live="polite" aria-relevant="additions text"></div>
      <div class="niv-chat-examples" aria-label="Forslag til spørsmål"></div>
      <form class="niv-chat-form">
        <fieldset class="niv-chat-modes">
          <legend>Svarnivå</legend>
          <label><input type="radio" name="niv-mode" value="kort" checked> Kort</label>
          <label><input type="radio" name="niv-mode" value="fordypning"> Faglig fordypning</label>
        </fieldset>
        <label class="niv-chat-question-label" for="niv-chat-question">Faglig spørsmål</label>
        <textarea id="niv-chat-question" maxlength="600" rows="2" placeholder="Hva ønsker du å undersøke?" required></textarea>
        <button type="submit" class="niv-chat-submit">Send spørsmål</button>
        <p class="niv-chat-privacy">Ikke oppgi personopplysninger. Utkastene er ikke fagfellevurdert. Hvert spørsmål behandles separat.</p>
      </form>
    </section>`;
  document.body.append(root);
  const launcher = root.querySelector(".niv-chat-launcher");
  const panel = root.querySelector(".niv-chat-panel");
  const closer = root.querySelector(".niv-chat-close");
  const messages = root.querySelector(".niv-chat-messages");
  const examples = root.querySelector(".niv-chat-examples");
  const form = root.querySelector(".niv-chat-form");
  const input = root.querySelector(".niv-chat-form textarea");
  const submit = root.querySelector(".niv-chat-submit");
  const status = root.querySelector(".niv-chat-status");
  status.textContent = endpoint
    ? "Intern fagpilot · 11 faglige disposisjoner · ikke fagfellevurdert"
    : "Demomodus · eksempeltekster, ingen AI-tilkobling";
  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus(); else launcher.focus();
  }
  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closer.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  function safeSourceLink(source) {
    if (!source?.url || !/^\/artikler\/[a-z0-9-]+\.html$/.test(source.url)) return null;
    const a = document.createElement("a");
    a.href = source.url;
    a.textContent = source.title || "Les kildegrunnlaget";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function addBubble(kind, text, sources = [], label = "") {
    const bubble = document.createElement("div");
    bubble.className = "niv-chat-bubble niv-chat-bubble-" + kind;
    if (label) {
      const badge = document.createElement("strong");
      badge.className = "niv-chat-bubble-label";
      badge.textContent = label;
      bubble.append(badge);
    }
    const p = document.createElement("p");
    p.textContent = text;
    bubble.append(p);
    if (sources.length) {
      const heading = document.createElement("p");
      heading.className = "niv-chat-source-heading";
      heading.textContent = "Kildemateriale";
      bubble.append(heading);
      const ul = document.createElement("ul");
      for (const source of sources) {
        const link = safeSourceLink(source);
        if (!link) continue;
        const li = document.createElement("li");
        li.append(link);
        const small = document.createElement("small");
        small.textContent = " · " + (source.status || "Ukjent status");
        li.append(small);
        ul.append(li);
      }
      if (ul.childNodes.length) bubble.append(ul);
    }
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }
  for (const demo of DEMOS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "niv-chat-example";
    b.textContent = demo.q;
    b.addEventListener("click", () => {
      if (endpoint) { input.value = demo.q; form.requestSubmit(); }
      else {
        addBubble("user", demo.q);
        addBubble("assistant", demo.a, [demo.source], "Demotekst fra disposisjon – ikke KI-svar");
      }
    });
    examples.append(b);
  }
  addBubble("assistant",
    "Jeg kan hjelpe med begreper, forskningsspørsmål og metodekritikk. Piloten bruker foreløpig bare nettstedets faglige disposisjoner, ikke kontrollerte originalstudier.",
    [], "Kildeassistent · pilot");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (question.length < 8) { input.focus(); return; }
    addBubble("user", question);
    input.value = "";
    if (!endpoint) {
      addBubble("assistant",
        "Denne visningen er en lokal demonstrasjon. Bruk eksempelspørsmålene for å se kildeformatet. Fritekstsvar krever en konfigurert, tilgangsbeskyttet server.",
        [], "Ingen AI-tilkobling");
      return;
    }
    submit.disabled = true;
    submit.textContent = "Undersøker kilder …";
    const mode = form.querySelector('input[name="niv-mode"]:checked')?.value || "kort";
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 29000);
      let response;
      try {
        response = await fetch(endpoint, {
          method: "POST", mode: "cors", credentials: "omit",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, mode }),
          signal: controller.signal,
          cache: "no-store"
        });
      } finally { clearTimeout(timer); }
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Tjenesten svarte ikke.");
      addBubble("assistant", result.answer || "Ingen svartekst.", result.sources || [],
        result.evidenceStatus === "insufficient" ? "Utilstrekkelig kildegrunnlag" : "Utkastbasert AI-svar · ikke fagfellevurdert");
    } catch (error) {
      addBubble("assistant", error.name === "AbortError"
        ? "Forespørselen tok for lang tid. Prøv igjen senere."
        : "Kunne ikke hente svar: " + (error.message || "Ukjent feil"),
        [], "Tjenesten er utilgjengelig");
    } finally {
      submit.disabled = false;
      submit.textContent = "Send spørsmål";
    }
  });
})();
