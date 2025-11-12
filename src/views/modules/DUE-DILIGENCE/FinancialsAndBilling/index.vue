<template>
  <el-card>
    <div v-loading="loading">
      <div v-if="!showInvoiceDetails" v:slot="header">
        <el-row>
          <el-col :md="12">
            <label>Select Vendor</label>
            <el-select v-model="form.vendor_id" placeholder="Select Vendor" style="width: 100%">
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
          </el-col>
        </el-row>
        <hr />
      </div>
      <invoices v-if="form.vendor_id !== null" :vendor-id="form.vendor_id" @details="showDetails" />
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import Invoices from './Invoices.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Invoices
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      pageLength: 10,
      dir: false,
      vendors: [],
      form: {
        vendor_id: null,
        client_id: ''
      },
      showInvoiceDetails: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    showDetails(value) {
      this.showInvoiceDetails = value
    },
    fetchVendors() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-approved-vendors')
      fetchStaffResource.list({ all: true }).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    }
  }
}
</script>
