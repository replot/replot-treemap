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
      map.key = this.props.keyOrder[i]
      if (i == 0){
        map.visible = true
        map.active = true
      } else {
        map.visible = false
        map.active = false
      }
      map.chosenValue = null
      this.state.order.push(map)
    }
    this.state.order.push({key: "other", active: false, chosenValue: null})
  }

  handleNest(level, chosenRect) {
    var newOrder = this.state.order.slice()
    for (var index = 0; index < newOrder.length; index++){
      if (newOrder[index].key == level){
        break
      }
    }
    if (newOrder[index].active == true) {
      newOrder[index].active = false
      newOrder[index].chosenValue = chosenRect
      newOrder[index + 1].visible = true
      newOrder[index + 1].active = true
    }
    else { //clicking on an inactive TreeMap to go back
      newOrder[index].active = true
      newOrder[index].chosenValue = null
      for (let j = index + 1; j < newOrder.length; j++){
        newOrder[j].visible = false
        newOrder[j].active = false
        newOrder[j].chosenValue = null
      }
    }
    console.log(newOrder)
    this.setState({
      order: newOrder
    })
  }

  render() {
    let treeMaps = []
    // const style = {
    //   nest: {
    //     position: "absolute",
    //     top: `${this.getNestPosition()[0]}px`,
    //     left: `${this.getNestPosition()[1]}px`,
    //     boxShadow: "-10px -10px 10px rgba(0, 0, 0, 0.25)",
    //   }
    // }

    for (let map of this.state.order){
      treeMaps.push(
        <TreeMap data={this.props.data} weightKey={this.props.weightKey}
          titleKey={map.key} active={map.active} visible={map.visible}
          handleNest={this.handleNest.bind(this)} />
      )
    }

    // treeMaps = <TreeMap data={this.props.data} weightKey={this.props.weightKey} active={this.state.order[0].active}
    //   titleKey={this.props.keyOrder[0]} visible={this.state.order[0].visible} keyOrder={this.props.keyOrder} handleNest={this.handleNest.bind(this)}/>

    return (
      <div>
        {treeMaps}
      </div>
    )
  }
}

export default TreeMapManager
