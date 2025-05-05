import { useState } from "react";

function App() {
  const [text, setText] = useState<string>("");
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "50%" }}
        />
        <div>{text}</div>
      </div>
    </div>
  );
}

export default App;
