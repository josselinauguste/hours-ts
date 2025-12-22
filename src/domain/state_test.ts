import {assertEquals} from "@std/assert";
import {EventReducer, loadState, log, State} from "./state.ts";
import {Event} from "./event.ts";

Deno.test("load empty state", async () => {
  const state = await loadState(stubbedReducer([]));

  assertEquals(state, { sessions: [], currentSession: null });
});

Deno.test("load state", async () => {
  const state = await loadState(stubbedReducer([
    { kind: "start", ts: 1766007440000 },
    { kind: "stop", ts: 1766007441152 },
    { kind: "start", ts: 1766007442304 },
  ]));

  assertEquals(state, {
    sessions: [{
      start: new Date(1766007440000),
      end: new Date(1766007441152),
    }],
    currentSession: { started: new Date(1766007442304) },
  });
});

Deno.test("apply log to inactive state", () => {
  const event = log({ sessions: [], currentSession: null }, 1766007441152);

  assertEquals(event, { kind: "start", ts: 1766007441152 });
});

Deno.test("apply log to active state", () => {
  const event = log({
    sessions: [],
    currentSession: { started: new Date(1766007440000) },
  }, 1766007441152);

  assertEquals(event, { kind: "stop", ts: 1766007441152 });
});

function stubbedReducer(data: Event[]): EventReducer<State> {
  return {
    reduce(
      reducer: (previousValue: State, currentValue: Event) => State,
      initialValue: State,
    ): Promise<State> {
      return Promise.resolve(data.reduce(reducer, initialValue));
    },
  };
}
