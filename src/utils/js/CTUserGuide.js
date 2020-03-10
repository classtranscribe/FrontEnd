import MkGuide from 'mk-guide'

export class CTUserGuide {
  constructor() {
    this.mask = new MkGuide({
      buttonColor: "gold",
      skipButtonColor: "firebrick"
    })

    this.guides_ = []
  }

  /**
   * Function used to set guides of the user tips
   * @param {Array} guides_ - the guides to set
   */
  guides(guides_) {
    if (guides_ === undefined) return this.guides_
    this.guides_ = guides_
  }

  /**
   * Start the user guide
   * @param {Array} guides 
   */
  start(guides) {
    if (guides === undefined) guides = this.guides_
    if (Array.isArray(guides) && guides.length) {
      console.log('start user guide!!')
      this.mask.guides = guides
      this.mask.start()
    }
  }
}