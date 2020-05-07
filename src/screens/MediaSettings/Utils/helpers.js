export function getTab(pathname) {
  pathname = pathname || window.location.pathname;
  let strs = pathname.split('/');
  return strs[strs.length - 1];
}