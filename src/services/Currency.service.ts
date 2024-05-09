import fetch from 'cross-fetch'

class CurrencyService {
  async convert(fromCurrencyCode: string, toCurrencyCode?: string) {
    if (!fromCurrencyCode) {
      throw new Error('Currency not found')
    }
    const url = `${process.env.CURRENCY_API}latest/v1/currencies/${fromCurrencyCode}.json`

    try {
      const response = await fetch(url)
      const res = await response.json()
      return toCurrencyCode ? res[fromCurrencyCode][toCurrencyCode] : res
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getCurrucies() {
    try {
      const response = await fetch(`${process.env.CURRENCY_API}latest/v1/currencies.json`)
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

export default new CurrencyService()
