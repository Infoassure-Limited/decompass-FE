export const validatorPositive = (value) => {
  if (value >= 0) {
    return true
  }
  return false
}

export const validatorPassword = (password) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)
  if (!validPassword) {
    return 'Your {_field_} must contain at least one uppercase, one lowercase, one special character and one digit'
  }

  return true
}

export const validatorCreditCard = (creditnum) => {
  const cRegExp = /^(?:3[47][0-9]{13})$/

  const validCreditCard = cRegExp.test(creditnum)
  if (!validCreditCard) {
    return 'Invalid Credit Card'
  }

  return true
}

export const validatorUrlValidator = (val) => {
  if (val === undefined || val === null || val.length === 0) {
    return true
  }

  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(val)
}
export const validatorEmail = (value) => {
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(value)) {
    return 'This field must be a valid email'
  }
  return re.test(String(value))
}
export const validatorMultipleEmail = (value, _a) => {
  const multiple = (_a === void 0 ? {} : _a).multiple
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (multiple && !Array.isArray(value)) {
    value = String(value)
      .split(',')
      .map(function (emailStr) {
        return emailStr.trim()
      })
  }
  if (Array.isArray(value)) {
    return value.every(function (val) {
      if (!re.test(value)) {
        return 'This field must be a valid email'
      }
      return true
    })
  }
  if (!re.test(value)) {
    return 'This field must be a valid email'
  }
  return re.test(String(value))
}

export const validateConfirmation = function (value, _a) {
  const target = _a.target
  if (!String(value) === String(target)) {
    return 'Confirmation failed'
  }

  return true
}
