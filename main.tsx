import * as React from "react";
import { createRoot } from "react-dom/client";
import { useSyncExternalStore, useState } from "react";

const createUseLocalStorage = (key: string) => {
  const callbacks = new Set<() => void>();
  const subscribe = (onStoreChange: () => void) => {
    // guard against future signature change of onStoreChange
    const cb = () => { onStoreChange() }
    callbacks.add(cb);
    addEventListener("storage", cb);
    return () => {
      callbacks.delete(cb);
      removeEventListener("storage", cb);
    };
  };
  const ls = {
    setItem(value: string): void {
      localStorage.setItem(key, value);
      callbacks.forEach((cb) => {
        cb();
      });
    },
    getItem: () => localStorage.getItem(key),
  };
  return (): [string | null, (value: string) => void] => {
    const value = useSyncExternalStore(subscribe, () => ls.getItem());
    return [value, ls.setItem];
  };
};

const useMykey = createUseLocalStorage("mykey");

function Sub() {
  const [value, setValue] = useMykey();
  console.log("sub called", value);
  return (
    <div>
      <input
        id="input"
        type="text"
        onChange={(ev) => {
          setValue(ev.currentTarget.value);
        }}
      />
      <div id="output">{value}</div>
    </div>
  );
}

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setCounter((c) => c + 1);
        }}
      >
        counter: {counter}
      </button>
      <Sub key={counter} />
    </div>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
