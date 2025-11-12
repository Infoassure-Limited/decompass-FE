// import { defineRule } from 'vee-validate'
// import { ref } from 'vue'
// import { useField, useForm } from 'vee-validate'
import {
  helpers as helpersRule,
  required as requiredRule,
  email as emailRule,
  minLength as minRule,
  sameAs as sameAsRule,
  alphaNum as alphaNumRule
} from '@vuelidate/validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

// const { handleSubmit, handleReset } = useForm({
//   validationSchema: {
//     phone(value) {
//       if (/^[0-9-]{11,}$/.test(value)) return true

//       return 'Phone number needs to be at least 11 digits.'
//     },
//     // email(value) {
//     //   if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

//     //   return 'Must be a valid e-mail.'
//     // },
//     select(value) {
//       if (value) return true

//       return 'Select an item.'
//     },
//     checkbox(value) {
//       if (value === '1') return true

//       return 'Must be checked.'
//     },
//     password(value) {
//       const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
//       const validPassword = regExp.test(password)
//       if (validPassword) return true

//       return 'Password must contain at least one uppercase, one lowercase, one special character and one digit'
//     }
//   }
// })
export const phone = (value) => {
  return /^[0-9-]{11,}$/.test(value) === true || 'Phone number needs to be at least 11 digits.'
}
// export const select = useField('select')
// export const checkbox = useField('checkbox')
// export const password = useField('password')
export const helpers = helpersRule
export const required = requiredRule

export const email = emailRule

export const minLength = minRule

export const sameAs = sameAsRule

export const alphaNum = alphaNumRule

const validatorPassword = (password) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)
  if (!validPassword) {
    return 'Your {_field_} must contain at least one uppercase, one lowercase, one special character and one digit'
  }

  return true
}
export const password = (value) => {
  return {
    required,
    minLength: minLength(12),
    containsPasswordRequirement: helpers.withMessage(
      () =>
        `Your password must contain at least: one uppercase [A-Z], one lowercase [a-z], one special character [!@#$%&*()}{] and one number [0-9]`,
      (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*()}{])/.test(value)
    )
  }
}
