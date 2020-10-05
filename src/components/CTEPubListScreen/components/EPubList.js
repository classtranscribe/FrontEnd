import React from 'react';
import { NOT_FOUND_404, links } from 'utils';
import { altEl, makeEl, CTFragment, CTHeading, CTText, CTList } from 'layout';
import { LanguageConstants } from '../../CTPlayer';
import { NoEPubWrapper, NoLangWrapper } from './Wrappers';
import NewEPubButton from './NewEPubButton';

export function _getEPubListItems(ePubs) {
  return ePubs.map(epub => {
    let lang = LanguageConstants.decode(epub.language);
    let status = epub.isPublished ? 'Published' : 'Unpublished'
    return {
      title: epub.filename,
      icon: 'text_snippet',
      description: `${status} • ${lang}`,
      link: true,
      to: links.epub(epub.id),
      target: '_blank',
      titleProps: {
        celadon: true
      },
    }
  });
}

function EPubList(props) {
  const {
    ePubs, languages, rawEPubData,
    sourceType, sourceId, defaultTitle
  } = props;

  const noLang = languages.length === 0;
  const noEPub = !noLang && rawEPubData === NOT_FOUND_404;
  const notFoundEPub = ePubs === NOT_FOUND_404;
  const hasError = noLang || noEPub;
  const hasEPubs = !hasError && !notFoundEPub && ePubs.length > 0;

  const noLangElement = altEl(NoLangWrapper, noLang);
  const noEPubElement = altEl(NoEPubWrapper, noEPub, { sourceType, sourceId });
  const newEPubBtnElement = makeEl(NewEPubButton, {
    languages, sourceType, sourceId, defaultTitle
  });

  return (
    <CTFragment h100 scrollY padding={[40, 0]} id="ct-epb-list" width="40%">
      {noLangElement}
      {noEPubElement}

      {
        !hasError
        &&
        <CTFragment>
          {hasEPubs ? (
            <>
              <CTFragment justConBetween padding={[0, 20, 20, 30]}>
                <CTHeading as="h3" alignItCenter compact icon="library_books">
                  ePub Books
                </CTHeading>
                {newEPubBtnElement}
              </CTFragment>

              <CTList items={_getEPubListItems(ePubs)} />
            </>
          ) : (
            <CTFragment margin={[50, 0, 0, 0]} dFlexCol center>
              {newEPubBtnElement}
              <CTText center muted padding="10">
                Create your first ePub book
              </CTText>
            </CTFragment>
          )}
        </CTFragment>
      }
    </CTFragment>
  );
}

export default EPubList;
