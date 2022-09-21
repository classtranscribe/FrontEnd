import download from 'js-file-download';
import { prompt } from 'utils/prompt';
import { jsPDF } from "jspdf";
import { EPubFileBuilder, HTMLFileBuilder, ScreenshotsBuilder } from './file-builders';

const _download = async (Builder, filenameSuffix) => {
  const { epub } = window.temp_app._store.getState();
  const filename = epub.epub.filename + filenameSuffix;
  const fileBuffer = await Builder.toBuffer(epub);
  download(fileBuffer, filename);
};

const _logError = (error) => {
  prompt.addOne({
    text: `Error: ${error.message}`,
    status: 'error',
    position: 'bottom left',
    timeout: -1
  });
};

class EPubDownloadController {
  static async downloadEPub(onDownloaded) {
    try {
      await _download(EPubFileBuilder, '.epub');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadHTML(onDownloaded) {
    try {
      await _download(HTMLFileBuilder, '.zip', true);
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async preview(print = false) {
    try {
      const { epub } = window.temp_app._store.getState();
      const builder = new HTMLFileBuilder();
      await builder.init(epub, true);

      const subchapterImages = await builder.prefetchSubchapterImages(builder.data.chapters);

      // eslint-disable-next-line
      let PDF = new jsPDF();
      PDF.setLanguage("en-US");
      const html = await builder.getIndexHTML(true, print, PDF, subchapterImages);
      PDF.save();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadPDF(onDownloaded) {
    await EPubDownloadController.preview(true);
  }

  static async downloadLatex(onDownloaded) {
    try {
      await _download(HTMLFileBuilder, '.tex');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadScreenshots(onDownloaded) {
    try {
      await _download(ScreenshotsBuilder, ' - Screenshots.zip');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }
}

export default EPubDownloadController;
