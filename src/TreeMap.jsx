import React from "react"
import Squarify from "./Squarify.js"
import isLight from "./isLight.js"
import {spring, Motion} from "react-motion"


class TreeRects extends React.Component {

  render() {
    return(
      <Motion
        defaultStyle={{
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }}
        style={{
          x: spring(this.props.x, {stiffness: 120, damping: 26}),
          y: spring(this.props.y, {stiffness: 120, damping: 26}),
          width: spring(this.props.width, {stiffness: 100, damping: 26}),
          height: spring(this.props.height, {stiffness: 100, damping: 26}),
        }}
      >
        {
          interpolatingStyles =>
            <g>
              <rect
                x={interpolatingStyles.x}
                y={interpolatingStyles.y}
                width={interpolatingStyles.width}
                height={interpolatingStyles.height}
                fill={this.props.fill} />
              <text
                x={interpolatingStyles.x + (interpolatingStyles.width / 2)}
                y={interpolatingStyles.y + (interpolatingStyles.height / 2)}
                textAnchor="middle"
                fill={isLight(this.props.fill) ? this.props.textDark : this.props.textLight}
                fontSize={this.props.textScale * interpolatingStyles.width/25}>
                  {this.props.title}
              </text>
            </g>
        }
      </Motion>
    )
  }
}


class TreeMap extends React.Component {

  render() {
    let s = new Squarify(
      JSON.parse(JSON.stringify(this.props.data)),
      {
        width: this.props.width,
        height: this.props.height,
        weightKey: this.props.weightKey,
      }
    )
    s.layout()

    let colorFunction = null
    if (this.props.colorFunction) {
      console.log("function supplied")
      colorFunction = this.props.colorFunction
    } else if (this.props.colorKey) {
      console.log("colorKey supplied")
      colorFunction = (rawDatum) => {
        return rawDatum[this.props.colorKey]
      }
    } else {
      console.log("colorPalette mode")
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
            textLight={this.props.textLight} textScale={this.props.textScale}
          />
        )
      }
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
  colorFunction: null,
  colorKey: "",
  colorPalette: [
    "#4cab92", "#ca0004", "#003953", "#eccc00",
    "#9dbd5f", "#0097bf", "#005c7a", "#fc6000"
  ],
  textDark: "#222",
  textLight: "#eee",
  textScale: 3.5,
}


export default TreeMap
