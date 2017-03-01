import React from "react"
import Squarify from "./Squarify.js"
import {spring, Motion} from "react-motion"


class TreeRects extends React.Component {

  render() {
    return(
      <g>
        <Motion
          defaultStyle={{
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          }}
          style={{
            x: spring(this.props.x),
            y: spring(this.props.y),
            width: spring(this.props.width),
            height: spring(this.props.height),
          }}
        >
          {
            interpolatingStyles =>
              <rect
                x={interpolatingStyles.x}
                y={interpolatingStyles.y}
                width={interpolatingStyles.width}
                height={interpolatingStyles.height}
                fill={this.props.fill} />
          }
        </Motion>
      </g>
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
        weightKey: this.props.weightKey
      }
    )
    s.layout()
    let rows = []
    for (let row of s.rows) {
      for (let datum of row.data) {
        rows.push(
          <TreeRects key={row.index} x={row.origin.x} y= {row.origin.y}
            width={row.dimensions.x} height={row.dimensions.y}
            fill={datum[this.props.colorKey]}
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
  height: 550,
  titleKey: "title",
  weightKey: "weight",
  colorKey: "color",
}


export default TreeMap
