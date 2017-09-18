import React from "react"
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

            if (Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 200) * 4 > this.props.width){
              titleStyle.transform = "rotate(270deg)"
              titleStyle.width = "1px"
              titleStyle.margin = `${this.props.width * 1.3}px ${this.props.width / 2.25}px ${- this.props.width / 3}px`
              percentageStyle.margin = `${this.props.width / 6}px 0 0 0`
            }

            return (
              <g>
                <rect
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  fill={this.props.fill(this.props.index + this.props.level, this.props.rectData)}
                  />
                <foreignObject
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  onClick={this.props.handleClick.bind(this,
                    this.props.level, this.props.title)}
                  onMouseOver={this.props.activateTooltip.bind(this,
                    this.props.titleKey, this.props.title,
                    this.props.rectData, this.props.allData)}
                  onMouseOut={this.props.deactivateTooltip}
                  style={this.props.clickable ? {cursor: "pointer"} : null}
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
            let percentageFontSize = Math.sqrt(this.props.percentageScale * this.props.width * this.props.height / 200);

            let titleStyle = {
              color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
              textAlign: "left",
              fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 100)}px`,
              transform: `rotate(270deg) translate(50%, 50%)`,
              transformOrigin: "bottom",
              marginBottom: `${- percentageFontSize / 1.25}px`,
            }

            let percentageStyle = {
              color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
              textAlign: "center",
              fontSize: `${percentageFontSize}px`,
              opacity: 0.75,
              transform: "translateY(100%)",
            }

            return (
              <g>
                <rect
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  fill={this.props.fill(this.props.index + this.props.level, this.props.rectData)}
                  />
                <foreignObject
                  x={interpolatingStyles.x}
                  y={interpolatingStyles.y}
                  width={interpolatingStyles.width}
                  height={interpolatingStyles.height}
                  onClick={this.props.handleClick.bind(this,
                    this.props.level, this.props.title)}
                  onMouseOver={this.props.activateTooltip.bind(this,
                    this.props.titleKey, this.props.title,
                    this.props.rectData, this.props.allData)}
                  onMouseOut={this.props.deactivateTooltip}
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

export {TreeRects, OtherRect}
