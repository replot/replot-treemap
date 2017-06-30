import React from "react"
import isLight from "./isLight.js"
import {spring, Motion} from "react-motion"

class TreeRects extends React.Component {

  handleNest() {
    this.props.handleNest(this.props.titleKey, this.props.title)
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
                  onClick={this.handleNest.bind(this)}
                  style={this.props.canNest ? {cursor: "pointer"} : null}
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

  handleNest() {
    this.props.handleNest(this.props.titleKey, this.props.title)
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
              fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 100)}px`,
              transform: "rotate(270deg)",
              width: "1px",
              margin: `0px ${this.props.width / 2.3}px ${- this.props.width / 3}px`
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
                  onClick={this.handleNest.bind(this)}
                  style={{cursor: "pointer"}}
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

module.exports = {
  TreeRects,
  OtherRect
}
