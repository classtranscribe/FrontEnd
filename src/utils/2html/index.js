import { markdown2Html  } from './markdown-to-html'
import { 
  strList2Html,
  plaintext2Html,
} from './plaintext-to-html'

/**
 * Parse raw texts to HTML
 */
export const html = {
  markdown: markdown2Html,
  plainText: plaintext2Html,
  strList: strList2Html,
}