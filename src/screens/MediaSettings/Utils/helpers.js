export function getTab(pathname) {
  pathname = pathname || window.location.pathname;
  const strs = pathname.split('/');
  return strs[strs.length - 1];
}
