import React from "react"
import ReactDOM from "react-dom"
import BasicExample from "./BasicExample.jsx"
import AdvancedExample from "./AdvancedExample.jsx"

ReactDOM.render(
  <BasicExample />,
  document.getElementById("basic-example")
)

ReactDOM.render(
  <AdvancedExample />,
  document.getElementById("advanced-example")
)
