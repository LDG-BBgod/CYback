class CryptoToken {
  constructor() {
    this.tokenVersionId = ''
    this.encData = ''
    this.integrityValue = ''
    this.period = 0
    this.issDate = null
  }

  setTokenVersionId(tokenVersionId) {
    this.tokenVersionId = tokenVersionId
  }

  setEncData(encData) {
    this.encData = encData
  }

  setIntegrityValue(integrityValue) {
    this.integrityValue = integrityValue
  }

  setPeriod(period) {
    this.period = period
  }

  setIssDate(issDate) {
    this.issDate = issDate
  }


  getTokenVersionId() {
    return this.tokenVersionId
  }

  getEncData() {
    return this.encData
  }

  getIntegrityValue() {
    return this.integrityValue
  }

  getPeriod() {
    return this.period
  }

  getIssDate() {
    return this.issDate
  }


}

const cryptoToken = new CryptoToken()

module.exports = {
  cryptoToken,
}
