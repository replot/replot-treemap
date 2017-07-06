import React from "react"
import ReactDOM from "react-dom"
import TreeMapManager from "../src/index.jsx"


class TreeDataRow extends React.Component {

  changeHandler(e) {
    this.props.updateData({
      city: this.props.city,
      population: e.target.value || "0"
    })
  }

  render() {
    const style = {
      cell: {
        minWidth: "100px",
        color: "black",
        fontSize: "0.8rem"
      }
    }

    return(
      <tr key={this.props.title}>
        <td style={style.cell}> {this.props.country} </td>
        <td style={style.cell}> {this.props.state} </td>
        <td style={style.cell}> {this.props.city} </td>
        <td style={style.cell}>
          <input type="text" value={parseInt(this.props.population)}
            onChange={this.changeHandler.bind(this)} />
        </td>
      </tr>
    )
  }
}


class TreeDataTable extends React.Component {

  render() {
    const style = {
      container: {
        width:"30%",
        display:"inline-block",
        verticalAlign:"top",
        padding:"20px 40px",
        color:"black"
      },
      cell: {
        minWidth: "100px",
        color: "black",
        fontSize: "1.2rem",
        borderBottom: "thin solid #ffffff"
      }
    }
    let rows = []
    rows.push(
      <tr key="labels">
        <td style={style.cell}> Country </td>
        <td style={style.cell}> State </td>
        <td style={style.cell}> City </td>
        <td style={style.cell}> Population </td>
      </tr>
    )
    for (let dataPoint of this.props.data) {
      rows.push(
        <TreeDataRow key={dataPoint.title} country={dataPoint.country}
          state={dataPoint.state} city={dataPoint.city}
          population={dataPoint.population}
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
        {population: 650, country: "China", state: "Beijing", city: "Miyun"},
        {population: 902, country: "China", state: "Beijing", city: "Tongzhou"},
        {population: 120, country: "China", state: "Beijing", city: "Yizhuang"},
        {population: 800, country: "United States", state: "California", city: "San Francisco"},
        {population: 10020, country: "United States", state: "California", city: "Los Angeles"},
        {population: 150, country: "United States", state: "Vermont", city: "Newport"},
        {population: 20, country: "United States", state: "Vermont", city: "Montpelier"},
        {population: 202, country: "United States", state: "Illinois", city: "Chicago"},
        {population: 112, country: "Canada", state: "Ontario", city: "Kingston"},
        {population: 80, country: "Canada", state: "Ontario", city: "Barrie"},
      ],
      keyOrder: ["country", "state", "city"]
      // data: [
      //   {country: "China", population: 1388232693},
      //   {country: "India", population: 1342512706},
      //   {country: "USA", population: 326474013}
      // ]
      // data: [
      //   {country: "Earth", population: 800000},
      //   {country: "Mars", population: 98765},
      //   {country: "China", population: 9000},
      //   {country: "Russia", population: 10000},
      //   {country: "India", population: 83},
      //   {country: "USA", population: 100},
      //   {country: "Iceland", population: 2},
      //   {country: "Greenland", population: 1}
      // ]
      // data: [
      //   {planet: "Earth", country: "USA", population: 40000},
      //   {planet: "Earth", country: "China", population: 200},
      //   {planet: "Earth", country: "Canada", population: 200},
      //   {planet: "Earth", country: "Mexico", population: 1},
      //   {planet: "Earth", country: "Brazil", population: 2},
      // ],
      // keyOrder: ["planet", "country"]
    }
  }

  updateData(mutatedObject) {
    let mutatedData = JSON.parse(JSON.stringify(this.state.data))
    let chosenIndex = -1
    for (let index=0; index < mutatedData.length; index++) {
      if (mutatedData[index].city === mutatedObject.city) {
        chosenIndex = index
        break
      }
    }
    if (chosenIndex > -1) {
      mutatedData[chosenIndex].population = parseInt(mutatedObject.population)
      this.setState({data: mutatedData})
    }
  }

  fillTooltip(title, data) {
    let cities = ""
    for (let dataPoint of data){
      if (dataPoint.country === title){
        cities = cities + dataPoint.city + ", "
      }
    }
    return (
      <div>
        <h1>{title}</h1>
        {cities.length > 0 &&
          <div>The cities in this country are: {cities}</div>
        }
      </div>
    )
  }

  render() {
    return(
      <div className="container">
        <h1 style={{textAlign: "center"}}> Treemaps for Replot </h1>
        <TreeDataTable data={this.state.data} updateData={this.updateData.bind(this)} />
        <div style={{width:"70%", display:"inline-block"}}>
          <TreeMapManager data={this.state.data} weightKey="population"
            keyOrder={this.state.keyOrder} tooltip
            tooltipContents={this.fillTooltip.bind(this)}/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
