<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-skeleton :loading="loading" :rows="6" animated />
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(row, index) in modules" :key="index" :name="row.id">
            <template v-slot:title>
              <h3>{{ `${row.name} - ${row.full_name}` }}</h3>
            </template>
            <div v-if="row.packages.length > 0">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="(pack, package_index) in row.packages" :key="package_index">
                      <div align="center">
                        <h1
                          ><strong>{{ pack.name }}</strong></h1
                        >
                        <h3
                          >{{ currency
                          }}{{
                            parseFloat(pack.price).toLocaleString('en-US', {
                              minimumFractionDigits: 2
                            })
                          }}</h3
                        >
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(feature, feature_index) in row.features" :key="feature_index">
                    <td width="400">
                      <strong>{{ feature.name }}</strong>
                    </td>
                    <th v-for="(pack, package_index) in row.packages" :key="package_index">
                      <div align="center">
                        <span v-if="pack.features.includes(feature.id)">
                          <icon size="20" color="#30b036" icon="tabler:check" />
                        </span>
                        <span v-else>
                          <icon size="20" color="#C03639" icon="tabler:x" />
                        </span>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <td></td>
                    <td v-for="(pack, package_index) in row.packages" :key="package_index">
                      <div align="center">
                        <el-button
                          v-model="row.package"
                          :label="pack"
                          border
                          @click="addToCart(row, pack)"
                        >
                          Add to Cart
                        </el-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <el-empty description="No package is created yet" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="fixed">
          <h3><icon size="20" icon="ShoppingBagIcon" /> My Cart</h3>
          <div v-if="cartItems.length > 0">
            <table v-loading="paymentLoader" class="table table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>Item</th>
                  <th>Cost ({{ currency }})</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, item_index) in cartItems" :key="item_index">
                  <td width="20">
                    <span style="cursor: pointer" @click="removeRow(item_index)">
                      <icon color="#f00000" size="20" icon="tabler:trash" />
                    </span>
                  </td>
                  <td>
                    <div>
                      <em>{{ `${item.moduleName} - ${item.packageName}` }}</em>
                    </div>
                  </td>
                  <td align="right">
                    {{
                      parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })
                    }}
                  </td>
                </tr>
                <tr v-if="grandTotal > 0">
                  <td colspan="2">
                    <strong>Sub Total</strong>
                  </td>
                  <td align="right">
                    <strong>{{
                      parseFloat(subTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="subscription !== null">
                  <td align="right" colspan="2">
                    <strong>Amount Paid</strong>
                  </td>
                  <td align="right">
                    <strong style="color: green">{{
                      parseFloat(subscription.paid).toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="grandTotal > 0">
                  <td align="right" colspan="2">
                    <strong>Total Payable</strong>
                  </td>
                  <td align="right">
                    <h4
                      ><strong style="color: red">{{
                        parseFloat(grandTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })
                      }}</strong></h4
                    >
                  </td>
                </tr>
                <tr v-if="!isSaved">
                  <td colspan="3">
                    <el-button type="primary" @click="submit()"> Continue </el-button>
                  </td>
                </tr>
                <tr v-if="isSaved">
                  <td colspan="3">
                    <div v-if="subscription.paid > 0 && grandTotal < 1" align="center">
                      <img src="/images/logo/paid.png" alt="logo" width="150" />
                    </div>
                    <div v-else>
                      <div v-if="grandTotal > 0">
                        <label>Payment details will be sent to the email below</label>
                        <el-input
                          v-model="form.email"
                          placeholder="Enter Email"
                          type="email"
                          style="width: 100%"
                        />
                        <hr />
                        <card-payment :form="form" :currency="currency" />
                      </div>
                    </div>
                  </td>
                </tr>
                <!-- <tr v-if="isSaved">
                  <td colspan="3">

                    <card-payment
                      v-if="validEmail(form.email)"
                      :form="form"
                      :currency="currency"
                      @paid="checkPaymentStatus"
                    />
                  </td>
                </tr> -->
              </tbody>
            </table>
          </div>
          <div v-else>
            <el-empty description="Cart is empty" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardPayment from './payment/CardPayment.vue'
import Resource from '@/api/resource'

export default {
  components: {
    CardPayment
    // BRow,
    // BCol,
    // BFormGroup,
    // BButton,
  },
  data() {
    return {
      loading: false,
      loadButon: false,
      paymentLoader: false,
      modules: [],
      selectedModule: {
        id: '',
        standards: []
      },
      activeNames: [],
      cartItems: [],
      grandTotal: 0.0,
      subTotal: 0.0,
      currency: '₦',
      form: {
        email: '',
        amount: 0,
        discount: 0,
        subscription_id: null
      },
      isSaved: false,
      successful_payment_made: false,
      subscription: null
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    allModules() {
      return this.$store.getters.allModules
    },
    userData() {
      return this.$store.getters.userData
    }
  },
  created() {
    this.fetchPackages()
    this.fetchSubscriptionDetails()
    this.form.email = this.userData.email
  },
  methods: {
    removeRow(detailId) {
      this.cartItems.splice(detailId, 1)
      this.isSaved = false
      this.submit()
      // this.calculateTotal()
    },
    fetchSubscriptionDetails() {
      this.cartItems = []
      const fetchPaymentDetailsResource = new Resource('subscriptions/fetch-subscription-details')
      fetchPaymentDetailsResource.list().then((response) => {
        const { subscription } = response
        if (subscription !== null) {
          this.subscription = subscription
          this.form.subscription_id = subscription.id
          this.isSaved = true
          const { details } = subscription

          details.forEach((detail) => {
            this.cartItems.push({
              module_id: detail.available_module_id,
              moduleName: detail.available_module.name,
              package_id: detail.module_package_id,
              packageName: detail.module_package.name,
              price: detail.amount
            })
          })
          this.calculateTotal()
          // this.form.subscription_id = subscription.id
          // this.checkPaymentStatus()
        }
      })
    },
    itemExists(moduleId) {
      const checkEmptyLines = this.cartItems.filter((item) => item.module_id === moduleId)
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addToCart(selectedModule, modulePackage) {
      this.isSaved = false
      if (this.itemExists(selectedModule.id)) {
        const objIndex = this.cartItems.findIndex((obj) => obj.module_id === selectedModule.id)
        this.cartItems[objIndex] = {
          module_id: selectedModule.id,
          moduleName: selectedModule.name,
          package_id: modulePackage.id,
          packageName: modulePackage.name,
          price: modulePackage.price
        }
      } else {
        this.cartItems.push({
          module_id: selectedModule.id,
          moduleName: selectedModule.name,
          package_id: modulePackage.id,
          packageName: modulePackage.name,
          price: modulePackage.price
        })
      }
      this.calculateTotal()
    },
    calculateTotal() {
      const { cartItems } = this
      let subTotal = 0

      cartItems.forEach((item) => {
        subTotal += parseFloat(item.price)
      })
      const paid = this.subscription !== null ? this.subscription.paid : 0
      const grandTotal = subTotal - parseFloat(paid)
      this.subTotal = subTotal
      this.form.amount = grandTotal
      this.grandTotal = grandTotal
    },
    fetchPackages(load = true) {
      this.loading = load
      const fetchPackageResource = new Resource('packages/fetch-modules')
      fetchPackageResource.list().then((response) => {
        const { modules } = response
        modules.forEach((mod) => {
          this.activeNames.push(mod.id)
        })

        this.modules = modules
        this.loading = false
      })
    },
    submit() {
      this.loadButon = true
      this.successful_payment_made = false
      const saveSubscription = new Resource('subscriptions/store')
      const param = this.form
      const { cartItems } = this
      param.amount = this.subTotal
      param.cart_items = cartItems
      saveSubscription
        .store(param)
        .then((response) => {
          this.isSaved = true
          this.loadButon = false
          this.subscription = response.subscription
          this.form.subscription_id = response.subscription.id
          this.calculateTotal()
          // this.$message('Action Successful')
          // this.$notify({
          //   title: 'Action Successful',
          //   message: 'The specified project have been created for the client',
          // })
        })
        .catch((error) => {
          this.loadButon = false
          this.$message(error.response.data.error)
        })
    },
    checkPaymentStatus() {
      this.paymentLoader = true
      const saveSubscription = new Resource('subscriptions/successful-payment-status')
      const param = this.form
      saveSubscription
        .store(param)
        .then((response) => {
          this.paymentLoader = false
          if (response.successful_payment !== null) {
            this.successful_payment_made = true
          }
        })
        .catch((error) => {
          this.paymentLoader = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
<style scoped>
.fixed {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 480px;
  height: 550px;
  overflow: auto;
  background: #f9f9f9;
  padding: 20px;
}
</style>
<style scoped>
.fixed {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 480px;
  height: 550px;
  overflow: auto;
  background: #f9f9f9;
  padding: 20px;
}
</style>
