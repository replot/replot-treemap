import React from "react";
import ReactDOM from "react-dom";
import TreeMap from "../src/index.jsx";

class ExampleApp extends React.Component {
  render() {
    return(
      <div className="container">
        <h1> Ent </h1>
        <TreeMap />
      </div>
    )
  }
}

ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
