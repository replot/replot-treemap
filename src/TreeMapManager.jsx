import React from "react"
import PropTypes from "prop-types"
import TreeMap from "./TreeMap.jsx"
import {Tooltip, Resize} from "replot-core"


class TreeMapManager extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mapList: [],
      tooltipContents: null,
      mouseOver: false,
      mouseX: null,
      mouseY: null
    }
    for (let i = 0; i < this.props.keyOrder.length; i++){
      let map = {}
      map.key = (this.props.keyOrder.length == 1 && i == 0 ? this.props.titleKey : this.props.keyOrder[i])
      map.visible = (i == 0 ? true : false)
      map.chosenValue = null
      this.state.mapList.push(map)
    }
  }

  activateTooltip(hoverKey, hoverValue, hoverData, allData) {
    let newContents
    if (this.props.tooltipContents){
      newContents = this.props.tooltipContents(hoverKey, hoverValue, hoverData, allData)
    }
    else {
      newContents = (
        <div>
          <h1>{hoverValue}</h1>
        </div>
      )
    }
    this.setState(
      {
        tooltipContents: newContents,
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

  handleNest(level, chosenRect) {
    let newMapList = this.state.mapList.slice()
    let index = level
    if (chosenRect == "Other"){ //clicking on an active map, specifically the "other" rect
      newMapList[index].chosenValue = chosenRect
      let newOtherMap = {}
      newOtherMap.key = "other" + (level+1)
      newOtherMap.visible = true
      newOtherMap.chosenValue = null
      newMapList.splice(index+1, 0, newOtherMap)
    }
    else if (!newMapList[index].chosenValue && index != (newMapList.length-1)) {
      //clicking on an active map to go forward, not "other" rect and not last level
      newMapList[index].chosenValue = chosenRect
      if (newMapList[index+1]) {
        newMapList[index+1].visible = true
      }
    }
    else { //clicking on an inactive TreeMap to go back
      newMapList[index].chosenValue = null
      for (let j = newMapList.length-1; j > index; j--){
        if (newMapList[j].key.includes("other")){
          newMapList.splice(j,1)
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
      if (this.state.mapList[i].chosenValue != null && !this.state.mapList[i].chosenValue.includes("Other")){
        return this.state.mapList[i].chosenValue
      }
    }
  }

  otherDepth(index){ //used when "other" comes from "other"
    let depth = 0
    if (!this.state.mapList[index].key.includes("other")){
      return 0
    }
    for (let i = index-1; i>=0; i--){
      if (this.state.mapList[i].key.includes("other")){
        depth++
      }
      else {
        break
      }
    }
    return depth
  }

  render() {
    let treeMaps = []

    for (let i = 0; i < this.state.mapList.length; i++){
      treeMaps.push(
        <div key={this.state.mapList[i].key}
          style={i==0 ? null :
          {position: "absolute", top: `${i*this.getNestPosition().y}px`,
            left: `${i*this.getNestPosition().x}px`,
            boxShadow: "-10px -10px 10px rgba(0, 0, 0, 0.25)"}}>
          <TreeMap width={this.props.width} height={this.props.height}
            data={this.props.data} weightKey={this.props.weightKey}
            titleKey={this.chooseTitleKey(i)}
            parent={i-1 >= 0 ? this.state.mapList[i-1].chosenValue : null}
            otherParent={this.chooseParentifOther(i)}
            otherDepth={this.otherDepth(i)}
            otherThreshold={this.props.otherThreshold} level={i}
            keyOrder={this.props.keyOrder.length == 1 ? [this.props.titleKey] : this.props.keyOrder}
            active={this.state.mapList[i].chosenValue == null}
            visible={this.state.mapList[i].visible}
            handleNest={this.handleNest.bind(this)}
            activateTooltip={this.activateTooltip.bind(this)}
            deactivateTooltip={this.deactivateTooltip.bind(this)}
            colorFunction={this.state.colorFunction}
            colorKey={this.props.colorKey}
            colorPalette={this.props.colorPalette}
            displayPercentages={this.props.displayPercentages}
            initialAnimation={this.props.initialAnimation}/>
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

class TreeMapManagerResponsive extends React.Component {

  render() {
    let child = React.cloneElement(<TreeMapManager data={this.props.data}/>, this.props)

    return (
      <Resize>
        {child}
      </Resize>
    )
  }
}



TreeMapManager.defaultProps = {
  width: 800,
  height: 400,
  titleKey: "title",
  keyOrder: ["title"],
  weightKey: "weight",
  colorFunction: null,
  colorKey: "",
  colorPalette: [
    "#4cab92", "#ca0004", "#8e44ad", "#eccc00",
    "#9dbd5f", "#0097bf", "#005c7a", "#fc6000"
  ],
  otherThreshold: .025,
  displayPercentages: true,
  initialAnimation: true,
  tooltip: false,
  tooltipColor: "dark"
}

TreeMapManager.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  titleKey: PropTypes.string,
  keyOrder: PropTypes.array,
  colorFunction: PropTypes.func,
  colorKey: PropTypes.string,
  colorPalette: PropTypes.array,
  otherThreshold: PropTypes.number,
  displayPercentages: PropTypes.bool,
  initialAnimation: PropTypes.bool,
  tooltip: PropTypes.bool,
  tooltipColor: PropTypes.string,
  TooltipContents: PropTypes.func
}

export default TreeMapManagerResponsive
