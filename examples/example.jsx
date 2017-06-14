import React from "react"
import ReactDOM from "react-dom"
import TreeMap from "../src/index.jsx"


class KeyValueRow extends React.Component {

  changeHandler(e) {
    this.props.updateData({
      country: this.props.country,
      population: e.target.value
    })
  }

  render() {
    const style = {
      cell: {
        minWidth: "100px",
      }
    }

    return(
      <tr key={this.props.title}>
        <td style={style.cell}>{this.props.country} </td>
        <td style={style.cell}>
          <input type="text" value={parseInt(this.props.population)}
            onChange={this.changeHandler.bind(this)} />
        </td>
      </tr>
    )
  }
}


class KeyValueTable extends React.Component {

  render() {
    const style = {
      container: {
        width:"30%",
        display:"inline-block",
        verticalAlign: "top",
        padding: "20px",
      }
    }
    let rows = []
    for (let dataPoint of this.props.data) {
      rows.push(
        <KeyValueRow key={dataPoint.title}
          country={dataPoint.country} population={dataPoint.population}
          updateData={this.props.updateData.bind(this)} />
      )
    }

    return (
      <div className="container" style={style.container}>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

}


class ExampleApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [
        {population: 1373, country: "China"},
        {population: 1266, country: "India"},
        {population: 323, country: "United States",
          child: [
          {population: 200, country: "California"},
          {population: 80, country: "Illinois"},
          {population: 43, country: "Vermont",
            child: [
              {population: 13, country: "Newport"},
              {population: 30, country: "Montpelier"}
            ]}
        ]},
        {population: 258, country: "Indonesia"},
        {population: 205, country: "Brazil"},
        {population: 201, country: "Pakistan"},
        {population: 186, country: "Nigeria"},
        {population: 156, country: "Bangladesh"},
        {population: 40, country: "Iceland"},
        {population: 30, country: "Greenland"},
        {population: 20, country: "Blueland"},
        {population: 40, country: "Redland"},
        {population: 30, country: "Yellowland"},
        {population: 20, country: "Orangeland"}
      ]
    }
  }

  updateData(mutatedObject) {
    let mutatedData = JSON.parse(JSON.stringify(this.state.data))
    let chosenIndex = -1
    for (let index=0; index < mutatedData.length; index++) {
      if (mutatedData[index].country === mutatedObject.country) {
        chosenIndex = index
        break
      }
    }
    if (chosenIndex > -1) {
      mutatedData[chosenIndex].population = parseInt(mutatedObject.population)
      this.setState({data: mutatedData})
    }
  }

  render() {
    return(
      <div className="container">
        <h1 style={{textAlign: "center"}}> Treemaps for Replot </h1>
        <KeyValueTable data={this.state.data} updateData={this.updateData.bind(this)} />
        <div style={{width:"70%", display:"inline-block"}}>
          <TreeMap data={this.state.data} weightKey="population"
            titleKey="country" />
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
