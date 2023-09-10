import request from 'es6-request'

class CurrencyConverterService {
  async convert(fromCurrencyCode: string, toCurrencyCode?: string) {
    let url: string
    if (!fromCurrencyCode) {
      throw new Error('Currency not found')
    }
    if (toCurrencyCode) {
      url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrencyCode}/${toCurrencyCode}.json`
    } else {
      url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrencyCode}.json`
    }

    try {
      const [body, res] = await request.get(url)
      return JSON.parse(String(body))
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getCurrucies() {
    try {
      const [body, response] = await request.get(
        'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json',
      )
      const data: any = JSON.parse(String(body))
      const currencies: any[] = Object.keys(data)
      let formatCurrency = []
      for (const key of currencies) {
        formatCurrency.push({ code: key, name: data[key] })
      }
      return formatCurrency
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }
}

export default new CurrencyConverterService()
