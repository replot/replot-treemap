import React from "react"
import TreeMap from "./TreeMap.jsx"


class TreeMapManager extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      order: []
    }
    for (let i = 0; i < this.props.keyOrder.length; i++){
      let map = {}
      map.key = (i == 0 ? this.props.titleKey : this.props.keyOrder[i])
      map.visible = (i == 0 ? true : false)
      map.chosenValue = null
      this.state.order.push(map)
    }
  }

  handleNest(level, chosenRect) {
    let newOrder = this.state.order.slice()
    let index = newOrder.findIndex(function(x) {return x.key === level})
    if (chosenRect == "Other"){
      newOrder[index].chosenValue = chosenRect
      let newOtherMap = {}
      newOtherMap.key = "other"
      newOtherMap.visible = true
      newOtherMap.chosenValue = null
      newOrder.splice(index+1, 0, newOtherMap)
    }
    else if (!newOrder[index].chosenValue && this.props.keyOrder.length != 1 && newOrder[index].key != this.props.keyOrder[this.props.keyOrder.length-1]) { //clicking on an active map to go forward
      newOrder[index].chosenValue = chosenRect
      if (newOrder[index + 1]) {
        newOrder[index + 1].visible = true
      }
    }
    else { //clicking on an inactive TreeMap to go back
      newOrder[index].chosenValue = null
      for (let j = index + 1; j < newOrder.length; j++){
        if (newOrder[j].key == "other"){
          newOrder.splice(j,1)
          j--
        }
        else{
          newOrder[j].visible = false
          newOrder[j].chosenValue = null
        }
      }
    }
    this.setState({
      order: newOrder
    })
  }

  getNestPosition() {
    return this.props.height < this.props.width ?
      {x: this.props.height / 8 , y: this.props.height / 8} :
      {x: this.props.width / 8 , y: this.props.width / 8}
  }

  render() {
    let treeMaps = []

    for (let i = 0; i < this.state.order.length; i++){
      treeMaps.push(
        <div key={this.state.order[i].key} style={i==0 ? null : {position: "absolute", top: `${i*this.getNestPosition().y}px`, left: `${i*this.getNestPosition().x}px`, boxShadow: "-10px -10px 10px rgba(0, 0, 0, 0.25)",}}>
          <TreeMap data={this.props.data} weightKey={this.props.weightKey}
            titleKey={this.state.order[i].key} parent={i-1 >= 0 ? this.state.order[i-1].chosenValue : null} keyOrder={this.props.keyOrder.length == 1 ? [this.props.titleKey] : this.props.keyOrder} active={this.state.order[i].chosenValue == null}
            visible={this.state.order[i].visible} handleNest={this.handleNest.bind(this)} />
        </div>
      )
    }

    return (
      <div style={{height: `${this.props.height + (this.state.order.length-1)*(this.props.height/8)}px`, position: "relative"}}>
        {treeMaps}
      </div>
    )
  }
}

TreeMapManager.defaultProps = {
  width: 800,
  height: 400,
  titleKey: "title",
  keyOrder: ["title"],
  weightKey: "weight"
}

export default TreeMapManager
