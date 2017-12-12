import React from "react"
import TreeMapManager from "./TreeMapManager.jsx"
import {Resize} from "replot-core"

class TreeMapManagerTooltip extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tooltipContents: null,
      mouseOver: false,
      mouseX: null,
      mouseY: null
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
    // this.setState({
    //   tooltipContents: newContents,
    //   mouseOver: true,
    // })
  }

  deactivateTooltip() {
    // this.setState({
    //   mouseOver: false
    // })
  }

  updateMousePosition(e) {
    if (this.props.tooltip) {
      this.setState({
        mouseX: e.pageX,
        mouseY: e.pageY - 12
      })
    }
  }

  render() {
    return (
      <div>
        <div onMouseMove={this.updateMousePosition.bind(this)}>
          {this.props.tooltip &&
            <Tooltip
              x={this.state.mouseX} y={this.state.mouseY}
              active={this.state.mouseOver}
              contents={this.state.tooltipContents}
              colorScheme={this.props.tooltipColor}
            />
          }
          <TreeMapManager {...this.props}
            activateTooltip={this.activateTooltip.bind(this)}
            deactivateTooltip={this.activateTooltip.bind(this)}
            keyOrder={this.props.keyOrder.length == 1 ? [this.props.titleKey] : this.props.keyOrder} />
        </div>
      </div>
    )
  }
}

class TreeMapManagerResponsive extends React.Component {

  render() {
    return (
      <Resize width={this.props.width}>
        <TreeMapManagerTooltip {...this.props} />
      </Resize>
    )
  }
}


TreeMapManagerResponsive.defaultProps = {
  width: 800
}


export default TreeMapManagerResponsive
