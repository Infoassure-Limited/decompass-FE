<template>
  <div>
    <span v-if="amount_in_kobo > 0">
      <img class="pull-right mx-auto" src="/images/logo/paystack.png" alt="logo" width="200" />
      <!-- <paystack
        buttonClass="'button-class btn btn-primary'"
        buttonText="Subscribe"
        :publicKey="paystackKey"
        :email="form.email"
        :amount="amount_in_kobo"
        :reference="reference"
        :onSuccess="callback"
        :onCanel="close"
      /> -->
      <paystack
        :amount="amount_in_kobo"
        :email="form.email"
        :paystackkey="paystackKey"
        :reference="reference"
        :callback="callback"
        :close="close"
        :embed="false"
      >
        Subscribe
      </paystack>
    </span>
  </div>
</template>

<script>
import moment from 'moment'
import paystack from '@/components/Paystack'
import Resource from '@/api/resource'

export default {
  components: {
    paystack
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // paystackkey: process.env.VUE_APP_MIX_PAYSTACK_API_KEY, // 'pk_test_a32396d591431a2c57e4c68a3cfa8fb15502a4b3', // paystack public key
      // paystackKey: 'pk_test_a32396d591431a2c57e4c68a3cfa8fb15502a4b3',
      payment_response: '',
      subscription_payments: [],
      amount_in_kobo: 0
    }
  },
  computed: {
    reference() {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      return text
    },
    paystackKey() {
      return this.$store.getters.paystackKey
    }
  },
  created() {
    this.amount_in_kobo = parseFloat(this.form.amount * 100)
  },
  methods: {
    moment,
    callback(response) {
      // console.log(response)
      this.payment_response = response
      this.payViaCard()
    },
    close() {
      console.log('Payment closed')
    },

    payViaCard() {
      const param = this.payment_response
      param.amount = parseFloat(this.form.amount)
      param.subscription_id = this.form.subscription_id
      // console.log(param)
      const subscriptionResource = new Resource('subscriptions/payment')
      subscriptionResource.store(param).then(() => {
        this.$emit('paid')
      })
    }
  }
}
</script>
<style type="text/css">
.payButton {
  background-color: #29b263;
  border-color: #29b263;
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
}
</style>
