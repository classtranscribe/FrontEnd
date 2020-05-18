import { markdown2Html  } from './markdown';
import { 
  strList2Html,
  plaintext2Html,
} from './plaintext';

/**
 * Parse raw texts to HTML
 */
export const html = {
  markdown: markdown2Html,
  plainText: plaintext2Html,
  strList: strList2Html,
};