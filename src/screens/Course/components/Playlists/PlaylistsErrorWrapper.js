import React from 'react';
import { user } from 'utils';
import { SignInPrompt } from 'components';
import { CTFragment } from 'layout';

export default function PlaylistsErrorWrapper({
  accessType = 0,
}) {
  return (
    <CTFragment justConCenter>
      <CTFragment justConCenter className="w-75">
        {
          user.isLoggedIn ? ( // If signed in, then it happens when the accessType is 2 or 3
            <>
              {accessType === 2 ? ( // Students Only
                <p className="text-muted text-center">
                  Sorry, you do not have the access to this course. 
                  Please ask your instructors for permissions.
                </p>

            ) : accessType === 3 ? ( // University Only
              <p className="text-muted text-center">
                Sorry, this course is only available for students of this university. 
                Please login with an email account of this particular university.
              </p>

            ) : (
              <p className="text-muted text-center">
                Failed to load playlists: please make sure you have the permissions for this
                course.
              </p>
            )}
            </>
        ) : (
          // If unsigned in, ask the user to sign in
          <SignInPrompt topDescription="Sorry, this course is not available for unsigned-in users." />
        )
}
      </CTFragment>
    </CTFragment>
  );
}
