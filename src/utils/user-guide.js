import MkGuide from 'mk-guide';
import 'mk-guide/style.css';

export class CTUserGuide {
  /**
   * Create a ClassTranscribe user guide instance
   * @param {Object[]} guides - user guides
   * @param {Object} mkProps - props to mk-guide
   * @see {@link https://www.npmjs.com/package/mk-guide}
   */
  constructor(guides = [], isOnboarded, mkProps = {}) {
    this.mask = new MkGuide({
      buttonColor: '#328383',
      skipButtonColor: 'rgb(63,63,63)',
      ...mkProps,
    });

    this.guides(guides);
    if (typeof isOnboarded === 'function') {
      this.isOnboarded = isOnboarded;
    }
  }

  /**
   * The abstract method, **should be over written by child classes**
   * Check if the user is onboarded
   *
   * @returns {Boolean} true if the user is onboarded
   */
  async isOnboarded() {
    return false;
  }

  /**
   * Set user guides, **should be called before start**
   * @param {Object[]} guides - the user guides
   */
  guides(guides) {
    if (Array.isArray(guides) && guides.length > 0) {
      this.mask.guides = guides;
    }
  }

  /**
   * Start the user guide
   * @param {Array} guides - the user guides
   */
  async start() {
    // check if the user is onboarded
    const isOnboarded = await this.isOnboarded();
    if (isOnboarded) {
      return;
    }

    this.mask.start();
  }
}
