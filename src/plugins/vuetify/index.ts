import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/lib/iconsets/mdi'
import { aliases, fa } from 'vuetify/lib/iconsets/fa'
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
      mdi
    }
  }
})
