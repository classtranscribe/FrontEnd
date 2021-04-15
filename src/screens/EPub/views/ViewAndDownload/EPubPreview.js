import React, { useEffect, useState } from 'react';
import { CTFragment } from 'layout';
import { buildMDFromChapters } from 'entities/EPubs/html-converters';
import { connectWithRedux } from '../../controllers';
import { MDPreviewer, ChapterImage } from '../../components';

function EPubPreview(props) {
  const epubData = props.epub;
  const [epubMD, setEpubMD] = useState('')
  useEffect(() => {
    async function load() {
      setEpubMD(await buildMDFromChapters(epubData.chapters));
    }
    load();
  }, [epubData])
  return (
    <CTFragment padding={[20]} shadowed>
      <CTFragment padding={[10,10,100,10]} dFlexCol alignItCenter>
        <ChapterImage
          image={epubData.cover}
          disableDescription
          disableImagePicker
        />

        <h1 className="text-center">{epubData.title}</h1>
        <p>{epubData.author}</p>
      </CTFragment>

      <MDPreviewer value={epubMD} />
    </CTFragment>
  )
}

export default connectWithRedux(
  EPubPreview,
  ['epub']
);
