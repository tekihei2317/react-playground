import { useReducer } from "react";

export type TypingStats = {
  timeLeft: number;
  keystrokes: number;
  totalChars: number;
  misses: number;
  speed: number;
};

type Action =
  | { type: "tick" }
  | { type: "correct" }
  | { type: "miss" }
  | { type: "charConfirmed" }
  | { type: "reset" };

const timeLimit = 30;

function reducer(state: TypingStats, action: Action): TypingStats {
  switch (action.type) {
    case "tick": {
      const elapsed = timeLimit - (state.timeLeft - 1);
      const newSpeed =
        elapsed > 0 ? Math.round((state.keystrokes / elapsed) * 10) / 10 : 0;

      return {
        ...state,
        timeLeft: Math.max(0, state.timeLeft - 1),
        speed: newSpeed,
      };
    }
    case "correct": {
      const newKeystrokes = state.keystrokes + 1;
      return { ...state, keystrokes: newKeystrokes };
    }
    case "miss":
      return { ...state, misses: state.misses + 1 };
    case "charConfirmed":
      return { ...state, totalChars: state.totalChars + 1 };
    case "reset":
      return {
        timeLeft: timeLimit,
        keystrokes: 0,
        totalChars: 0,
        misses: 0,
        speed: 0,
      };
    default:
      return state;
  }
}

export function useTypingStats() {
  const [typingStats, updateTypingStats] = useReducer(reducer, {
    timeLeft: timeLimit,
    keystrokes: 0,
    totalChars: 0,
    misses: 0,
    speed: 0,
  });

  return { typingStats, updateTypingStats };
}
