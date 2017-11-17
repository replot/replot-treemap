import React from "react"
import Squarify from "./Squarify.js"
import {TreeRects, OtherRect} from "./Rectangles.jsx"


class TreeMap extends React.Component {

  needOther(testData) { //Determines if an "other" cluster is necessary, and adjusts the data if so
    let newData = []
    let weights = []
    for (let dataPoint of testData) {
      weights.push(dataPoint[this.props.weightKey])
    }

    let total = weights.reduce((a, b) => a + b, 0)
    let threshold = (this.props.otherThreshold) * total

    let totalForOther = 0
    let numOther = 0
    for (var index = 0; index < weights.length; index++){
      if (weights[index] < threshold){
        totalForOther += weights[index]
        numOther++
      }
    }

    if (numOther > 1) {
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
    for (let dataPoint of testData){
      if (dataPoint[this.props.weightKey] > 0){ //Don't consider data points with negative or 0 value
        newData.push(dataPoint)
      }
    }
    return [newData, false, total]
  }

  pickData(data, titleKey) {
    let relevantData = []
    if (this.props.parent == "Other"){ //Data for a treemap from "other"
      let parentTitleKey = null
      if (this.props.otherParent) {
        parentTitleKey = this.props.keyOrder[this.props.keyOrder.indexOf(titleKey) - 1]
      }

      let weights = []
      for (let dataPoint of data) {
        if (dataPoint[parentTitleKey] == this.props.otherParent){
          weights.push(dataPoint[this.props.weightKey])
        }
      }

      let total = weights.reduce((a, b) => a + b, 0)
      let threshold = (this.props.otherThreshold < .025 ?
        .025 : this.props.otherThreshold) * total

      if (this.props.otherDepth > 0){
        for (let i = 0; i < this.props.otherDepth; i++){
          weights = weights.filter(function(weight){
            return (weight < threshold)
          })
          total = weights.reduce((a, b) => a + b, 0)
          threshold = (this.props.otherThreshold < .025 ?
            .025 : this.props.otherThreshold) * total
        }
      }

      for (let dataPoint of data){
        if (parentTitleKey) { //Case in which the "other" rect is not on the foundation treemap
          if (dataPoint[parentTitleKey] == this.props.otherParent
            && !relevantData.some(function(el) {
              return el[titleKey] === dataPoint[titleKey]
            })) {
            let total = 0
            for (let subData of data){
              if (subData[titleKey] === dataPoint[titleKey]){
                total += subData[this.props.weightKey]
              }
            }
            if (total <= threshold) {
              let newPoint = {}
              newPoint[this.props.weightKey] = total
              newPoint[titleKey] = dataPoint[titleKey]
              relevantData.push(newPoint)
            }
          }
        } else { //Case in which the "other" rect comes from the foundation treemap
          if (!relevantData.some(function(el) {
            return el[titleKey] === dataPoint[titleKey]
          })) {
            let total = 0
            for (let subData of data){
              if (subData[titleKey] === dataPoint[titleKey]){
                total += subData[this.props.weightKey]
              }
            }
            if (total <= threshold) {
              let newPoint = {}
              newPoint[this.props.weightKey] = total
              newPoint[titleKey] = dataPoint[titleKey]
              relevantData.push(newPoint)
            }
          }
        }

      }
    }
    else { //Data for any treemap that does not come from "other"
      let parentTitleKey = null
      if (this.props.parent) {
        parentTitleKey = this.props.keyOrder[this.props.keyOrder.indexOf(titleKey) - 1]
      }

      for (let dataPoint of data){
        if (parentTitleKey) { //Data for any treemap that is not the foundation treemap
          if (dataPoint[parentTitleKey] == this.props.parent && !relevantData.some(function(el) { return el[titleKey] === dataPoint[titleKey]})){
            let total = 0
            for (let subData of data){
              if (subData[titleKey] === dataPoint[titleKey]){
                total += subData[this.props.weightKey]
              }
            }
            let newPoint = {}
            newPoint[this.props.weightKey] = total
            newPoint[titleKey] = dataPoint[titleKey]
            relevantData.push(newPoint)
          }
        } else {//Data for the foundation treemap
          if (!relevantData.some(function(el) { return el[titleKey] === dataPoint[titleKey]})){
            let total = 0
            for (let subData of data){
              if (subData[titleKey] === dataPoint[titleKey]){
                total += subData[this.props.weightKey]
              }
            }
            let newPoint = {}
            newPoint[this.props.weightKey] = total
            newPoint[titleKey] = dataPoint[titleKey]
            relevantData.push(newPoint)
          }
        }
      }
    }

    return relevantData
  }

  getRectData(key, value, weight){
    let data = []
    if (value === "Other") {
      let threshold = (this.props.otherThreshold < .025 ?
        .025 : this.props.otherThreshold) * weight


      let parentTitleKey = null
      if (this.props.parent){
        parentTitleKey = this.props.keyOrder[this.props.keyOrder.indexOf(key) - 1]
      }

      for (let dataPoint of this.props.data){
        if (parentTitleKey){
          if (dataPoint[parentTitleKey] == this.props.parent) {
            let total = 0
            for (let subData of this.props.data){
              if (subData[key] === dataPoint[key]){
                total += subData[this.props.weightKey]
              }
            }
            if (total <= threshold) {
              data.push(dataPoint)
            }
          }
        } else {
          let total = 0
          for (let subData of this.props.data){
            if (subData[key] === dataPoint[key]){
              total += subData[this.props.weightKey]
            }
          }
          if (total <= threshold) {
            data.push(dataPoint)
          }
        }
      }
    }
    else {
      if (this.props.parent) {
        let parentTitleKey = this.props.keyOrder[this.props.keyOrder.indexOf(key) - 1]
        for (let dataPoint of this.props.data){
          if (dataPoint[parentTitleKey] === this.props.parent && dataPoint[key] === value) {
            data.push(dataPoint)
          }
        }
      } else {
        for (let dataPoint of this.props.data){
          if (dataPoint[key] === value){
            data.push(dataPoint)
          }
        }
      }
    }
    return data
  }

  colorFunc(i, rectData){
    if (this.props.color instanceof Array) {
      return this.props.color[i%this.props.color.length]
    } else {
      return this.props.color(i, rectData)
    }
  }

  render() {

    if (!this.props.visible) {
      return (
        <div style={{display: "none"}} />
      )
    }

    let formattedData = this.pickData(this.props.data, this.props.titleKey)
    let considerOther = this.needOther(formattedData)
    formattedData = considerOther[0]

    let otherWidth = 0

    if (considerOther[1] == true){
      let otherArea = (formattedData[formattedData.length-1][this.props.weightKey]
        / considerOther[2]) * (this.props.width * this.props.height)
      otherWidth = otherArea / this.props.height
    }

    let s = new Squarify(
      JSON.parse(JSON.stringify(
        considerOther[1] == true ? formattedData.slice(0,formattedData.length-1) : formattedData
      )),
      {
        width: this.props.width-otherWidth,
        height: this.props.height,
        weightKey: this.props.weightKey,
        dataTotal: this.props.dataTotal
      }
    )
    s.layout()

    let rects = []
    let rectIndex = 0
    for (let row of s.rows) {
      for (let datum of row.data) {
        rects.push(
          <TreeRects key={datum.index} data={datum.raw} allData={this.props.data}
            rectData={this.getRectData(this.props.titleKey, datum.raw[this.props.titleKey])}
            x={datum.origin.x} y= {datum.origin.y}
            width={datum.dimensions.x} height={datum.dimensions.y}
            fill={this.colorFunc.bind(this)} index={rectIndex}
            titleKey={this.props.titleKey} title={datum.raw[this.props.titleKey]}
            level={this.props.level}
            weightKey={this.props.weightKey}
            maxTitleLength={s.maxTitleLength} textDark={this.props.textDark}
            textLight={this.props.textLight}
            titleScale={this.props.titleScale}
            percentage={datum.weightPercent}
            percentageScale={this.props.percentageScale}
            displayPercentages={this.props.displayPercentages}
            initialAnimation={this.props.initialAnimation}
            clickable={this.props.titleKey!=this.props.keyOrder[this.props.keyOrder.length-1]
              || !this.props.active}
            handleClick={this.props.handleClick}
            activateTooltip={this.props.activateTooltip}
            deactivateTooltip={this.props.deactivateTooltip}
          />
        )
        rectIndex += 1
      }
    }
    if (considerOther[1] == true){
      rects.push(
        <OtherRect key="other" data={formattedData[formattedData.length-1]}
          rectData={this.getRectData(this.props.titleKey, "Other", considerOther[2])}
          allData={this.props.data}
          x={this.props.width-otherWidth} y={0}
          width={otherWidth} height={this.props.height}
          fill={this.colorFunc.bind(this)} index={rectIndex}
          titleKey={this.props.titleKey} title="Other"
          titleScale={this.props.titleScale} level={this.props.level}
          maxLayers = {this.props.maxLayers}
          weightKey={this.props.weightKey}
          textDark={this.props.textDark} textLight={this.props.textLight}
          titleScale={this.props.titleScale}
          percentage={(100 * formattedData[formattedData.length-1][this.props.weightKey] / this.props.dataTotal).toFixed(1)}
          percentageScale={this.props.percentageScale}
          displayPercentages={this.props.displayPercentages}
          initialAnimation={this.props.initialAnimation}
          handleClick={this.props.handleClick}
          activateTooltip={this.props.activateTooltip}
          deactivateTooltip={this.props.deactivateTooltip}
        />
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
  grayscalePalette: [
    "#080808", "#282828", "#484848", "#686868",
    "#808080", "#A0A0A0", "#B0B0B0", "#C8C8C8"
  ],
  textDark: "#222",
  textLight: "#eee",
  percentageScale: 2.5,
  maxLayers: 3,
}


export default TreeMap
