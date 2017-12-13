import React from "react"
import isLight from "./isLight.js"
import {spring, Motion} from "react-motion"


class TreeRect extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showTitles: false
    }

    this.addTitles = this.addTitles.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  addTitles() {
    this.setState({showTitles: true})
  }

  handleClick(maxLayers) {
    return () => {
      this.props.handleClick(this.props.level, this.props.title, maxLayers)
    }
  }

  mouseOver() {
    return () => {
      this.props.activateTooltip(
        this.props.titleKey, this.props.title,
        this.props.rectData, this.props.allData
      )
    }
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
          x: spring(this.props.x, {stiffness: 140, damping: 14}),
          y: spring(this.props.y, {stiffness: 140, damping: 14}),
          width: spring(this.props.width, {stiffness: 140, damping: 10}),
          height: spring(this.props.height, {stiffness: 140, damping: 10}),
        }}
        onRest={this.addTitles}
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
              paddingTop: "8px"
            }

            let maxLayers = null
            let clickable = this.props.clickable

            if (this.props.otherRect) {
              let percentageFontSize = Math.sqrt(this.props.percentageScale * this.props.width * this.props.height / 200)

              titleStyle = {
                color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
                textAlign: "left",
                fontSize: `${Math.sqrt(this.props.titleScale * this.props.width * this.props.height / 100)}px`,
                transform: `rotate(270deg) translate(50%, 50%)`,
                transformOrigin: "bottom",
                marginBottom: `${- percentageFontSize / 1.25}px`,
              }

              percentageStyle = {
                color: isLight(this.props.fill) ? this.props.textDark : this.props.textLight,
                textAlign: "center",
                fontSize: `${percentageFontSize}px`,
                opacity: 0.75,
                transform: "translateY(100%)",
                paddingTop: "3px"
              }

              maxLayers = this.props.maxLayers
              clickable = this.props.level < this.props.maxLayers
            }

            let rectContents =
              <foreignObject
                x={this.props.x} y={this.props.y}
                width={this.props.width} height={this.props.height}
                onClick={this.handleClick(maxLayers)}
                onMouseOver={this.mouseOver}
                onMouseOut={this.props.deactivateTooltip}
                style={clickable ? {cursor: "pointer"} : null}
                >
                <div style={{width: "100%", height: "100%", display: "table", padding: "3px"}}>
                  <div style={{display: "table-cell", verticalAlign: "middle"}}>
                    <Motion
                      defaultStyle={{opacity: 0}}
                      style={{
                        opacity: spring(1, {stiffness: 100, damping: 25})
                      }}
                    >
                      {
                        (interpolatingStyles) => {
                          return (
                            <div style={{opacity: interpolatingStyles.opacity}}>
                              <div style={titleStyle}>{this.props.title}</div>
                              <div style={percentageStyle}>{percentage}</div>
                            </div>
                          )
                        }
                      }
                    </Motion>
                  </div>
                </div>
              </foreignObject>

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
                { this.state.showTitles && rectContents}
              </g>
            )
          }
        }
      </Motion>
    )
  }
}

export default TreeRect
