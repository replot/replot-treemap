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
    let threshold = (this.props.otherThreshold < .025 ?
      .025 : this.props.otherThreshold) * total

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
      if (dataPoint[this.props.weightKey] > 0){
        newData.push(dataPoint)
      }
    }
    return [newData, false, total]
  }

  // unflattenData(data, ranking){ //Converts the data from flat to our usable form
  //   let unflattenedData = []
  //   for (let dataPoint of data){
  //     if (!unflattenedData.some(function(el) { return el[ranking[0]] === dataPoint[ranking[0]]})){
  //       let total = 0
  //       let child = []
  //       for (let subData of data){
  //         if (subData[ranking[0]] == dataPoint[ranking[0]]){
  //           total += subData[this.props.weightKey]
  //           let dataPiece = {}
  //           dataPiece[this.props.weightKey] = subData[this.props.weightKey]
  //           for (let i = 1; i <= ranking.length; i++){
  //             dataPiece[ranking[i]] = subData[ranking[i]]
  //           }
  //           child.push(dataPiece)
  //         }
  //       }
  //       if (child.length > 0){
  //         let parentPoint = {}
  //         parentPoint[this.props.weightKey] = total
  //         parentPoint[ranking[0]] = dataPoint[ranking[0]]
  //         parentPoint.child = child
  //         unflattenedData.push(parentPoint)
  //       }
  //     }
  //   }
  //   return unflattenedData
  // }
  //
  // hasChildren(data){ //Determines if the data needs to be unflattened
  //   for (let dataPoint of data){
  //     for (let key in dataPoint){
  //       if (key == "child"){
  //         return true
  //       }
  //     }
  //     if (Object.keys(dataPoint).length <= 2){
  //       return true
  //     }
  //   }
  //   return false
  // }

  pickData(data, title) {
    let relevantData = []
    if (!this.props.parent) {
      for (let dataPoint of data){
        if (!relevantData.some(function(el) { return el[title] === dataPoint[title]})){
          let total = 0
          for (let subData of data){
            if (subData[title] === dataPoint[title]){
              total += subData[this.props.weightKey]
            }
          }
          let newPoint = {}
          newPoint[this.props.weightKey] = total
          newPoint[title] = dataPoint[title]
          relevantData.push(newPoint)
        }
      }
    }
    else {
      let parentTitleKey = this.props.keyOrder[this.props.keyOrder.indexOf(title) - 1]
      for (let dataPoint of data){
        if (dataPoint[parentTitleKey] == this.props. parent && !relevantData.some(function(el) { return el[title] === dataPoint[title]})){
          let total = 0
          for (let subData of data){
            if (subData[title] === dataPoint[title]){
              total += subData[this.props.weightKey]
            }
          }
          let newPoint = {}
          newPoint[this.props.weightKey] = total
          newPoint[title] = dataPoint[title]
          relevantData.push(newPoint)
        }
      }
    }
    return relevantData
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
    let scaleWithOther = 1

    if (considerOther[1] == true){
      let otherArea = (formattedData[formattedData.length-1][this.props.weightKey]
        / considerOther[2]) * (this.props.width * this.props.height)
      otherWidth = otherArea / this.props.height
      scaleWithOther = considerOther[2]
        / (considerOther[2] - formattedData[formattedData.length-1][this.props.weightKey])
    }

    let s = new Squarify(
      JSON.parse(JSON.stringify(
        considerOther[1] == true ? formattedData.slice(0,formattedData.length-1) : formattedData
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
        if (this.props.active) {
          return this.props.colorPalette[index%this.props.colorPalette.length]
        }
        return this.props.grayscalePalette[index%this.props.grayscalePalette.length]
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
            fill={colorFunction(datum.raw, rectIndex)}
            titleKey={this.props.titleKey} title={datum.raw[this.props.titleKey]}
            maxTitleLength={s.maxTitleLength} textDark={this.props.textDark}
            textLight={this.props.textLight}
            titleScale={this.props.titleScale}
            percentage={datum.weightPercent}
            percentageScale={this.props.percentageScale}
            displayPercentages={this.props.displayPercentages}
            initialAnimation={this.props.initialAnimation}
            canNest={this.props.titleKey!=this.props.keyOrder[this.props.keyOrder.length-1]}
            handleNest={this.props.handleNest}
          />
        )
      }
    }
    if (considerOther[1] == true){
      rectIndex += 1
      rects.push(
        <OtherRect key="other" data={formattedData[formattedData.length-1]}
          x={this.props.width-otherWidth} y={0}
          width={otherWidth} height={this.props.height}
          fill={colorFunction(formattedData[formattedData.length-1],rectIndex)}
          titleKey={this.props.titleKey} title="Other" titleScale={this.props.titleScale}
          textDark={this.props.textDark} textLight={this.props.textLight}
          titleScale={this.props.titleScale}
          percentage={(100 * formattedData[formattedData.length-1][this.props.weightKey] / considerOther[2]).toFixed(1)}
          percentageScale={this.props.percentageScale}
          displayPercentages={this.props.displayPercentages}
          initialAnimation={this.props.initialAnimation}
          handleNest={this.props.handleNest}
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
  width: 800,
  height: 400,
  titleKey: "title",
  keyOrder: ["title"],
  weightKey: "weight",
  otherThreshold: .025,
  colorFunction: null,
  colorKey: "",
  colorPalette: [
    "#4cab92", "#ca0004", "#8e44ad", "#eccc00",
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
