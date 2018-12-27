/**
 * Class for the tool that is used by the program
 */
class tool {
  constructor () {
    this['tool-type'] = ''
    this.tool = null
    this.data = {}
  }

  /**
   * Common function to run when deactivating
   */
  deActivateTool () {
    paper.tool = null
  }

  /**
   * Function for converting icon back to normal
   */
  removeToolIcon () {
    $('#origami-editor').css('cursor', 'pointer')
  }

  /**
   * Function to run on all tools for initializing
   */
  init () {
    console.log('Init has not been implemented for ' + this.toolType)
  }
}

export default tool
