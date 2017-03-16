// Implementation of Squarified Treemap algorithm (proposed by Bruls et al)

class Squarify {

  constructor(data, options) {
    this.data = data
    this.totalHeight = options.height
    this.totalWidth = options.width
    this.weightKey = options.weightKey
    // Computed properties
    this.remainingX = this.totalWidth
    this.remainingY = this.totalHeight
    this.totalArea = this.totalWidth * this.totalHeight
    this.rows = []
    this.totalWeight = 0.0
    for (let member of this.data) {
      this.totalWeight += member[this.weightKey]
    }
    this.data.sort((a, b) => a[this.weightKey] - b[this.weightKey])
  }

  squareness(rowData, fixedSide) {
    if (!rowData || rowData.length <= 0) {
      return 0
    }

    let areaScale = this.totalArea/this.totalWeight

    let rectMinArea = this.totalArea + 1
    let rectMaxArea = -1
    let rowArea = 0

    for (let member of rowData) {
      rowArea += areaScale*member[this.weightKey]
      if (areaScale*member[this.weightKey] < rectMinArea) {
        rectMinArea = areaScale*member[this.weightKey]
      }
      if (areaScale*member[this.weightKey] > rectMaxArea) {
        rectMaxArea = areaScale*member[this.weightKey]
      }
    }

    let floatingSide = (rowArea / fixedSide)

    let maxRatio = rectMaxArea/(floatingSide*floatingSide)
    let minRatio = rectMinArea/(floatingSide*floatingSide)
    let maxDistance = (maxRatio < 1) ? 1/(1 - maxRatio) : 1/(1 - (1 / maxRatio))
    let minDistance = (minRatio < 1) ? 1/(1 - minRatio) : 1/(1 - (1 / minRatio))

    return Math.min(minDistance, maxDistance)
  }

  freezeRow(row) {
    row.weight = 0

    for (let member of row.data) {
      row.weight += member[this.weightKey]
    }

    // Convert weight to area
    row.area = this.totalArea*row.weight/this.totalWeight

    if (row.type == "vertical") {
      row.dimensions.y = row.width
      row.dimensions.x = row.area / row.dimensions.y
      this.remainingX = this.remainingX - row.dimensions.x
    } else {
      row.dimensions.x = row.width
      row.dimensions.y = row.area / row.dimensions.x
      this.remainingY = this.remainingY - row.dimensions.y
    }

    let prev = {
      origin: row.origin,
      dimensions: {x: 0, y: 0},
    }

    row.data = row.data.map( (member, index) => {
      let rect = {
        index: `${row.index}_${index}`,
        origin: {},
        dimensions: {},
        weight: member[this.weightKey],
        raw: member
      }

      if (row.type == "vertical") {
        rect.origin.x = prev.origin.x
        rect.origin.y = prev.origin.y + prev.dimensions.y
        rect.dimensions.x = row.dimensions.x
        rect.dimensions.y = (rect.weight/row.weight)*row.dimensions.y
      } else {
        rect.origin.x = prev.origin.x + prev.dimensions.x
        rect.origin.y = prev.origin.y
        rect.dimensions.x = (rect.weight/row.weight)*row.dimensions.x
        rect.dimensions.y = row.dimensions.y
      }
      prev = rect
      return rect
    })

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

    if (this.squareness(row.data, row.width) <= this.squareness(modifiedData, row.width)) {
      console.log("extending row")
      this.data.pop()
      row.data = modifiedData
      this.squarify(row)
    } else {
      console.log("freezing row")
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
