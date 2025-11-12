import { watch } from 'vue'

import { useCounter, useIdle } from '@vueuse/core'

const { inc, count } = useCounter()

const { idle, reset } = useIdle(15 * 1000) // 5 min

watch(idle, (idleValue) => {
  if (idleValue) {
    inc()
    console.log(`Triggered ${count.value} times`)
    reset() // restarts the idle timer. Does not change lastActive value
  }
})
