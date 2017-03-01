// Implementation of Squarified Treemap algorithm (proposed by Bruls et al)

class Squarify {

  constructor(data, options) {
    this.data = data
    this.totalHeight = options.height
    this.totalWidth = options.width
    this.remainingX = options.width
    this.remainingY = options.height
    this.weightKey = options.weightKey
    this.rows = []
    this.totalWeight = 0.0
    for (let member of this.data) {
      this.totalWeight += member[this.weightKey]
    }
    this.data.sort((a, b) => a[this.weightKey] - b[this.weightKey])
  }

  worstRatio(rowData, rowWidth) {
    if (!rowData || rowData.length <= 0) {
      return 0
    }

    let rowMin = Math.max(this.totalWidth, this.totalHeight) + 1
    let rowMax = -1
    let rowSum = 0

    for (let member of rowData) {
      rowSum += member[this.weightKey]
      if (member[this.weightKey] < rowMin) {
        rowMin = member[this.weightKey]
      }
      if (member[this.weightKey] > rowMax) {
        rowMax = member[this.weightKey]
      }
    }

    const squareWidth = rowWidth*rowWidth
    const squareSum = rowSum*rowSum
    let ratio = Math.max(
      squareWidth*rowMax/squareSum,
      squareSum/(squareWidth*rowMin)
    )
    return ratio
  }

  freezeRow(row) {
    row[this.weightKey] = 0

    for (let member of row.data) {
      row[this.weightKey] += member[this.weightKey]
    }

    // Convert weight to area
    row.area = this.totalWidth*this.totalHeight*row[this.weightKey]/this.totalWeight

    if (row.type == "vertical") {
      row.dimensions.y = row.width
      row.dimensions.x = row.area / row.dimensions.y
      this.remainingX = this.remainingX - row.dimensions.x
    } else {
      row.dimensions.x = row.width
      row.dimensions.y = row.area / row.dimensions.x
      this.remainingY = this.remainingY - row.dimensions.y
    }

    this.rows.push(row)

    return row
  }

  createRow(prevRow) {
    let newRow = {data: [], dimensions: {x: 0, y: 0}}

    if (!prevRow) {
      newRow.origin = {
        x: 0,
        y: 0
      }
      newRow.index = 1
    } else {
      newRow.index = prevRow.index + 1
      if (prevRow.type == "vertical") {
        newRow.origin = {
          x: prevRow.origin.x + prevRow.dimensions.x,
          y: prevRow.origin.y
        }
      } else {
        newRow.origin = {
          x: prevRow.origin.x,
          y: prevRow.origin.y + prevRow.dimensions.y
        }
      }
    }

    if (this.remainingX > this.remainingY) {
      newRow.type = "vertical"
      newRow.width = this.remainingY
    } else {
      newRow.type = "horizontal"
      newRow.width = this.remainingX
    }

    return newRow
  }

  squarify(row) {

    if (!this.data || this.data.length <= 0) {
      this.freezeRow(row)
      return
    }

    let modifiedData = row.data.concat(this.data[this.data.length - 1])

    if (this.worstRatio(row.data, row.width) <= this.worstRatio(modifiedData, row.width)) {
      this.data.pop()
      row.data = modifiedData
      this.squarify(row)
    } else {
      let frozenRow = this.freezeRow(row)
      let newRow = this.createRow(frozenRow)
      this.squarify(newRow)
    }
  }

  layout() {
    let emptyRow = this.createRow()
    this.squarify(emptyRow)
  }
}


export default Squarify
