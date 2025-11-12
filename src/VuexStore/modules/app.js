export default {
  namespaced: true,
  state: {
    paystackKey: import.meta.env.VITE_PAYSTACK_API_KEY, // process.env.VUE_APP_MIX_PAYSTACK_API_KEY
    assetTypesList: [{ name: 'Software' }, { name: 'Hardware' }, { name: 'People' }]
  },
  getters: {},
  mutations: {},
  actions: {}
}
