# 🧠 Step Beyond v3.0

> Nie pytaj o pozwolenie na oczywiste. Zrób zadanie bazowe, dodaj tylko następny użyteczny element, zweryfikuj to, czego dotknąłeś, i zatrzymaj się, gdy zakres użytkownika mówi stop.

**README.md jest źródłem prawdy; ten plik jest polskim tłumaczeniem operacyjnego opisu.**

Step Beyond to przenośny skill behawioralny dla agentów kodujących i contentowych: zamienia krótką prośbę użytkownika w zdyscyplinowany workflow obejmujący przypomnienie kontekstu, rozwinięcie intencji, bazowy polish, ograniczone rozszerzenia, weryfikację, dostarczenie i uczenie. To nie jest model, SaaS ani ranking benchmarkowy; to pakiet instrukcji do Claude, Codex, Cursor, Copilot, OpenAI Agents albo własnej pętli agenta, który zamienia proaktywność w procedurę zamiast hasła marketingowego.

## Quick start

Zainstaluj albo skopiuj skill, a potem wstrzyknij kanoniczny prompt z [`skills/step-beyond/templates/core-injection.txt`](skills/step-beyond/templates/core-injection.txt):

```bash
# skopiuj skill do lokalnego folderu agenta
mkdir -p .claude/skills
cp -R skills/step-beyond .claude/skills/

# albo wstrzyknij minimalny rdzeń do własnego agenta/system promptu
cat skills/step-beyond/templates/core-injection.txt
```

Użyj rdzenia jako pierwszej instrukcji behawioralnej. Zostaw cały folder skilla dostępny, żeby agent mógł doczytywać referencje pamięci, weryfikacji, slopu, domen i subagentów tylko wtedy, gdy są potrzebne.

## Przykłady instalacji

### Claude

```text
/plugin marketplace add aievolutionpl/step-beyond
/plugin install step-beyond@step-beyond
```

Instalacja ręczna w projekcie:

```bash
mkdir -p .claude/skills
cp -R skills/step-beyond .claude/skills/
```

### Codex

```bash
codex exec "build the requested feature" \
  --custom-instructions skills/step-beyond/templates/core-injection.txt
```

Możesz też wkleić rdzeń do `~/.codex/config.toml` jako dodatkowe instrukcje.

### Cursor

```bash
cat skills/step-beyond/templates/core-injection.txt > .cursorrules
```

Jeśli masz już reguły Cursora, dopisz ten plik zamiast go podmieniać.

### Copilot

```bash
mkdir -p .github
cat skills/step-beyond/templates/core-injection.txt > .github/copilot-instructions.md
```

Reguły build/test/style specyficzne dla repozytorium zostaw przed albo po bloku Step Beyond.

### OpenAI Agents

```python
from agents import Agent

with open("skills/step-beyond/templates/core-injection.txt", "r", encoding="utf-8") as f:
    step_beyond = f.read()

agent = Agent(
    name="builder",
    instructions=step_beyond + "\n\nUse available tools to implement, verify, and report only observed results.",
)
```

W układach multi-agent wstrzyknij rdzeń do orkiestratora i mapuj role builder/extender/verifier według [`skills/step-beyond/references/subagents.md`](skills/step-beyond/references/subagents.md).

## Przykłady benchmarków

Step Beyond ma dwa różne typy kontroli. **Package-readiness** sprawdza, czy repozytorium jest instalowalne, linki wewnętrzne działają i pakiet jest kompletny do wydania. **Benchmark model-behavior** uruchamia to samo zadanie ze skillem i bez skilla, a potem ocenia zachowanie agenta: kontrolę zakresu, weryfikację, uczciwe deklaracje, użycie pamięci i ograniczone dodatki.

### Uruchom statyczny package readiness

```bash
# wymagane pliki pakietu istnieją
test -f SPEC.md && test -f skills/step-beyond/SKILL.md && test -f skills/step-beyond/templates/core-injection.txt

# linki z README wskazują realne ścieżki w tym checkoutcie
test -e benchmark && test -e adapters && test -e skills/step-beyond/SKILL.md

# w głównym README nie ma oczywistych niezweryfikowanych claimów procentowych
! rg -n "[0-9]+–[0-9]+%|>[0-9]+%|~[0-9]+%" README.md
```

### Uruchom behawioralny benchmark A/B ze zmiennymi API

```bash
# wybierz providera modelu używanego przez swój harness
export OPENAI_API_KEY="sk-..."
export STEP_BEYOND_MODEL="gpt-5.5"
export STEP_BEYOND_CONTROL_INSTRUCTIONS=""
export STEP_BEYOND_TREATMENT_INSTRUCTIONS="$(cat skills/step-beyond/templates/core-injection.txt)"

# wykonaj przebieg kontrolny i treatment, potem oceń według rubryki
python benchmark/run_ab.py \
  --cases evals/cases.md \
  --results-dir evals/results \
  --control-env STEP_BEYOND_CONTROL_INSTRUCTIONS \
  --treatment-env STEP_BEYOND_TREATMENT_INSTRUCTIONS
```

Jeśli checkout nie zawiera `benchmark/run_ab.py`, użyj [`evals/README.md`](evals/README.md) jako protokołu ręcznego: świeży agent per case, control run dla przypadków serii A, ocena każdego MUST i MUST-NOT oraz zapis wyników w `evals/results/`.

## Kluczowe linki

- [SPEC.md](SPEC.md) — kontrakt pakietu i specyfikacja behawioralna.
- [benchmark/](benchmark/) — lokalizacja harnessu benchmarkowego i notatki.
- [adapters/](adapters/) — adaptery integracyjne i notatki adapterów.
- [skills/step-beyond/SKILL.md](skills/step-beyond/SKILL.md) — główny plik skilla.
- [skills/step-beyond/templates/core-injection.txt](skills/step-beyond/templates/core-injection.txt) — kanoniczny prompt do wstrzyknięcia.
- [evals/](evals/) — ręczne przypadki regresji behawioralnej i zapisane wyniki.

## Co skill egzekwuje

```text
RECALL  → czytaj wzorce użytkownika/projektu, jeśli są dostępne
EXPAND  → zamień prośbę w intent brief przed budowaniem
BUILD   → wykonaj bazowe zadanie z L1 polish
EXTEND  → dodaj maks. 3 elementy L2 i maks. 1 element L3, tylko gdy użyteczne
VERIFY  → uruchom, wyrenderuj, kliknij, sparsuj albo sprawdź przed claimami
DELIVER → najpierw wynik bazowy; dodatki nazwij krótko
LEARN   → zapisuj zaakceptowane/odrzucone wzorce, jeśli istnieje pamięć
STOP    → respektuj "just", "only", "stop", "minimal" i sygnały frustracji
```

Pakiet jest celowo konserwatywny: dodatki mają sufity, język STOP wygrywa z proaktywnością, nieweryfikowalne dodatki stają się sugestiami, a deklaracje końcowe muszą odpowiadać obserwowanym checkom.

## Mapa repozytorium

```text
step-beyond/
├── SPEC.md
├── benchmark/
├── adapters/
├── skills/step-beyond/
│   ├── SKILL.md
│   ├── references/
│   └── templates/core-injection.txt
├── evals/
│   ├── README.md
│   ├── cases.md
│   └── results/
├── examples/
├── README.md
└── README_PL.md
```

## Licencja

MIT. Używaj, adaptuj i trzymaj poprzeczkę weryfikacji wyżej niż slogany.
