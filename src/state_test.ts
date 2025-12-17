import {assertEquals} from "@std/assert";
import {apply, loadState, State} from "./state.ts";
import {Event, LogReducer} from "./log.ts";

Deno.test("load state", async () => {
  const state = await loadState(stubbedReducer([]));

  assertEquals(state, { sessions: [], currentSession: null });
});

Deno.test("apply log to inactive state", () => {
  const event = apply({ sessions: [], currentSession: null }, {
    kind: "log",
    ts: 1766007441152,
  });

  assertEquals(event, { kind: "start", ts: 1766007441152 });
});

Deno.test("apply log to active state", () => {
  const event = apply(
    { sessions: [], currentSession: { started: new Date(1766007440000) } },
    {
      kind: "log",
      ts: 1766007441152,
    },
  );

  assertEquals(event, { kind: "stop", ts: 1766007441152 });
});

function stubbedReducer(data: Event[]): LogReducer<State> {
  return {
    reduce(
      reducer: (previousValue: State, currentValue: Event) => State,
      initialValue: State,
    ): Promise<State> {
      return Promise.resolve(data.reduce(reducer, initialValue));
    },
  };
}
