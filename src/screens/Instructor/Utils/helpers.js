import _ from 'lodash'
// import { api } from 'utils'

export function fileSizeParser(size) {
  var _size = size;
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
  i=0;while(_size>900){_size/=1024;i++;}
  var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
  return exactSize
}