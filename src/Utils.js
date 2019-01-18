import { useState, useMemo, useEffect } from "react";
import { interpret } from "xstate/lib/interpreter";

export function useMachine(machine, options = {}) {
  const [current, setCurrent] = useState(machine.initialState);
  const service = useMemo(
    () =>
      interpret(machine)
        .onTransition(state => {
          options.log && console.log("CONTEXT:", state.context);
          setCurrent(state);
        })
        .onEvent(e => options.log && console.log("EVENT:", e))
        .start(),
    []
  );

  useEffect(() => {
    return () => service.stop();
  }, []);

  return [current, service.send];
}

export const uuid = () => {
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16);
  }

  return uuid;
}

export const pluralize = (count, word) => {
  return count === 1 ? word : word + 's';
}

export const store = (namespace, data) => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  var store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

export const extend = function () {
  var newObj = {};
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}

export const pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const arrayMove = (arr, old_index, new_index) => {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
};
