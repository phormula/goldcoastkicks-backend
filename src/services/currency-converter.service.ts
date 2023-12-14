import fetch from 'cross-fetch'

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
      const response = await fetch(url)
      const res = await response.json()
      return res
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getCurrucies() {
    try {
      const response = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json')
      const data = await response.json()
      const currencies: any[] = Object.keys(data)
      let formatCurrency: any[] = []
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
