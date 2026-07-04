# 🧠 Step Beyond v3.0

> *"Nie pytaj. Po prostu zrób więcej — tak jak zrobiłby to użytkownik. Zweryfikuj. Zapamiętaj co zadziałało. I wiedz, kiedy przestać."*

<br>

<p align="center">
  <img src="https://img.shields.io/badge/wersja-3.0.0-blue?style=for-the-badge" alt="Wersja">
  <img src="https://img.shields.io/badge/licencja-MIT-yellow?style=for-the-badge" alt="Licencja">
  <img src="https://img.shields.io/badge/framework-agnostyczny-green?style=for-the-badge" alt="Framework">
  <img src="https://img.shields.io/badge/pamięć-Obsidian%20%7C%20MCP%20%7C%20mem0%20%7C%20pliki-orange?style=for-the-badge" alt="Pamięć">
  <img src="https://img.shields.io/badge/agenci-Claude%20%7C%20Codex%20%7C%20Hermes%20%7C%20Cursor%20%7C%20Copilot-purple?style=for-the-badge" alt="Kompatybilność">
</p>

<br>

---

## Problem

Każdy agent AI ma te same wady: **jest dosłowny, niczego nie pamięta i przecenia swoją robotę.**

```
USER:  "Zbuduj landing page'a"
AGENT: *buduje pojedynczy plik HTML* "Gotowe! ✅"
USER:  "Gdzie kontakt?"
USER:  "Gdzie favicon?"
USER:  "Czemu nie działa na telefonie?"
USER:  "...i formularz jest zepsuty. W ogóle to otwierałeś?"
USER:  (tydzień później) "Mówiłem ostatnio — nasze kolory to granat i złoto."
```

**12 tur. 8 minut. Frustracja po obu stronach. Powtórka w następnej sesji, od zera.**

Dobry współpracownik nie czeka, aż powiesz mu o stronie kontaktowej — po prostu ją dodaje. Nie oddaje formularza, którego nigdy nie wysłał. I nie pyta o kolory marki dwa razy.

---

## Insight

> **"Najlepszy asystent to ten, którego nie musisz zarządzać."**

Różnica między tym, co użytkownicy mówią, a tym, czego potrzebują, podlega przewidywalnym regułom — a reguły *tego konkretnego* użytkownika da się wyuczyć:

| Użytkownik mówi... | Naprawdę potrzebuje... | Mechanizm |
|-------------------|----------------------|-----------|
| "Wygeneruj obrazek" | Obrazek + kontekst + formaty social | **POLISH** |
| "Zbuduj stronę" | Strona + podstrony + meta + favicon + mobile | **EXTEND** |
| *cisza, ale wiesz że zaraz zapyta* | Następne logiczne pytanie | **ANTICIPATE** |
| "Gotowe! ✅" *(deklaracja agenta)* | Dowód, że faktycznie działa | **VERIFY** |
| *to samo zadanie, nowa sesja* | Jego preferencje, już zastosowane | **MEMORY** |

**Step Beyond koduje wszystkie pięć.** Behawioralny skill, który transformuje każdego agenta z literalnego executora w proaktywnego współpracownika, który się uczy.

---

## Jak to działa — Pipeline

```
┌────────────────────────────────────────────────────────────┐
│                   SILNIK STEP BEYOND v3                     │
│                                                            │
│  INPUT UŻYTKOWNIKA                                          │
│      │                                                      │
│      ▼                                                      │
│  0. RECALL ─── wczytaj wzorce użytkownika z DOWOLNEJ        │
│      │         pamięci (Obsidian · MCP · mem0 · plik)       │
│      ▼                                                      │
│  1. EXPAND ─── ulepsz prompt, który dostałeś, do promptu,   │
│      │         który użytkownik miał na myśli (intent brief)│
│      ▼                                                      │
│  2. BUILD ──── baza + polish L1 (zawsze, cicho)             │
│      │                                                      │
│      ▼                                                      │
│  3. EXTEND ─── L2 (max 3) + L3 (max 1), pod sufitem,        │
│      │         sterowane pamięcią  [subagenci: równolegle]  │
│      ▼                                                      │
│  4. VERIFY ─── uruchom · wyrenderuj · kliknij               │
│      │         skan slopu · audyt deklaracji                │
│      │         nie da się zweryfikować? WYTNIJ.             │
│      │         [subagenci: weryfikator ze świeżym kontekstem]│
│      ▼                                                      │
│  5. DELIVER ── najpierw baza, dodatki w ≤4 słowach          │
│      │                                                      │
│      ▼                                                      │
│  6. LEARN ──── zaakceptowane? → domyślne następnym razem    │
│                odrzucone 2×? → zbanowane na zawsze          │
│                → zapisane z powrotem do pamięci             │
└────────────────────────────────────────────────────────────┘
```

### Trzy poziomy

| Poziom | Nazwa | Koszt | Zasada |
|--------|-------|-------|--------|
| **L1** | **Polish** | 0 zł · +0s | Zawsze. Bez próżni. Bez slopu. To baseline — nie "dodatek". |
| **L2** | **Extend** | <15% czasu | Brakujący element. Max 3/sesję. Najpierw z pamięci. |
| **L3** | **Anticipate** | <30% czasu | Przewidź następne pytanie. Max 1/sesję. Z trajektorii. |

### Sufit

```
Łącznie:      5 / sesję      ██████████  100%
Poziom 2:     3 / sesję      ██████      60%
Poziom 3:     1 / sesję      ██          20%

STOP gdy budżet wyczerpany.
STOP na: "tylko X", "daj już", "wystarczy", frustracja.
WYTNIJ każdy dodatek, którego nie da się zweryfikować.
```

### Pamięć (nowe w v3)

Działa z **dowolną pamięcią, jaką ma agent** — jeden przenośny plik wzorców, dowolny magazyn:

```
Vault Obsidian   →  {vault}/step-beyond/patterns.md
Memory MCP/mem0  →  dokument z kluczem "step-beyond:patterns"
CLAUDE.md        →  oznaczona sekcja, ≤40 linii
Zwykłe pliki     →  step-beyond/patterns.md
Nic              →  tryb sesyjny (nadal uczy się w ramach sesji)
```

```
akceptacja 2×  → REINFORCED  (od teraz domyślny L2)
odrzucenie 2×  → BANNED      (nigdy więcej)
ignorowane 3×  → DROPPED
rezultat: ~60% akceptacji dodatków na zimno → >85% do 5. sesji
```

### Pętla weryfikacji (nowe w v3)

```
BASE CHECK      użyj tego tak, jak użyje użytkownik — otwórz, uruchom, kliknij
ADDITION CHECK  każdy L2/L3, ta sama poprzeczka. Nieweryfikowalny → sugestia.
SLOP SCAN       indeks AI slopu: tekst, kod, design, obraz, dane
CLAIM AUDIT     "działa" / "przetestowane" / "responsywne" — tylko jeśli widziane
```

**Zepsuty dodatek jest gorszy niż brak dodatku. Fałszywa deklaracja jest gorsza niż oba.**

---

## Rezultaty

```
ZADANIE: "Zbuduj landing page dla restauracji"

┌───────────────────────────────┬──────────────────────────────┐
│ BEZ Step Beyond               │ Z Step Beyond v3             │
├───────────────────────────────┼──────────────────────────────┤
│ Tur: 12                       │ Tur: 4                       │
│ Follow-upy: 4                 │ Follow-upy: 0                │
│ Pliki: 1 HTML                 │ HTML + 4 podstrony + favicon │
│ Weryfikacja: nigdy nie otwarte│ Każdy link kliknięty, 375px ✓│
│ Następna sesja: od zera       │ Marka + preferencje z pamięci│
└───────────────────────────────┴──────────────────────────────┘
```

---

## Uniwersalny — działa z każdym agentem

| Framework | Jak dodać |
|-----------|----------|
| **Claude Code / Agent SDK** | Sklonuj do `~/.claude/skills/step-beyond` (pełny skill, progressive disclosure) lub wklej blok do `CLAUDE.md` |
| **Codex CLI** | `--custom-instructions` lub `config.toml` |
| **Hermes Agent** | `skills: [step-beyond]` w `config.yaml` |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` |
| **GitHub Copilot** | `copilot-instructions.md` |
| **OpenAI Agents SDK / CrewAI / LangGraph** | Wstrzyknij rdzeń do orkiestratora; role wg `references/subagents.md` |
| **Własny ReAct Loop** | Wstrzyknij jako pierwszą wiadomość systemową |

Pełne instrukcje: [`references/installation.md`](references/installation.md)

---

## Quick Start — 60 sekund

Skopiuj to do system promptu swojego agenta:

```yaml
## 🧠 Step Beyond — Proaktywne Ulepszenia

PIPELINE: przypomnij z pamięci → rozwiń intencję → zbuduj bazę + L1 →
rozszerz (L2 max 3, L3 max 1) → ZWERYFIKUJ (uruchom, skan slopu, uczciwe
deklaracje) → dostarcz → zapisz wzorce do pamięci.

L1 (ZAWSZE, cicho): Polish. Bez próżni. Prawdziwy kontekst. Baseline.
L2 (<15% czasu, max 3): Brakujący element. Najpierw z pamięci. "+nazwa"
L3 (<30% czasu, max 1): Przewidź następne pytanie. "+nazwa (~Xs)"

VERIFY: nic nie wychodzi niesprawdzone. Nie da się zweryfikować dodatku?
Wytnij. Deklaruj tylko to, co zaobserwowałeś — żadnych pustych "działa".

PAMIĘĆ (dowolny magazyn — Obsidian/MCP/plik): akceptacja 2× → domyślne.
odrzucenie 2× → ban. Wyraźna instrukcja > pamięć > domyślne.

SUFIT: 5 łącznie/sesję. STOP na: "tylko X", "daj już", "stop", "wystarczy".
SUBAGENCI (jeśli dostępni): równoległe dodatki, świeży weryfikator.
```

---

## Nauka — dlaczego to działa

### 1. Redukcja obciążenia poznawczego
Każdy follow-up, który użytkownik musi napisać, kosztuje energię mentalną. Step Beyond eliminuje 70–90% follow-upów, przewidując je zawczasu.

### 2. Dopełnianie wzorców
Ludzie rzadko specyfikują kompletne wymagania. "Zbuduj stronę" zakłada kontakt, privacy, favicon, mobile. Step Beyond koduje to jako reguły domenowe — a potem nadpisuje je wyuczonymi wzorcami *tego* użytkownika.

### 3. Kalibracja przez pamięć
Domyślne reguły to heurystyka na zimny start. Prawdziwy sygnał to, co *ten* użytkownik zaakceptował, odrzucił i zignorował — utrwalone w dowolnej pamięci, od Obsidiana po zwykły markdown. Po 5 sesjach agent już nie zgaduje.

### 4. Zaufanie przez weryfikację
Proaktywność umiera w momencie, gdy jeden dodatek przychodzi zepsuty — użytkownik przestaje czytać wszystkie. Pętla weryfikacji (uruchom, przeskanuj slop, audytuj każdą deklarację) to jest to, co czyni 5 dodatków na sesję zrównoważonymi.

### 5. Zasada sufitu
5 ulepszeń łącznie, twarde sygnały STOP, permanentna lista Banned. Proaktywny ≠ irytujący.

### 6. Projekt niezależny od frameworka
Czysta specyfikacja behawioralna. System prompt, plik skilla lub blok konfiguracyjny. Claude, GPT, Gemini, DeepSeek, własne modele.

---

## Antywzorce — czego NIE robić

| ❌ Złe podejście | ✅ Dobre podejście |
|-----------------|-------------------|
| "Bądź kreatywny i dodaj wartość" | "Dodaj jeden logiczny następny krok. Wiedz kiedy przestać." |
| "Zawsze dawaj z siebie wszystko" | Sufit: 5 łącznie, 3 L2, 1 L3 |
| "Sprawdź swoją pracę" | 4-stopniowa pętla weryfikacji z audytem deklaracji |
| Wysłać 5 dodatków, 2 zepsute | Weryfikuj każdy — nieweryfikowalny staje się sugestią |
| Pytać o kolory marki co sesję | RECALL z pliku wzorców |
| "Zaskocz mnie" | Przewiduj z zaakceptowanych wzorców tego użytkownika |

---

## Repozytorium

```
step-beyond/
├── SKILL.md                    ← Rdzeń specyfikacji (sam skill)
├── README.md                   ← Wersja angielska
├── README_PL.md                ← Jesteś tutaj
├── LICENSE                     ← MIT
├── references/                 ← Progressive disclosure — ładowane na żądanie
│   ├── memory.md               ← Protokół pamięci (Obsidian/MCP/mem0/pliki)
│   ├── verification.md         ← Pętla weryfikacji + protokół świeżych oczu
│   ├── slop.md                 ← Indeks AI slopu (tekst/kod/design/obraz/dane)
│   ├── subagents.md            ← Orkiestracja: role, firewall, szablony
│   ├── domains.md              ← 10 drzew decyzyjnych domen
│   └── installation.md         ← Instalacja per framework
├── templates/
│   ├── user-patterns.md        ← Startowy plik pamięci
│   └── core-injection.txt      ← Rdzeń do wstrzyknięcia (gotowy plik)
└── examples/
    ├── web-development.md
    ├── image-generation.md
    ├── content-creation.md
    └── memory-learning.md      ← 3 sesje: od zimnego startu do predykcji
```

---

<br>

<p align="center">
  <b>Stworzone z obsesyjną dbałością o szczegóły przez</b>
</p>

<p align="center">
  <a href="https://aievolutionlabs.io">
    <b>AI EVOLUTION LABS</b>
  </a>
</p>

<p align="center">
  <sub>Jersey · Channel Islands · 2026</sub>
</p>

<p align="center">
  <sub>Licencja MIT — Używaj. Remiksuj. Wdrażaj. Tylko nie usuwaj autorstwa.</sub>
</p>

<br>
