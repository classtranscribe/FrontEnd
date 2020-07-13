import { useEffect } from 'react';

/**
 * Update the document's title
 * @param {String} title the document.title
 */
export function useCTDocTitle(title) {
  useEffect(() => {
    document.title = `${title} | ClassTranscribe`;
  });
}
