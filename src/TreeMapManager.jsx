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
        map.active = true
      } else {
        map.active = false
      }
      map.chosenValue = null
      this.state.order.push(map)
    }
    this.state.order.push({key: "other", active: false, chosenValue: null})
  }

  render() {
    var treeMapper = function(data, wt, ti, ko) {
      return (
        <TreeMap data={data} weightKey={wt} titleKey={ti} keyOrder={ko} />
      )
    }

    let treeMaps = this.state.order.map(treeMapper)


    return (
      <div>
        {treeMaps}
      </div>
    )
  }
}

export default TreeMapManager
