import { useEffect } from 'react';

export function useCTDocTitle(title) {
  useEffect(() => {
    document.title = `${title} | ClassTranscribe`;
  });
}
