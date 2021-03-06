
import Tool from '../tool.js'
import grid from '../grid.js'
import BucketOptions from '../toolOptions/BucketOptions.js'
import actionStack from '../actionStack.js'
// import PopoverCursor from '../lib/PopoverCursor.js'
import GroupActions from '../actions/GroupActions.js'
import utilities from '../lib/utilities.js'

class BucketTool extends Tool {
  constructor () {
    super('#bucket-tool', 'bucketTool')
    this.toolOption = new BucketOptions()
    this.clickedDownTriangle = null // the triangle we clicked down on we will only fill triangles of these type
  }

  /**
   * Initialize the tool
   */
  init () {
    // initialize event-listeners for button
    this.buttonEventListener()
    this.toolListeners()
  }

  /**
   * Event-listener for button within toolbox
   */
  buttonEventListener () {
    $(this.selector).on('click', (event) => {
      super.buttonEventListener(event)

      if (!this.data.active) {
        super.changeToolIcon('cursor-pointer')

        $(this.selector).addClass('pure-button-active')

        // add options to tool options box
        this.toolOption.addToToolOptionBox()

        // reactive tool
        this.tool.activate()
        this.data.active = true
      } else {
        this.deActivateTool()
      }
    })
  }

  /**
   * Event-listener for canvas
   */
  toolListeners () {
    // Create new custom paper tool
    this.tool = new paper.Tool()
    this.tool.name = this.toolname

    this.tool.onMouseDown = this.onMouseDown.bind(this)

    paper.tool = null
  }

  /**
   * Function for when we click on the origami editor
   */
  onMouseDown (event) {
    let squareDown = utilities.getRowColumn(event.point.x, event.point.y)

    if (squareDown == null) {
      return
    }

    // Get the content of square clicked down, we will match on this
    let gridSquare = grid.grid[squareDown.row][squareDown.column]
    if (gridSquare === null) {
      return
    }
    this.clickedDownTriangle = gridSquare.triangles[paper.project.activeLayer._id]

    // keep track of squares added
    let changedSquares = []

    this.fillSurroundingArea(squareDown.row, squareDown.column, changedSquares)

    // add actions to undo stack so we can undo and redo.
    if (changedSquares.length > 0) {
      actionStack.pushToUndo(new GroupActions(changedSquares), 'new')
    }
  }

  /**
   * Fill in the surrounding clicked row and columnd
   * @param {Number} row - the row we clicked on
   * @param {Number} column - the column we clicked on
   * @param {Array of actions} changedSquares - keep track of our changed actions
   */
  fillSurroundingArea (row, column, changedSquares) {
    // determine if needs to be shifted
    let shifted = (row % 2 === 0) ? -1 : 0

    // center square, base case
    let filled = this.fillSquare(row, column, changedSquares)

    if (filled) {
      // top left square
      this.fillSurroundingArea(row - 1, column + shifted, changedSquares)

      // top right square
      this.fillSurroundingArea(row - 1, column + 1 + shifted, changedSquares)

      // left square
      this.fillSurroundingArea(row, column - 1, changedSquares)

      // right square
      this.fillSurroundingArea(row, column + 1, changedSquares)

      // bottom left square
      this.fillSurroundingArea(row + 1, column + shifted, changedSquares)

      // bottom right square
      this.fillSurroundingArea(row + 1, column + 1 + shifted, changedSquares)
    }

    return filled
  }

  /**
   * Fill in the square with a triangle, if there is already a triangle
   * there do not fill in, if it did fill in recursively call the surrounding squares
   * @param {number} row represents the row index
   * @param {number} column represent the column index
   * @returns boolean if we filled or not
   */
  fillSquare (row, column, changedSquares) {
    // sanity check
    if (row == null || column === null) {
      return false
    }
    // check if out of bounds
    if (row < 0 || column < 0) {
      return false
    }

    // check if out of bounds
    if (row > grid.rowsCount || column > grid.columnsCount) {
      return false
    }

    // sanity check
    if (grid.grid[row] === undefined) {
      return false
    }

    let gridSquare = grid.grid[row][column]

    // check if row is defined
    if (gridSquare == null) {
      return false
    }

    let triangleAction = null

    // we need to check if content matches
    let currentTriangle = gridSquare.triangles[paper.project.activeLayer._id]

    // if both types are undefined
    if ((currentTriangle === undefined || currentTriangle === null) && (this.clickedDownTriangle === null || this.clickedDownTriangle === undefined)) {
      triangleAction = utilities.insertTriangle(gridSquare, this.toolOption, {
        'noOverwrite': true
      })
    } else if (currentTriangle && currentTriangle.matches(this.toolOption)) {
      // if the tooloptions at the start is the same as the current triangle do not overwrite
      // as it is unnecessary to redraw on
      return false
    } else if (this.checkIfTrianglesMatch(currentTriangle)) {
      // check if the current triangle matches the clickdown triangle at the start
      // if so draw on it
      triangleAction = utilities.insertTriangle(gridSquare, this.toolOption, {
        'noOverwrite': false
      })
    } else {
      return false
    }

    if (triangleAction !== null && triangleAction !== undefined) {
      changedSquares.push(triangleAction)
    }

    return true
  }

  // check if the current triangle matches
  checkIfTrianglesMatch (currentTriangle) {
    if (currentTriangle === undefined || currentTriangle === null || this.clickedDownTriangle === undefined || this.clickedDownTriangle === null) {
      return false
    }

    return this.clickedDownTriangle.matches(currentTriangle.options)
  }

  deActivateTool () {
    $(this.selector).removeClass('pure-button-active')

    super.deActivateTool()
  }
}

/**
 * Tool for clicking the triangle
 */
export default BucketTool
