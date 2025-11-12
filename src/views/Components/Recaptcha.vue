<template>
  <div id="g-recaptcha" :data-sitekey="sitekey"></div>
</template>

<script>
export default {
  data() {
    return {
      sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      widgetId: 0
    }
  },
  mounted() {
    // render the recaptcha widget when the component is mounted
    this.render()
  },
  methods: {
    execute() {
      window.grecaptcha.execute(this.widgetId)
    },
    reset() {
      window.grecaptcha.reset(this.widgetId)
    },
    getResponse() {
      window.grecaptcha.getResponse()
    },
    render() {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.sitekey,
          size: 'invisible', // 'checkbox'
          // callback: this.verifyCallback,
          // the callback executed when the user solve the recaptcha
          callback: (response) => {
            // this.getResponse()
            // console.log(response)
            // emit an event called verify with the response as payload
            this.$emit('verify', response)
            // reset the recaptcha widget so you can execute it again
            this.reset()
          }
        })
        // console.log(this.widgetId)
      }
    }

    // verifyCallback(response) {
    //   console.log(this.widgetId)
    //   console.log(response)
    //   console.log(this.getResponse())
    // },
  }
}
</script>
