import React from "react"
import Squarify from "./Squarify.js"
import isLight from "./isLight.js"
import {spring, Motion} from "react-motion"


class TreeRects extends React.Component {

  handleClick(e){
    let childData = this.props.data.child
    let nestedMap = null
    if (childData != null) {
      nestedMap = (
        <TreeMap data={childData} weightKey={this.props.weightKey}
          titleKey={this.props.titleRank[1]}
          titleRank={this.props.titleRank.slice(1,this.props.titleRank.length)}/>
      )
    }
    this.props.onClick(nestedMap)
  }

  render() {
    let percentage = null
    if (this.props.displayPercentages) {
      percentage = `${this.props.percentage}%`
    }

    let initialStyle = {
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    }

    if (this.props.initialAnimation) {
      initialStyle = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    }

    return(
      <Motion
        defaultStyle={initialStyle}
        style={{
          x: spring(this.props.x, {stiffness: 120, damping: 26}),
          y: spring(this.props.y, {stiffness: 120, damping: 26}),
          width: spring(this.props.width, {stiffness: 100, damping: 26}),
          height: spring(this.props.height, {stiffness: 100, damping: 26}),
        }}
      >
        {
          (interpolatingStyles) => {
            let titleStyle = {
              color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
              textAlign: "center",
              fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 200)}px`
            }

            let percentageStyle = {
              color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
              textAlign: "center",
              fontSize: `${Math.sqrt(this.props.percentageScale * this.props.width * this.props.height / 200)}px`,
              opacity: 0.75,
            }

            return (
              <g>
                <rect
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  fill={this.props.fill}
                  />
                <foreignObject
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  onClick={this.handleClick.bind(this)}
                  style={this.props.data.child || this.props.active == false ? {cursor:'pointer'} : null}
                  >
                  <div style={{width: "100%", height: "100%", display: "table"}}>
                    <div style={{display: "table-cell", verticalAlign: "middle"}}>
                      <div style={titleStyle}>{this.props.title}</div>
                      <div style={percentageStyle}>{percentage}</div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            )
          }
        }
      </Motion>
    )
  }
}

class OtherRect extends React.Component {

  handleClick(e){
    let childData = this.props.data.child
    let nestedMap = null
    if (childData != null) {
      nestedMap = (
        <TreeMap data={childData} weightKey={this.props.weightKey}
          titleKey={this.props.titleRank[0]} titleRank={this.props.titleRank} />
      )
    }
    this.props.onClick(nestedMap)
  }

  render() {
    let percentage = null
    if (this.props.displayPercentages) {
      percentage = `${this.props.percentage}%`
    }

    let initialStyle = {
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    }

    if (this.props.initialAnimation) {
      initialStyle = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    }

    return(
      <Motion
        defaultStyle={initialStyle}
        style={{
          x: spring(this.props.x, {stiffness: 120, damping: 26}),
          y: spring(this.props.y, {stiffness: 120, damping: 26}),
          width: spring(this.props.width, {stiffness: 100, damping: 26}),
          height: spring(this.props.height, {stiffness: 100, damping: 26}),
        }}
      >
        {
          (interpolatingStyles) => {
            let titleStyle = {
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 100)}px`,
              transform: "rotate(270deg)",
              width: "1px",
              margin: `0px ${this.props.width / 2.3}px ${- this.props.width / 3}px`
            }

            let percentageStyle = {
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: `${Math.sqrt(this.props.percentageScale * this.props.width * this.props.height / 200)}px`,
              opacity: 0.75,
            }

            return (
              <g>
                <rect
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  fill={this.props.fill}
                  />
                <foreignObject
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  onClick={this.handleClick.bind(this)}
                  style={{cursor:'pointer'}}
                  >
                  <div style={{width: "100%", height: "100%", display: "table"}}>
                    <div style={{display: "table-cell", verticalAlign: "middle"}}>
                      <div style={titleStyle}>{this.props.title}</div>
                      <div style={percentageStyle}>{percentage}</div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            )
          }
        }
      </Motion>
    )
  }

}


class TreeMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      nestedMap: null,
      active: true
    }
  }

  onClick(nest) {
    if (nest != null){
      this.setState({
        nestedMap: nest,
        active: false
      })
    }
  }

  onBackClick(){
    this.setState({
      nestedMap: null,
      active: true
    })
  }

  getNestPosition() {
    return this.props.height < this.props.width ? [this.props.height / 8 , this.props.height / 8] : [this.props.width / 8 , this.props.width / 8]
  }

  needOther(testData) {
    var weights = []
    for (let dataPoint of testData) {
      weights.push(dataPoint[this.props.weightKey])
    }
    weights.sort((a, b) => a - b);

    var total = weights.reduce((a, b) => a + b, 0);
    let threshold = (this.props.otherThreshold < .025 ? .025 : this.props.otherThreshold) * total

    let totalForOther = 0
    for (var index = 0; index < weights.length; index++){
      if (weights[index] < threshold){
        totalForOther += weights[index]
      }
      else {
        break
      }
    }

    if (index > 1) {
      let newData = []
      let childArray = []
      for (let dataPoint of testData){
        if (dataPoint[this.props.weightKey] > threshold){
          newData.push(dataPoint)
        }
        else {
          let child = {}
          child[this.props.weightKey] = dataPoint[this.props.weightKey]
          child[this.props.titleKey] = dataPoint[this.props.titleKey]
          childArray.push(child)
        }
      }
      let other = {}
      other[this.props.weightKey] = totalForOther
      other[this.props.titleKey] = "Other"
      other.child = childArray
      newData.push(other)
      return [newData, true, total]
    }
    return [testData, false, total]
  }

  render() {
    const style = {
      inactive: "#808080",
      map: {
        position: "absolute",
        top: `${this.getNestPosition()[0]}px`,
        left: `${this.getNestPosition()[1]}px`,
        boxShadow: "-10px -10px 20px",
      }
    }

    let considerOther = this.needOther(this.props.data)
    let dataToUse = considerOther[0]

    let otherWidth = 0
    let scaleWithOther = 1
    let otherRect = null

    if (considerOther[1] == true){
      let other = dataToUse[dataToUse.length-1]
      let otherArea = (other[this.props.weightKey] / considerOther[2]) * (this.props.width * this.props.height)
      otherWidth = otherArea / this.props.height
      scaleWithOther = considerOther[2] / (considerOther[2] - other[this.props.weightKey])
      otherRect = (
        <OtherRect key="other" data={other}
          x={this.props.width-otherWidth} y={0}
          width={otherWidth} height={this.props.height}
          fill={this.state.active ? "#000000" : style.inactive}
          title="Other" titleScale={this.props.titleScale}
          percentage={(100 * other[this.props.weightKey] / considerOther[2]).toFixed(1)}
          percentageScale={this.props.percentageScale}
          displayPercentages={this.props.displayPercentages}
          initialAnimation={this.props.initialAnimation}
          weightKey={this.props.weightKey}
          titleRank={this.props.titleRank}
          onClick={this.state.active ? this.onClick.bind(this) : this.onBackClick.bind(this)}
        />
      )
    }

    let s = new Squarify(
      JSON.parse(JSON.stringify(
        considerOther[1] == true ? dataToUse.slice(0,dataToUse.length-1) : dataToUse
      )),
      scaleWithOther,
      {
        width: this.props.width-otherWidth,
        height: this.props.height,
        weightKey: this.props.weightKey
      }
    )
    s.layout()

    let colorFunction = null
    if (this.props.colorFunction) {
      colorFunction = this.props.colorFunction
    } else if (this.props.colorKey) {
      colorFunction = (rawDatum) => {
        return rawDatum[this.props.colorKey]
      }
    } else {
      colorFunction = (rawDatum, index) => {
        return this.props.colorPalette[index%this.props.colorPalette.length]
      }
    }

    let rects = []
    let rectIndex = 0
    for (let row of s.rows) {
      for (let datum of row.data) {
        rectIndex += 1
        rects.push(
          <TreeRects key={datum.index} data={datum.raw}
            x={datum.origin.x} y= {datum.origin.y}
            width={datum.dimensions.x} height={datum.dimensions.y}
            fill={this.state.active ? colorFunction(datum.raw, rectIndex) : style.inactive}
            title={datum.raw[this.props.titleKey]}
            maxTitleLength={s.maxTitleLength} textDark={this.props.textDark}
            textLight={this.props.textLight}
            titleScale={this.props.titleScale}
            percentage={datum.weightPercent}
            percentageScale={this.props.percentageScale}
            displayPercentages={this.props.displayPercentages}
            percentLight={this.props.percentLight} percentDark={this.props.percentDark}
            initialAnimation={this.props.initialAnimation}
            weightKey={this.props.weightKey}
            titleRank={this.props.titleRank}
            active={this.state.active}
            onClick={this.state.active ? this.onClick.bind(this) : this.onBackClick.bind(this)}
          />
        )
      }
    }
    if (considerOther[1] == true){
      rects.push(
        otherRect
      )
    }


    return(
      <div style={{position:"relative"}}>
        <svg className="replot replot-treemap"
          width={this.props.width} height={this.props.height}>
          {rects}
        </svg>
        {this.state.nestedMap != null &&
          <div style={style.map}>
            {this.state.nestedMap}
          </div>
        }
      </div>
    )
  }

}



TreeMap.defaultProps = {
  width: 800,
  height: 400,
  titleKey: "title",
  weightKey: "weight",
  otherThreshold: .025,
  colorFunction: null,
  colorKey: "",
  colorPalette: [
    "#4cab92", "#ca0004", "#003953", "#eccc00",
    "#9dbd5f", "#0097bf", "#005c7a", "#fc6000"
  ],
  grayscalePalette: [
    "#080808", "#282828", "#484848", "#686868",
    "#808080", "#A0A0A0", "#B0B0B0", "#C8C8C8"
  ],
  textDark: "#222",
  textLight: "#eee",
  titleScale: 3.5,
  percentageScale: 2.5,
  displayPercentages: true,
  initialAnimation: true,
}


export default TreeMap
