# Step Beyond

Step Beyond pomaga agentowi rozpoznać rzeczywisty cel użytkownika, bezpiecznie
wykorzystać kontekst, podjąć inicjatywę, uzyskać zgodę przed działaniem ryzykownym,
zweryfikować twierdzenia i uczyć się bez zamiany przypuszczeń w fakty.

Wersja 4 ma dwa jawne tryby:

- **prompt-only** — przenośny skill sterujący rozumowaniem;
- **runtime-backed** — skill połączony z kontrolerem polityk, pamięci, zgód,
  inicjatywy, weryfikacji i evali.

`SPEC.md` jest jedynym normatywnym źródłem zasad.

## Najważniejsze zmiany

- 2–4 hipotezy intencji zamiast pierwszej interpretacji;
- confidence oddzielone od kosztu pomyłki;
- absolutny tryb „tylko X / nic więcej” bez dodatków i propozycji;
- klasy `AUTO`, `AUTO_WITH_DISCLOSURE`, `ASK`, `FORBIDDEN`;
- adaptacyjny scoring inicjatywy zamiast limitu `5/3/1`;
- pamięć rozdzielająca fakty, preferencje, obserwacje i hipotezy;
- statusy `verified`, `partially_verified`, `unverified`;
- `unknown` jako wynik neutralny;
- audyt, korekta, usuwanie i rollback pamięci;
- powtarzalny harness eval zachowujący transcript, artefakty i koszty.

## Uruchomienie

Wymagany jest Node.js 20 lub nowszy.

```bash
npm install
npm run validate
```

Dokumentacja API i adaptera: [`docs/runtime.md`](docs/runtime.md).

## Ważne ograniczenie

`npm run eval:runtime` jest deterministycznym smoke testem replay. Nie dowodzi
zachowania konkretnego modelu ani hosta. Host można nazwać zweryfikowanym dopiero
po wielokrotnych testach jego rzeczywistego adaptera.
