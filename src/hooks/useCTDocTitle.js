import { useEffect } from 'react';

/**
 * Update the document's title
 * @param {String} title the document.title
 */
export function useCTDocTitle(title, push) {
  useEffect(() => {
    if (push) {
      document.title = `${title} | ${document.title}`;
    } else {
      document.title = `${title} | ClassTranscribe`;
    }
  });
}
