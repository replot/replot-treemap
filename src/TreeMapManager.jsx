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
      map.shadowLevel = 0
      this.state.mapList.push(map)
    }
    this.timeouts = []
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
    this.setState({
      tooltipContents: newContents,
      mouseOver: true,
    })
  }

  deactivateTooltip() {
    this.setState({
      mouseOver: false
    })
  }

  updateMousePosition(e) {
    this.setState({
      mouseX: e.pageX,
      mouseY: e.pageY - 12
    })
  }

  handleClick(level, chosenRect, maxLayers) {
    let newMapList = this.state.mapList.slice()
    let index = level
    if (newMapList[index].chosenValue != null) {
      newMapList[index].chosenValue = null
      for (let j = newMapList.length-1; j > index; j--){
        if (newMapList[j].key.includes("other")){
          newMapList.splice(j,1)
        }
        else{
          newMapList[j].visible = false
          newMapList[j].chosenValue = null
          newMapList[j].shadowLevel = 0
          for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i])
          }
        }
      }
    } else if (chosenRect == "Other"){ //clicking on an active map, specifically the "other" rect
      if (level < maxLayers) {
        let newOtherMap = {}
        newOtherMap.key = "other" + (level+1)
        newOtherMap.visible = true
        newOtherMap.chosenValue = null
        newOtherMap.shadowLevel = 0
        newMapList.splice(index+1, 0, newOtherMap)
        if (level + 1 < newMapList.length && newMapList[level.chosenValue] == null) {
          this.interpolateShadow(newMapList, level + 1)
        }
        newMapList[index].chosenValue = chosenRect
      }
    } else if (!newMapList[index].chosenValue && index != (newMapList.length-1)) {
      //clicking on an active map to go forward, not "other" rect and not last level
      if (level + 1 < newMapList.length && newMapList[level.chosenValue] == null) {
        this.interpolateShadow(newMapList, level + 1)
      }
      newMapList[index].chosenValue = chosenRect
      if (newMapList[index+1]) {
        newMapList[index+1].visible = true
      }
    }
    this.setState({
      mapList: newMapList
    })
  }

  interpolateShadow(newMapList, index){
    for (let i = 1; i <= 10; i++){
      this.timeouts.push(
        setTimeout(() => {
          newMapList[index].shadowLevel = i
          this.setState({mapList: newMapList})
        }, 750 + (i*50))
      )
    }
  }

  getShadow(level) {
    return `-10px -10px 10px rgba(0, 0, 0, ${level*.07})`
  }

  getNestPosition() {
    return this.props.height < this.props.width ?
      this.props.height / 8 :
      this.props.width / 8
  }

  chooseTitleKey(index){
    for (let i = index; i >=0 ; i--){
      if (!this.state.mapList[i].key.includes("other")){
        return this.state.mapList[i].key
      }
    }
  }

  chooseParentIfOther(index){
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
    let dataTotal = 0
    for (let dataPoint of this.props.data) {
      dataTotal += dataPoint[this.props.weightKey]
    }

    let treeMaps = []
    for (let i = 0; i < this.state.mapList.length; i++){
      treeMaps.push(
        <div key={this.state.mapList[i].key}
          style={i==0 ? null :
          {position: "absolute", top: `${i*this.getNestPosition()}px`,
            left: `${i*this.getNestPosition()}px`,
            boxShadow: `${this.getShadow(this.state.mapList[i].shadowLevel)}`}}>
          <TreeMap width={this.props.width} height={this.props.height}
            data={this.props.data} weightKey={this.props.weightKey}
            titleKey={this.chooseTitleKey(i)}
            color={this.props.color} dataTotal={dataTotal}
            parent={i-1 >= 0 ? this.state.mapList[i-1].chosenValue : null}
            otherParent={this.chooseParentIfOther(i)}
            otherDepth={this.otherDepth(i)}
            otherThreshold={this.props.otherThreshold} level={i}
            keyOrder={this.props.keyOrder.length == 1 ? [this.props.titleKey] : this.props.keyOrder}
            active={this.state.mapList[i].chosenValue == null}
            visible={this.state.mapList[i].visible}
            handleClick={this.handleClick.bind(this)}
            activateTooltip={this.activateTooltip.bind(this)}
            deactivateTooltip={this.deactivateTooltip.bind(this)}
            colorFunction={this.state.colorFunction}
            colorKey={this.props.colorKey}
            colorPalette={this.props.colorPalette}
            displayPercentages={this.props.displayPercentages}
            initialAnimation={this.props.initialAnimation} />
        </div>
      )
    }

    return (
      <div onMouseMove={this.props.tooltip ? this.updateMousePosition.bind(this) : null}>
        {this.props.tooltip &&
          <Tooltip
            x={this.state.mouseX} y={this.state.mouseY}
            active={this.state.mouseOver}
            contents={this.state.tooltipContents}
            colorScheme={this.props.tooltipColor}
          />
        }
        <div style={{height: `${this.props.height + (this.state.mapList.length-1)*(this.getNestPosition())}px`,
          width: `${this.props.width + (this.state.mapList.length-1)*(this.getNestPosition())}px`,
          position: "relative", textAlign: "initial"}}>
          {treeMaps}
        </div>
      </div>
    )
  }

}

class TreeMapManagerResponsive extends React.Component {

  render() {

    return (
      <Resize width={this.props.width}>
        <TreeMapManager {...this.props} />
      </Resize>
    )
  }
}

TreeMapManagerResponsive.defaultProps = {
  width: 800
}

TreeMapManager.defaultProps = {
  height: 400,
  titleKey: "title",
  keyOrder: ["title"],
  weightKey: "weight",
  color: [
    "#FEA30D", "#FD7C54", "#D1638C", "#AE41B8",
    "#7A1FDF", "#4A46DA", "#0071BB", "#2D95EA", "#9FBAF7"
  ],
  otherThreshold: .025,
  displayPercentages: true,
  initialAnimation: true
}

TreeMapManager.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  titleKey: PropTypes.string,
  keyOrder: PropTypes.array,
  weightKey: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  otherThreshold: PropTypes.number,
  displayPercentages: PropTypes.bool,
  initialAnimation: PropTypes.bool,
  tooltip: PropTypes.bool,
  tooltipColor: PropTypes.string,
  tooltipContents: PropTypes.func
}

export default TreeMapManagerResponsive
