import download from 'js-file-download';
import { prompt } from 'utils/prompt';
import EPubParser from './file-builders/EPubParser';
import { EPubFileBuilder, HTMLFileBuilder, PDFFileBuilder, LatexFileBuilder } from './file-builders';

const _download = async (Builder, filenameSuffix, options) => {
  const { epub } = window.temp_app._store.getState();
  const filename = epub.epub.filename + filenameSuffix;
  const parsedData = await EPubParser.parse(epub, options);
  const fileBuffer = await Builder.toBuffer(parsedData);
  download(fileBuffer, filename);
};

const _logError = (error) => {
  prompt.addOne({
    text: `Error: ${error.message}`,
    status: 'error',
    position: 'bottom left',
    timeout: -1
  });
  // eslint-disable-next-line no-console
  console.log(error);
  throw error;
};

class EPubDownloadController {
  static async downloadEPub(options) {
    try {
      await _download(EPubFileBuilder, '.epub', options);
      // if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadHTML(options) {
    try {
      // eslint-disable-next-line no-console
      console.log("download options", options);
      await _download(HTMLFileBuilder, '.zip', options);
      // if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadPDF(options) {
    try {
      await _download(PDFFileBuilder, '.pdf', options);
      // if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadLatex(options) {
    try {
      options.replaceImageSrc = false;
      await _download(LatexFileBuilder, '.zip', options);
      // if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }
}

export default EPubDownloadController;
