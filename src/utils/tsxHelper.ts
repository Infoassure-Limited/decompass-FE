import { Slots } from 'vue'
import { isFunction } from '@/utils/is'

export const getSlot = (slots: Slots, slot = 'default', data?: Recordable) => {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

export function changeOpacityOfHexaColorCode(colorCode, newOpacity) {
  const alphaDecimal = Math.round(newOpacity * 255)
  const hexAlpha = alphaDecimal.toString(16).padStart(2, '0').toUpperCase()
  return colorCode + hexAlpha
}

export function setCoolBackground(primaryBgColor = '', newOpacity = 0.2) {
  if (primaryBgColor === '') {
    const root = document.documentElement // Get the root element (<html>)
    primaryBgColor = root.style.getPropertyValue('--el-color-primary')
  }
  return changeOpacityOfHexaColorCode(primaryBgColor, newOpacity)
}

export function formatModuleName(slug) {
  switch (slug) {
    case 'bcms':
      return 'BCMS-ISO22301'
    case 'isms':
      return 'ISMS-ISO27001'
    case 'ndpa':
      return 'NDPA'
    case 'vdd':
      return 'TPDD-Third Party Due Diligence'
  }
}
