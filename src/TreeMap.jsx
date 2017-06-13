import React from "react"
import Squarify from "./Squarify.js"
import isLight from "./isLight.js"
import {spring, Motion} from "react-motion"


class TreeRects extends React.Component {


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
                  height={interpolatingStyles.height}>
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
              fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 200)}px`,
              // transform: "rotate(270deg)"
              width: "1px",
              wordWrap: "break-word",
              margin: "0 auto"
              // whiteSpace: "pre",
            }

            let percentageStyle = {
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: `${Math.sqrt(this.props.percentageScale * this.props.width * this.props.height / 200)}px`,
              // paddingTop: "10px",
              opacity: 0.75,
            }

            return (
              <g>
                <rect
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  fill="#000000"
                  />
                <foreignObject
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}>
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

  needOther(testData) {
    var weights = []
    for (let dataPoint of testData) {
      weights.push(dataPoint[this.props.weightKey])
    }
    weights.sort((a, b) => a - b);

    var total = weights.reduce((a, b) => a + b, 0);
    let threshold = this.props.otherThreshold

    let totalForOther = 0
    for (var i = 0; i < weights.length; i++){
      if (weights[i] < threshold){
        totalForOther += weights[i]
      }
      else {
        break
      }
    }

    if (i > 1) {
      let newData = []
      for (let dataPoint of testData){
        if (dataPoint[this.props.weightKey] > threshold){
          newData.push(dataPoint)
        }
      }
      let other = {}
      other[this.props.weightKey] = totalForOther
      other[this.props.titleKey] = "Other"
      newData.push(other)
      return [newData, true, total]
    }
    return [testData, false, total]
  }


  render() {
    let considerOther = this.needOther(this.props.data)
    let dataToUse = considerOther[0]
    let otherWidth = 0
    let otherRect = null
    if (considerOther[1] == true){
      let other = dataToUse.splice(dataToUse.length-1,1)
      let otherArea = (other[0][this.props.weightKey] / considerOther[2]) * (this.props.width * this.props.height)
      otherWidth = otherArea / this.props.height
      otherRect = <OtherRect key="other" x={this.props.width-otherWidth} y={0}
        width={otherWidth} height={this.props.height}
        title="Other" titleScale={this.props.titleScale}
        percentage={(100 * other[0][this.props.weightKey] / considerOther[2]).toFixed(1)}
        percentageScale={this.props.percentageScale}
        displayPercentages={this.props.displayPercentages}
        initialAnimation={this.props.initialAnimation}
      />
    }

    let s = new Squarify(
      JSON.parse(JSON.stringify(dataToUse)),
      {
        width: this.props.width-otherWidth,
        height: this.props.height,
        weightKey: this.props.weightKey,
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
          <TreeRects key={datum.index} x={datum.origin.x} y= {datum.origin.y}
            width={datum.dimensions.x} height={datum.dimensions.y}
            fill={colorFunction(datum.raw, rectIndex)}
            title={datum.raw[this.props.titleKey]}
            maxTitleLength={s.maxTitleLength} textDark={this.props.textDark}
            textLight={this.props.textLight}
            titleScale={this.props.titleScale}
            percentage={datum.weightPercent}
            percentageScale={this.props.percentageScale}
            displayPercentages={this.props.displayPercentages}
            percentLight={this.props.percentLight} percentDark={this.props.percentDark}
            initialAnimation={this.props.initialAnimation}
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
      <svg className="replot replot-treemap"
        width={this.props.width} height={this.props.height}>
        {rects}
      </svg>
    )
  }

}


TreeMap.defaultProps = {
  width: 800,
  height: 400,
  titleKey: "title",
  weightKey: "weight",
  otherThreshold: 0,
  colorFunction: null,
  colorKey: "",
  colorPalette: [
    "#4cab92", "#ca0004", "#003953", "#eccc00",
    "#9dbd5f", "#0097bf", "#005c7a", "#fc6000"
  ],
  textDark: "#222",
  textLight: "#eee",
  titleScale: 3.5,
  percentageScale: 2.5,
  displayPercentages: true,
  initialAnimation: true,
}


export default TreeMap
