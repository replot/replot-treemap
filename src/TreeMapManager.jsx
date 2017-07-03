import React from "react"
import TreeMap from "./TreeMap.jsx"
import Tooltip from "../docs/index.jsx" //This import location will change eventually


class TreeMapManager extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mapList: [],
      tooltipContents: "test",
      mouseOver: false,
      mouseX: null,
      mouseY: null
    }
    for (let i = 0; i < this.props.keyOrder.length; i++){
      let map = {}
      map.key = (i == 0 ? this.props.titleKey : this.props.keyOrder[i])
      map.visible = (i == 0 ? true : false)
      map.chosenValue = null
      this.state.mapList.push(map)
    }
  }

  activateTooltip(title, weight) {
    this.setState(
      {
        tooltipContents: (
          <div>
            <h1>{title}</h1>
            <p>{this.props.weightKey}: {weight}</p>
          </div>
        ),
        mouseOver: true,
      }
    )
  }

  deactivateTooltip() {
    this.setState(
      {
        mouseOver: false
      }
    )
  }

  updateMousePos(e) {
    this.setState({ mouseX: e.pageX, mouseY: e.pageY - 12 })
  }

  handleNest(level, titleKey, chosenRect) {
    let newMapList = this.state.mapList.slice()
    let index = level
    if (chosenRect == "Other"){
      newMapList[index].chosenValue = chosenRect
      let newOtherMap = {}
      newOtherMap.key = "other" + (level + 1)
      newOtherMap.visible = true
      newOtherMap.chosenValue = null
      newMapList.splice(index+1, 0, newOtherMap)
    }
    else if (!newMapList[index].chosenValue && this.props.keyOrder.length != 1
      && newMapList[index].key != this.props.keyOrder[this.props.keyOrder.length-1]
      && index != (newMapList.length-1)) { //clicking on an active map to go forward
      newMapList[index].chosenValue = chosenRect
      if (newMapList[index + 1]) {
        newMapList[index + 1].visible = true
      }
    }
    else { //clicking on an inactive TreeMap to go back
      newMapList[index].chosenValue = null
      for (let j = index + 1; j < newMapList.length; j++){
        if (newMapList[j].key.includes("other")){
          newMapList.splice(j,1)
          j--
        }
        else{
          newMapList[j].visible = false
          newMapList[j].chosenValue = null
        }
      }
    }
    this.setState({
      mapList: newMapList
    })
  }

  getNestPosition() {
    return this.props.height < this.props.width ?
      {x: this.props.height / 8 , y: this.props.height / 8} :
      {x: this.props.width / 8 , y: this.props.width / 8}
  }

  chooseTitleKey(index){
    for (let i = index; i >=0 ; i--){
      if (!this.state.mapList[i].key.includes("other")){
        return this.state.mapList[i].key
      }
    }
  }

  chooseParentifOther(index){
    for (let i = index - 2; i >=0 ; i--){
      if (!this.state.mapList[i].chosenValue.includes("Other")){
        return this.state.mapList[i].chosenValue
      }
    }
  }

  render() {
    let treeMaps = []

    for (let i = 0; i < this.state.mapList.length; i++){
      treeMaps.push(
        <div key={this.state.mapList[i].key}
          style={i==0 ? null : {position: "absolute", top: `${i*this.getNestPosition().y}px`, left: `${i*this.getNestPosition().x}px`, boxShadow: "-10px -10px 10px rgba(0, 0, 0, 0.25)"}}>
          <TreeMap data={this.props.data} weightKey={this.props.weightKey}
            titleKey={this.chooseTitleKey(i)}
            parent={i-1 >= 0 ? this.state.mapList[i-1].chosenValue : null}
            otherParent={i-2 >= 0 ? this.state.mapList[i-2].chosenValue : null}
            keyOrder={this.props.keyOrder.length == 1 ? [this.props.titleKey] : this.props.keyOrder}
            level={i}
            active={this.state.mapList[i].chosenValue == null}
            visible={this.state.mapList[i].visible}
            handleNest={this.handleNest.bind(this)}
            activateTooltip={this.activateTooltip.bind(this)}
            deactivateTooltip={this.deactivateTooltip.bind(this)}/>
        </div>
      )
    }

    return (
      <div onMouseMove={this.props.tooltip ? this.updateMousePos.bind(this) : null}>
        {this.props.tooltip &&
          <Tooltip
            x={this.state.mouseX} y={this.state.mouseY}
            active={this.state.mouseOver}
            colorScheme={this.props.tooltipColor}
            contents={this.state.tooltipContents}
          />
        }
        <div style={{height: `${this.props.height + (this.state.mapList.length-1)*(this.props.height/8)}px`, position: "relative"}}>
          {treeMaps}
        </div>
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
