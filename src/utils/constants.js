// user roles
export const STUDENT = 'u-stu'
export const INSTRUCTOR = 'u-inst'
export const ADMIN = 'u-admin'
export const DEFAULT_ROLE = STUDENT // used for testing

// arrays
export const ARRAY_INIT = ['init']
export const ARRAY_EMPTY = ['empty']


export const isDeveloping = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)