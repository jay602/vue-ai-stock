import axios from './axios'
import paramsData from './params-wrap'

class Api {
  /**
   * 代理请求 -- （考虑生产跨域，故统一使用此接口调取）
   * @param type           POST
   * @param contentType    application/json
   * @param serviceHost    请求服务
   * @param apiUrl         请求接口地址
   * @param body          对应接口请求的数据
   */
  getExecute = params => axios.post('/api/proxy/execute', params)

  /**
   * 综合评分
   * @param stock
   *
   * "stock":"02318.HK.GG"
   */
  getStockData = params => {
    const apiUrl = '/api/ai/getStockData'
    const serviceHost = 'ai-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, params)
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 资金成交分布
   * @param assetId
   * @param sessionId
   *
   * "assetId": "00700.HK"
   * "sessionId": "5b73c588fec84b10a995111752168a3043005"
   */
  getStkMoneyFlow = params => {
    const apiUrl = '/api/api/mktinfo_api/fetch_stk_money_flow'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 资金流向趋势
   * @param assetId
   * @param sessionId
   *
   * "assetId": "000002.SZ"
   * "sessionId": "5b73c588fec84b10a995111752168a3043005"
   */
  getStkMoneyFlowTrend = params => {
    const apiUrl = '/api/mktinfo_api/fetch_stk_money_flow_trend'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 卖空成交比例
   * @param assetId
   * @param date
   *
   * "assetId":"00700.HK"
   * "date":1521849600000
   */
  getShortSelling = params => {
    const apiUrl = '/api/mktinfo_api/shortSelling'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 港股通持股比例
   * @param assetId
   * @param date
   *
   * "assetId":"00700.HK"
   * "date":1521849600000
   */
  getHoldHKStock = params => {
    const apiUrl = '/api/mktinfo_api/holdHKStock'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 经纪商持股比例
   * @param assetId
   * @param date
   *
   * "assetId":"00700.HK"
   * "date":1521331200000
   */
  getBrokersHoldStock = params => {
    const apiUrl = '/api/mktinfo_api/brokersHoldStock'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 十大净买入/卖出经纪商
   * @param assetId
   * @param dateInterval
   * @param buyOrSaleStatus
   *
   * "assetId": "00700.HK"
   * "dateInterval": "day"  [天："day", 周："week", 月："month", 季度："quarter"]
   * "buyOrSaleStatus": "1"
   */
  getNetBuyOrSaleBrokers = params => {
    const apiUrl = '/api/mktinfo_api/netBuyOrSaleBrokers'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }

  /**
   * 查询F10
   * @param assetId
   * @param sessionId
   * @param sessionUserId
   *
   * "assetId": "01159.HK"
   * "sessionId": "5b73c588fec84b10a995111752168a3043005"
   * "sessionUserId": "10098"
   */
  getStkIndex = params => {
    const apiUrl = '/api/mktinfo_api/fetch_stk_index'
    const serviceHost = 'mktinfo-api-host'
    const data = Object.assign({}, { apiUrl, serviceHost }, paramsData.WRAP(params))
    return this.getExecute(paramsData.PROXY(data))
  }
}

export default new Api()