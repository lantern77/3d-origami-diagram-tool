
import PanTool from './tools/PanTool.js'
import TriangleTool from './tools/TriangleTool.js'
import MagnifyMinusTool from './tools/MagnifyMinusTool.js'
import MagnifyPlusTool from './tools/MagnifyPlusTool.js'
import EraserTool from './tools/EraserTool.js'
import LineTool from './tools/LineTool.js'
import BucketTool from './tools/BucketTool.js'

// Useful docs on tools
// activating tools: https://stackoverflow.com/questions/49215584/toggling-multiple-tools-on-paper-js
// right vs left click: https://stackoverflow.com/questions/1206203/how-to-distinguish-between-left-and-right-mouse-click-with-jquery
export default {
  /*
    Initialize all tools within the project
  */
  init() {
    // // alias
    let self = this

    // loop through initializing each tool
    this.tools.forEach((toolItem) => {
      toolItem.init()
    })

    // event-listener for all buttons run reset of other tools when
    // clicking other tools
    // note cannot use event.target.id, does not work if I click on the icon
    $('.tool-button').on('click', function (event) {
      let toolButton = $(this)
      if (toolButton) {
        // loop through deactivating other tools, besides the one clicked
        self.tools.forEach((toolItem) => {
          if (toolItem.toolname !== toolButton.attr('tool-name') && toolItem.data.active === true) {
            // self.deActivate(toolItem)
            toolItem.deActivateTool()
          }
        })

        // set the active tool
        this.active = self.tools.find((toolItem) => {
          return (toolItem.toolname === toolButton.attr('tool-name'))
        })
      }
    })
  },
  /**
   * Currently active tool
   * Not really useful but here anyways, as we have paper.tool
   */
  'active': null,
  'tools': [new MagnifyPlusTool(), new MagnifyMinusTool(), new PanTool(),
  new TriangleTool(), new EraserTool(), new LineTool(), new BucketTool()],


  // /**
  //  * Should be run on every instance of the tool that doesn't match what is being clicked
  //  * @param {Object} toolItem Represents a child of tool class
  //  */
  // 'deActivate'(toolItem) {

  //   // remove tool class
  //   $(toolItem.selector).removeClass('pure-button-active')
  // }
}
