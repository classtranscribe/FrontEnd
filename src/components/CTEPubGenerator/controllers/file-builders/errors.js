/**
 * An error which occurred while loading the images for an ePub
 */
export function LoadImageError() {
  this.name = 'LoadImageError';
  this.message = 'Failed to load images.';
}
LoadImageError.prototype = Error.prototype;

/**
 * An error which occurred when the required information for creating an ePub file is invalid
 */
export function EPubValidationError() {
  this.name = 'EPubValidationError';
  this.message = 'Invalid ePub data.';
}
EPubValidationError.prototype = Error.prototype;