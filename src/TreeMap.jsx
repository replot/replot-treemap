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
                fill={isLight(this.props.fill) ? "#222" : "#eee"}
                fontSize={interpolatingStyles.width/this.props.maxTitleLength}>
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
        titleKey: this.props.titleKey,
        colorKey: this.props.colorKey,
      }
    )
    s.layout()
    console.log(s)
    let rows = []
    for (let row of s.rows) {
      for (let datum of row.data) {
        rows.push(
          <TreeRects key={datum.index} x={datum.origin.x} y= {datum.origin.y}
            width={datum.dimensions.x} height={datum.dimensions.y}
            fill={datum[this.props.colorKey]} title={datum[this.props.titleKey]}
            maxTitleLength={s.maxTitleLength}
          />
        )
      }
    }

    return(
      <svg width={this.props.width} height={this.props.height}>
        {rows}
      </svg>
    )
  }

}


TreeMap.defaultProps = {
  width: 800,
  height: 400,
  titleKey: "title",
  weightKey: "weight",
  colorKey: "color",
}


export default TreeMap
