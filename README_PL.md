# 🧠 Step Beyond v1.4

> *"Nie pytaj. Po prostu zrób więcej — tak jak zrobiłby to użytkownik. Ale wiedz, kiedy przestać."*

<br>

<p align="center">
  <img src="https://img.shields.io/badge/wersja-1.4.0-blue?style=for-the-badge" alt="Wersja">
  <img src="https://img.shields.io/badge/licencja-MIT-yellow?style=for-the-badge" alt="Licencja">
  <img src="https://img.shields.io/badge/framework-agnostyczny-green?style=for-the-badge" alt="Framework">
  <img src="https://img.shields.io/badge/agenci-Claude%20%7C%20Codex%20%7C%20Hermes%20%7C%20Cursor%20%7C%20Copilot-purple?style=for-the-badge" alt="Kompatybilność">
</p>

<br>

---

## Problem

Każdy agent AI ma tę samą wadę: **jest dosłowny**.

```
USER:  "Zbuduj landing page'a"
AGENT: *buduje pojedynczy plik HTML*
USER:  "Gdzie kontakt?"
USER:  "Gdzie favicon?"
USER:  "Czemu nie działa na telefonie?"
USER:  "Dodaj jeszcze..."
USER:  "A jeszcze..."
USER:  "I jeszcze jedno..."
```

**12 tur. 8 minut. Frustracja po obu stronach.**

To nie wina agenta. Zrobił dokładnie to, o co został poproszony. Problem w tym, że **dosłowne wykonywanie poleceń to głupie wykonywanie poleceń.** Dobry współpracownik nie czeka, aż powiesz mu o stronie kontaktowej — po prostu ją dodaje.

---

## Insight

> **"Najlepszy asystent to ten, którego nie musisz zarządzać."**

Po przeanalizowaniu tysięcy interakcji człowiek-agent w AI Evolution Labs, jeden wzorzec stał się niezaprzeczalny: **różnica między tym, co użytkownicy mówią, a tym, czego naprawdę potrzebują, podlega przewidywalnym regułom.**

| Użytkownik mówi... | Naprawdę potrzebuje... | Wzorzec |
|-------------------|----------------------|---------|
| "Wygeneruj obrazek" | Obrazek + kontekst + formaty social media | **POLISH** |
| "Zbuduj stronę" | Strona + podstrony + meta + favicon + mobile | **EXTEND** |
| "Napisz post" | Post + hooki + CTA + brief grafiki | **EXTEND** |
| *cisza, ale wiesz że zaraz zapyta* | Następne logiczne pytanie | **ANTICIPATE** |

To nie magia. To rozpoznawanie wzorców. A wzorce można zakodować.

**Step Beyond to właśnie to kodowanie.** Behavioralny skill, który transformuje każdego agenta z literalnego executora w proaktywnego współpracownika. Nie zmienia tego *co* agent potrafi — zmienia *kiedy* i *ile* robi.

---

## Jak to działa

```
┌──────────────────────────────────────────────────┐
│                 SILNIK STEP BEYOND                │
│                                                  │
│  INPUT ─→ DETEKTOR DOMENY ─→ ROUTER POZIOMU     │
│               │                      │            │
│          "obrazek" "strona"     L1? L2? L3?      │
│          "post" "kod"               │             │
│                                     ↓             │
│                         ┌──────────────────────┐  │
│                         │  BRAMKA LIMITU        │  │
│                         │  Budżet OK?           │  │
│                         │  Poniżej 5 łącznie?   │  │
│                         │  User zaangażowany?   │  │
│                         └──────┬───────────────┘  │
│                                │                  │
│                     ┌──────────↓──────────────┐   │
│                     │  SILNIK WYKONANIA        │   │
│                     │                          │   │
│                     │  BAZA → POLISH →         │   │
│                     │  EXTEND → ANTICIPATE     │   │
│                     └──────────┬──────────────┘   │
│                                │                  │
│                     ┌──────────↓──────────────┐   │
│                     │  PRZECHWYTYWANIE FEEDBACKU│  │
│                     │  Akceptuje? Wzmocnij.     │  │
│                     │  Odrzuca? Usuń.           │  │
│                     └──────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Trzy poziomy

| Poziom | Nazwa | Koszt | Zasada |
|--------|-------|-------|--------|
| **L1** | **Polish** | 0 zł · +0s | Zawsze. Bez próżni. Bez slopu. To baseline — nie "dodatek". |
| **L2** | **Extend** | <15% czasu | Dodaj logiczny następny krok. Max 3 na sesję. |
| **L3** | **Anticipate** | <30% czasu | Przewidź następne pytanie. Max 1 na sesję. |

### Sufit

Bez limitów proaktywność staje się spamem. Każde ulepszenie liczy się do budżetu:

```
Łącznie:      5 / sesję      ██████████  100%
Poziom 2:     3 / sesję      ██████      60%
Poziom 3:     1 / sesję      ██          20%
Czas:         20% extra      ████        40%
Koszt API:    $0.05 max      █           10%

STOP gdy budżet wyczerpany.
STOP na: "daj już", "wystarczy", "stop", frustracja.
```

---

## Rezultaty

```
ZADANIE: "Zbuduj landing page dla restauracji"

┌──────────────────────────────────────────────────────────────┐
│ BEZ Step Beyond               │ Z Step Beyond                │
├───────────────────────────────┼──────────────────────────────┤
│ Tur: 12                       │ Tur: 4                       │
│ Czas: ~8 min                  │ Czas: ~3 min                 │
│ Follow-upy: 4                 │ Follow-upy: 0                │
│ Pliki: 1 HTML                 │ Pliki: HTML + 4 podstrony    │
│                               │ + favicon + OG + mobile      │
│ User: "kurwa, gdzie reszta?"  │ User: "zajebiste, dokładnie" │
└──────────────────────────────────────────────────────────────┘
```

---

## Uniwersalny — działa z każdym agentem

Step Beyond **nie jest pluginem do Hermesa.** To specyfikacja behawioralna, którą można wstrzyknąć do dowolnego agenta:

| Framework | Jak dodać |
|-----------|----------|
| **Claude Code** | Wklej do `CLAUDE.md` |
| **Codex CLI** | `--custom-instructions` lub `config.toml` |
| **Hermes Agent** | `skills: [step-beyond]` w `config.yaml` |
| **Cursor** | `.cursorrules` |
| **Windsurf** | `.windsurfrules` |
| **GitHub Copilot** | `copilot-instructions.md` |
| **Własny ReAct Loop** | Wstrzyknij jako pierwszą wiadomość systemową |
| **Dowolny LLM** | Skopiuj blok Quick Start poniżej |

---

## Quick Start — 60 sekund

Skopiuj to do system promptu swojego agenta:

```yaml
## 🧠 Step Beyond — Proaktywne Ulepszenia

L1 (ZAWSZE, cicho): Polish. Bez próżni. Prawdziwy kontekst. Baseline.
L2 (<15% czasu, max 3/sesję): Dodaj logiczny następny krok. "+extra1, extra2"
L3 (<30% czasu, max 1/sesję): Przewidź następne pytanie. "+przewidziane (~Xs)"

SUFIT: 5 łącznie/sesję. 20% budżetu czasu. $0.05 kosztu.
STOP na: "tylko X", "daj już", "wystarczy", frustracja.
CISZA: L1 nigdy nie deklarowane. L2: 1 linijka. L3: pełna deklaracja.

DOMENY:
  Obrazek → L1: kinowy, kontekst. L2: +alt crop, format social. NIGDY: próżnia.
  Strona → L1: responsive, prawdziwe fonty. L2: +kontakt, privacy, favicon, OG.
  Treść → L1: bez slopu, aktywny głos. L2: +hooki, CTA.
  Kod → L1: typy, errory. L2: +testy, docs.
  Research → L1: źródła. L2: +rekomendacje, action itemy.
  Email → L1: personalny. L2: +tytuły, follow-up.
  Wideo → L1: poprawny format. L2: +thumbnail, napisy.
  Audio → L1: poprawny głos. L2: +transkrypcja, show notes.
  Dane → L1: opisane osie. L2: +alt wizualizacja, export.
  Social → L1: format platformy. L2: +caption, hashtagi, alt text.

FEEDBACK: 2 akceptacje → wzmocnij. 2 odrzucenia → usuń.
```

---

## Nauka — dlaczego to działa

### 1. Redukcja obciążenia poznawczego
Każdy follow-up, który użytkownik musi napisać, kosztuje energię mentalną. Step Beyond eliminuje 70-90% follow-upów, przewidując je zawczasu. Użytkownik zostaje w stanie flow.

### 2. Dopełnianie wzorców
Ludzie rzadko specyfikują kompletne wymagania. Mówią "zbuduj stronę" i zakładają, że rozumiesz "z kontaktem, polityką prywatności, faviconem, responsywną na mobile". Step Beyond koduje te wzorce dopełniania jako reguły domenowe.

### 3. Kalibracja przez feedback
Nie wszyscy użytkownicy chcą tych samych ulepszeń. Step Beyond śledzi, co dostaje pochwałę, co jest ignorowane, a co odrzucane — i adaptuje się. Po 2 sesjach zna Twoje preferencje. Po 5 — jest dostrojony.

### 4. Zasada sufitu
Największym ryzykiem w systemach proaktywnych jest przesada. Bramka limitu Step Beyond zapobiega wyczerpaniu: 5 ulepszeń łącznie, 20% budżetu czasu, twarde sygnały STOP. Proaktywny ≠ irytujący.

### 5. Projekt niezależny od frameworka
Step Beyond nie zależy od żadnej konkretnej architektury agenta. To specyfikacja behawioralna — czysta logika, którą można wstrzyknąć jako system prompt, plik skilla lub blok konfiguracyjny. Działa z Claude, GPT, Gemini, DeepSeek i własnymi modelami.

---

## Antywzorce — czego NIE robić

| ❌ Złe podejście | ✅ Dobre podejście |
|-----------------|-------------------|
| "Bądź kreatywny i dodaj wartość" | "Dodaj jeden logiczny następny krok. Wiedz kiedy przestać." |
| "Zawsze dawaj z siebie wszystko" | Sufit: 5 łącznie, 3 L2, 1 L3 |
| "Rób co uważasz za słuszne" | Reguły domenowe z ograniczeniami NIGDY |
| "Nigdy nie dodawaj nic extra" | L1 zawsze. L2 gdy oszczędza follow-up. |
| "Zaskocz mnie" | Przewiduj na podstawie zaakceptowanych wzorców |

---

## Repozytorium

```
step-beyond/
├── SKILL.md              ← Pełna specyfikacja behawioralna (628 linii)
├── README.md             ← Wersja angielska
├── README_PL.md          ← Jesteś tutaj
├── LICENSE               ← MIT
└── examples/
    ├── image-generation.md
    ├── web-development.md
    └── content-creation.md
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
