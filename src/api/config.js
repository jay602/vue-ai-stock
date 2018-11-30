export const ERR_OK = 0

export const ERR_OK_AI = 200

export const DEV = process.env.NODE_ENV !== 'production'

export const HOST = DEV ? '' : window.HOST_URL

export const HOST_PROXY = '/proxy/execute'

export const KEY_USER_INFO = 'userInfo'

export const KEY_SESSION_INFO = 'userSessionInfo'
