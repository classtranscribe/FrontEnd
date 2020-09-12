import React from 'react';
import cx from 'classnames';
import TableCell from '@material-ui/core/TableCell';

export function _fileSizeParser(size) {
  let _size = size;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (_size > 900) {
    _size /= 1024;
    i += 1;
  }
  const exactSize = `${Math.round(_size * 100) / 100} ${fSExt[i]}`;
  return exactSize;
}

function UploadTableVideoCell({
  videFile,
  can2Video = false
}) {
  const fileIcon = <i className="fas fa-file-video" />;
  return (
    <TableCell>
      <div className={cx('tb-cell', { 'auto-width': !can2Video })}>
        {
          videFile
          ?
            <>
              <span className="name">{fileIcon}{videFile.name}</span>
              <span className="size">{_fileSizeParser(videFile.size)}</span>
            </>
          :
            <span className="name">NaN</span>
        }
      </div>
    </TableCell>
  );
}

export default UploadTableVideoCell;
