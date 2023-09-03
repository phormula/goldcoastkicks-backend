import fetch from 'node-fetch'

class CurrencyConverter {
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
      const requestOptions = {
        method: 'GET',
      }
      const response = await fetch(url, requestOptions)
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getCurrucies() {
    try {
      const requestOptions = {
        method: 'GET',
      }
      const response = await fetch(
        'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json',
        requestOptions,
      )
      const data: any = await response.json()
      const currencies: any[] = Object.keys(data)
      let formatCurrency = []
      for (const key of currencies) {
        formatCurrency.push({ code: key, name: data[key] })
      }
      return formatCurrency
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

export default new CurrencyConverter()
