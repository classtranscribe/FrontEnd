// user roles
export const STUDENT = 'u-stu';
export const INSTRUCTOR = 'u-inst';
export const ADMIN = 'u-admin';
export const DEFAULT_ROLE = STUDENT; // used for testing

// arrays
export const ARRAY_INIT = ['init'];
export const ARRAY_EMPTY = ['empty'];

// Pages
export const PAGE_INSTRUCTOR = 'instp';
export const PAGE_HOME = 'homep';
export const PAGE_MEDIA_SETTING = 'msp';
export const PAGE_WATCH = 'watch';

export const isMac = /Mac/i.test(navigator.platform);
export const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

export const isDeveloping = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Flash Detection
// 0 = Unknown, 1= Detect-No 2= Set-No 3=Detect-Yes 4=Set-Yes
export const FLASH_SET_YES = 4
export const FLASH_DETECT_YES = 3
export const FLASH_SET_NO = 2
export const FLASH_DETECT_NO = 1
export const FLASH_UNKNOWN = 0

export const CROWDEDIT_ALLOW = 0
export const CROWDEDIT_FREEZE_ALL = 1