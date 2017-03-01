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
        {weight: 4, title: "Scala", color: "#44aa77"},
        {weight: 4, title: "Go", color: "#00417A"},
        {weight: 5, title: "PHP", color: "#4A427F"},
        {weight: 10, title: "C", color: "#FFB03B"},
        {weight: 15, title: "Python", color: "#B64926"},
        {weight: 12, title: "Java", color: "#0E1C0C"},
        {weight: 40, title: "Javascript", color: "#8E2800"},
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
