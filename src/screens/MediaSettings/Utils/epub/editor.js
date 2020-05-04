import { EPUB_STEP_SPLIT } from "./constants";
import { epubState } from "./setstate";
import { prompt } from "utils";

export function backToStep1() {
    epubState.setStep(EPUB_STEP_SPLIT);

    prompt.addOne({
      text: "Splitting chapters might lost the changes you made.",
      position: 'left bottom',
      timeout: 4000,
    }, true);
}