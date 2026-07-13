<p align="center">
  <img src="step%20beyond%20banner.png" alt="Baner Step Beyond" width="100%">
</p>

# Step Beyond

## Każde zadanie. Jeden krok dalej.

Step Beyond daje agentowi stały instynkt rozumienia rezultatu ukrytego za
poleceniem, domykania brakujących elementów, przewidywania następnego użytecznego
kroku i weryfikowania wyniku przed oddaniem pracy.

**Wersja 4.0.0-alpha.2** · Hybrydowa implementacja referencyjna: prompt + TypeScript

[English](README.md) · [Wersja ChatGPT](README_CHATGPT.md) · [Specyfikacja](SPEC.md) · [API runtime](docs/runtime.md)

Agent działa jak uważny współpracownik. Czyta zadanie w kontekście, rozpoznaje
elementy potrzebne do ukończenia rezultatu i patrzy o jeden użyteczny krok
naprzód.

## Instynkt Step Beyond

Przy każdym istotnym zadaniu agent sprawdza:

1. Jakiego rezultatu potrzebuje użytkownik?
2. Jakiego koniecznego elementu brakuje w literalnym poleceniu?
3. Czego użytkownik prawdopodobnie będzie potrzebował jako następnego kroku?
4. Czy agent ma zgodę na takie działanie?
5. Jaki dowód potwierdza rezultat?

**Każde zadanie korzysta z rozumowania Step Beyond. Dodatkowa praca powstaje tylko wtedy, gdy jest użyteczna, bezpieczna, dozwolona i możliwa do zweryfikowania.**

Model interpretuje język i tworzy warianty intencji. Runtime odpowiada za
polityki, zgody, stan, dowody i audyt, jeśli host udostępnia potrzebne możliwości.

Framework ma dwa jawne tryby:

| Tryb | Co zapewnia | Czego nie gwarantuje |
|---|---|---|
| **prompt-only** | Przenośne rozumowanie, ścisły zakres, decyzje uwzględniające zgody i dyscyplinę twierdzeń | Egzekwowanej trwałości, wspólnego stanu, deterministycznych bramek zgód ani audytu |
| **runtime-backed** | Warstwę promptową oraz kontroler polityk, store, kontrakt adaptera, ledger weryfikacji i runner evali | Poprawnego zachowania każdego modelu i hosta bez powtarzanych testów konkretnego adaptera |

`verified` jest statusem dowodowym. Dotyczy wyłącznie adaptera, hosta, modelu i
zachowania objętego powtarzanymi pomiarami.

## ⚡ Co zyskuje Twój agent

Poniższe nazwy opisują możliwości widoczne dla użytkownika. Nie zastępują
kanonicznego lifecycle z [`SPEC.md`](SPEC.md).

| | Superpower | Instynkt, który otrzymuje agent |
|---|---|---|
| 🧠 | **RECALL** | Korzysta z istotnego kontekstu użytkownika wraz ze źródłem, bez zamiany przypuszczeń w fakty |
| 🔎 | **SCAN** | Czyta aktualny projekt: stack, historię, konwencje, reguły i ograniczenia |
| 🔍 | **EXPAND** | Odtwarza oczekiwany rezultat zamiast wybierać najkrótszą literalną interpretację |
| 🎨 | **POLISH** | Buduje kompletną, profesjonalną bazę w ramach zleconego zakresu |
| ➕ | **EXTEND** | Wybiera działania opcjonalne według wartości, zgody, kosztu, ryzyka i możliwości weryfikacji |
| 🔮 | **ANTICIPATE** | Rozpoznaje prawdopodobny następny krok bez samowolnego rozszerzania uprawnień |
| ✅ | **VERIFY** | Łączy każde istotne twierdzenie z kontrolą i nazywa zakres bez weryfikacji |
| 📈 | **SELF-IMPROVE** | Uczy się z obserwowalnych wyników przez audytowalne i odwracalne rekordy |

### Jeden lifecycle, jedno źródło prawdy

```text
CONTEXT → INTENT → DECIDE → BUILD → INITIATIVE → EXECUTE → VERIFY → DELIVER → LEARN
```

| Nazwa możliwości | Etap lifecycle |
|---|---|
| RECALL | CONTEXT |
| SCAN | CONTEXT |
| EXPAND | INTENT + DECIDE |
| POLISH | BUILD |
| EXTEND | INITIATIVE + EXECUTE |
| ANTICIPATE | INITIATIVE + DECIDE |
| VERIFY | VERIFY |
| SELF-IMPROVE | LEARN |

`DELIVER` prowadzi od rezultatu i raportuje wyłącznie twierdzenia obsługiwane
przez ledger weryfikacji. Adapter może skrócić wewnętrzne rozumowanie, lecz
zachowuje znaczenie i kolejność etapów.

## Od literalnego wykonania do kontrolowanej inicjatywy

| Literalny agent | Step Beyond |
|---|---|
| Wybiera pierwszą interpretację | Tworzy różne hipotezy intencji i porównuje pewność z kosztem pomyłki |
| Traktuje stan projektu jak preferencję użytkownika | Oddziela aktualne fakty projektowe od modelu użytkownika |
| Dodaje generyczne bonusy | Ocenia kandydatów powiązanych z bieżącym zadaniem po klasyfikacji zgody |
| Publikuje, bo odgadł cel | Oddziela rozumienie, propozycję, wykonanie lokalne i publikację |
| Pisze „działa” po przeczytaniu kodu | Zapisuje kontrolę, dowód, sprawdzony zakres i braki |
| Uczy się z ciszy | Traktuje `unknown` neutralnie i aktualizuje stan na podstawie obserwowalnego wyniku |

## Dlaczego architektura hybrydowa

Model językowy potrafi interpretować niepełne polecenie i tworzyć alternatywy.
Sam prompt nie zagwarantuje wspólnego stanu, trwałej pamięci, egzekwowania zgód
ani audytu. Step Beyond przekazuje te zadania małemu kontrolerowi.

```text
adapter hosta
    ├─> składanie kontekstu
    ├─> rozpoznanie intencji
    ├─> bramka zgód
    ├─> adaptacyjny scoring inicjatywy
    ├─> wykonawca hosta
    ├─> ledger weryfikacji
    └─> aktualizacja uczenia
```

Normatywny kontrakt znajduje się w [`SPEC.md`](SPEC.md), a uzasadnienie decyzji
w [projekcie hybrydowego runtime](docs/superpowers/specs/2026-07-13-hybrid-runtime-design.md).

### Pakiety referencyjne

| Pakiet | Odpowiedzialność |
|---|---|
| `@step-beyond/runtime-core` | Intencja, ścisły zakres, zgody, adaptacyjna inicjatywa, weryfikacja, uczenie i kontrola tury |
| `@step-beyond/runtime-store` | Izolacja namespace, odrzucanie sekretów, atomowy stan JSON, audyt, korekta, usuwanie i rollback |
| `@step-beyond/adapter-reference` | Wykrywanie możliwości, jawna degradacja oraz granica między wykonaniem lokalnym i publikacją |
| `@step-beyond/eval-runner` | Świeże instancje adaptera, ramiona porównawcze, powtórzenia, surowe dowody i metryki |

Pakiety runtime nie mają zależności produkcyjnych. Projekt korzysta z TypeScript,
`node:test` i `tsx` podczas rozwoju.

## Szybki start

Wymagany jest Node.js 20 lub nowszy.

```bash
git clone https://github.com/aievolutionpl/step-beyond.git
cd step-beyond
npm install
npm run validate
```

`npm run validate` uruchamia typecheck, testy i deterministyczny replay runtime.

```ts
import {
  classifyAction,
  detectStrictScope,
  resolveIntent,
  selectInitiatives,
} from '@step-beyond/runtime-core';
```

Przykłady API, obsługa store i zasady degradacji są w
[`docs/runtime.md`](docs/runtime.md).

### Przenośny skill

Skopiuj [`skills/step-beyond/`](skills/step-beyond/) do hosta obsługującego
skille albo wstrzyknij
[`skills/step-beyond/templates/core-injection.txt`](skills/step-beyond/templates/core-injection.txt)
jako stałe instrukcje.

Dla Custom GPT, Project Instructions i zwykłego czatu użyj
[wersji ChatGPT](README_CHATGPT.md). Bez połączonego runtime działa ona w trybie
prompt-only.

## Kontrakt działania

### Intencja i ścisły zakres

Agent tworzy kilka istotnie różnych hipotez intencji. Pewność oraz koszt pomyłki
decydują, czy agent działa, ujawnia założenie, zadaje jedno pytanie albo prosi o
zgodę.

Zwroty `tylko`, `nic więcej`, `only`, `just` i `nothing else` aktywują ścisły
zakres. Wyłączają działania opcjonalne i nieproszone propozycje. Nie wyłączają
pracy wymaganej do poprawnego działania zamówionego rezultatu ani kontroli
potrzebnych do uczciwego raportu.

### Zgoda przed inicjatywą

| Klasa | Znaczenie |
|---|---|
| `AUTO` | Tanie, odwracalne, lokalne i zgodne z zakresem |
| `AUTO_WITH_DISCLOSURE` | Odwracalne działanie lokalne oparte na istotnym założeniu |
| `ASK` | Publikacja, wysyłka, koszt, dane dostępowe, bezpieczeństwo, destrukcja, nieodwracalność lub kosztowna niejednoznaczność |
| `FORBIDDEN` | Eskalacja uprawnień, wyciek sekretów, nieuzasadniony zapis danych wrażliwych lub działanie poza udzieloną władzą |

Runtime klasyfikuje zgodę przed scoringiem inicjatywy. Tryby `fast`, `standard`
i `exploratory` zmieniają próg. `strict` usuwa działania opcjonalne i nieproszone
propozycje. V4 używa tego adaptacyjnego budżetu zamiast stałego limitu v3 `5/3/1`.

### Pamięć bez promowania domysłów

Model użytkownika rozróżnia fakty, preferencje, ograniczenia, obserwacje, hipotezy,
trajektorie, otwarte pętle i negatywny feedback. Rekordy zawierają źródło, zakres,
pewność, znaczniki czasu, pochodzenie, wrażliwość i status.

Referencyjny store:

- trzyma fakty projektowe poza pamięcią użytkownika;
- odrzuca prawdopodobne dane dostępowe przed zapisem;
- obsługuje inspekcję, korektę, miękkie usuwanie, audyt i rollback;
- traktuje ciszę i nieobserwowalne użycie jako `unknown`;
- izoluje rekordy użytkownika od globalnych zmian heurystyk.

Gdy host ma własną pamięć, reguły, skille lub weryfikację, adapter wybiera jednego
właściciela rekordu i jeden rekord weryfikacji dla każdego istotnego twierdzenia.
Szczegóły opisuje [kontrakt adaptera](skills/step-beyond/references/adapters.md).

### Weryfikacja o dokładnym zakresie

| Status | Znaczenie |
|---|---|
| `verified` | Zadeklarowany zakres sprawdzono i przeszedł kontrolę |
| `partially_verified` | Nazwane kontrole przeszły, lecz nazwany zakres pozostał bez sprawdzenia |
| `unverified` | Brak istotnego dowodu z wykonania |

Niedostępna integracja nie usuwa użytecznego artefaktu. Agent zawęża albo usuwa
niepoparte twierdzenie. [Zasady weryfikacji](skills/step-beyond/references/verification.md)
opisują dowody, a [slop index](skills/step-beyond/references/slop.md) zawiera
obserwowalne reguły wykrywania i naprawy tekstu, kodu, stron, obrazów i wykresów.

## Ewaluacja i dowody

```bash
npm test
npm run typecheck
npm run eval:runtime
```

`eval:runtime` jest deterministycznym smoke testem replay. Sprawdza polityki,
runner i asercje. Nie mierzy zachowania żywego modelu ani hosta.

Raport behawioralny musi zachować surowe transkrypty i artefakty, podać wersje
modelu, promptu, runtime i adaptera oraz zapisać powtórzenia, parametry, tokeny,
koszt, opóźnienie i naruszenia zgód. Reguły release gate oraz próby opisuje
[`evals/README.md`](evals/README.md). Nowy raport zaczyna się od
[`evals/results/TEMPLATE.md`](evals/results/TEMPLATE.md), gdzie case pozostaje
`NOT RUN`, dopóki nie istnieje dowód.

Historyczne raporty Markdown zachowują ograniczenia zapisane podczas swoich
uruchomień. Nie ustalają aktualnego pass rate v4.

## Status

Wersja 4 pozostaje implementacją referencyjną w fazie alpha. Repo zawiera
przetestowany kontroler TypeScript, store, kontrakt adaptera i deterministyczny
harness eval. Produkcyjne adaptery hostów i twierdzenia behawioralne wymagają
powtarzanych testów konkretnego adaptera przed statusem `verified`.

## Licencja i autorstwo

**Created with obsessive attention to detail by**

[**AI EVOLUTION POLSKA**](https://www.aievolutionpolska.pl/)

[https://www.aievolutionpolska.pl/](https://www.aievolutionpolska.pl/) · [https://aievolutionlabs.io/](https://aievolutionlabs.io/)

MIT License — Use it. Remix it. Ship it. Just don't remove the attribution.
