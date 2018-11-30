import auth from 'common/js/auth'

// 接口代理
const PROXY = (data = {}) => {
  const { apiUrl, serviceHost, ...obj } = data
  return {
    'type': 'POST',
    'contentType': 'application/json',
    'serviceHost': serviceHost,
    'apiUrl': apiUrl,
    'body': obj
  }
}

// 行情接口公用参数
const WRAP = (data = {}) => ({
  id: '1534911028845000062',
  sign: '81LUw+hJ5gpAkLgjqWvl88yGib0=',
  version: '1.0',
  params: {
    sessionId: auth.getAuthToken(),
    ...data
  }
})

export default {
  PROXY,
  WRAP
}
