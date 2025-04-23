import { useAppSelector, useAppDispatch } from "./app/hooks";

import { decrement, increment } from "./features/counter/counterSlice";

const App = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="text-3xl text-blue-600 font-bold underline">
        Hello World
      </div>

      <button
        aria-label="Increment value"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <span>{count}</span>
      <button
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
    </>
  );
}

export default App
