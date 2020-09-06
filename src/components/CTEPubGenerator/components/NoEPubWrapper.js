import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { CTFragment, CTText } from 'layout';
import { epub } from '../controllers';

function NoEPubWrapper({ mediaId, error }) {
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    await epub.list.requestEPub(mediaId);
    setRequested(true);
  };

  // useEffect(() => {
  //   if (error === epub.const.EPubDataRequestedError) {
  //     setRequested(true);
  //   }
  // }, [error])

  return (
    <CTFragment center fadeIn>
      <CTFragment dFlexCol justConCenter>
        {
          !requested ? (
            <>
              <CTText size="medium" center>
                There is no ePub data for this media now.
              </CTText>
              <CTText size="medium" center>
                Please make a request for this video.
              </CTText>
            </>
          ) : (
            <div className="ct-d-c-center">
              <div className="sk-wave">
                <div className="sk-wave-rect" />
                <div className="sk-wave-rect" />
                <div className="sk-wave-rect" />
                <div className="sk-wave-rect" />
                <div className="sk-wave-rect" />
              </div>
              <CTText size="medium" center bold margin={[10, 0]}>
                Request has been sent successfully.
              </CTText>
              <CTText size="medium" center>
                We are processing the data right now, please check it later.
              </CTText>
            </div>
          )
        }
        
        {
          !requested
          &&
          <CTFragment center margin={[30, 0]}>
            <Button
              round 
              size="big"
              onClick={handleRequest}
            >
              Request ePub data
            </Button>
          </CTFragment>
        }
      </CTFragment>
    </CTFragment>
  );
}

export default NoEPubWrapper;
