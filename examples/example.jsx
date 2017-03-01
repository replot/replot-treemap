import React from "react"
import ReactDOM from "react-dom"
import TreeMap from "../src/index.jsx"


class KeyValueRow extends React.Component {

  changeHandler(e) {
    this.props.updateData({
      title: this.props.title,
      weight: e.target.value
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
        <td style={style.cell}>{this.props.title} </td>
        <td style={style.cell}>
          <input type="text" value={parseInt(this.props.weight)}
            onChange={this.changeHandler.bind(this)} />
        </td>
      </tr>
    )
  }
}


class KeyValueTable extends React.Component {

  render() {
    console.log(this.props.data)
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
          title={dataPoint.title} weight={dataPoint.weight}
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
        {weight: 1373, title: "China", color: "#4cab92"},
        {weight: 1266, title: "India", color: "#ca0004"},
        {weight: 323, title: "United States", color: "#003953"},
        {weight: 258, title: "Indonesia", color: "#eccc00"},
        {weight: 205, title: "Brazil", color: "#9dbd5f"},
        {weight: 201, title: "Pakistan", color: "#0097bf"},
        {weight: 186, title: "Nigeria", color: "#005c7a"},
        {weight: 156, title: "Bangladesh", color: "#fc6000"},
      ]
    }
  }

  updateData(mutatedObject) {
    console.log(mutatedObject)
    let mutatedData = JSON.parse(JSON.stringify(this.state.data))
    let chosenIndex = -1
    for (let index=0; index < mutatedData.length; index++) {
      if (mutatedData[index].title === mutatedObject.title) {
        chosenIndex = index
        break
      }
    }
    if (chosenIndex > -1) {
      console.log(chosenIndex)
      mutatedData[chosenIndex].weight = parseInt(mutatedObject.weight)
      console.log(mutatedData)
      this.setState({data: mutatedData})
    }
  }

  render() {
    return(
      <div className="container">
        <h1 style={{textAlign: "center"}}> Ent: Treemaps for react </h1>
        <KeyValueTable data={this.state.data} updateData={this.updateData.bind(this)} />
        <div style={{width:"70%", display:"inline-block"}}>
          <TreeMap data={this.state.data} />
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <ExampleApp />,
  document.getElementById("react-app")
)
