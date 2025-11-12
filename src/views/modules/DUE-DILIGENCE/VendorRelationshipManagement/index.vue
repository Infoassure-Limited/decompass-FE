<template>
  <el-card>
    <div v-loading="loading">
      <div v:slot="header">
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
      </div>
      <el-tabs v-if="form.vendor_id">
        <el-tab-pane lazy>
          <template v-slot:label>
            <span>Issues & Tickets</span>
          </template>
          <Tickets :vendor-id="form.vendor_id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template v-slot:label>
            <span>Review Meetings</span>
          </template>
          <ReviewMeetings :vendor-id="form.vendor_id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import Tickets from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/partials/Tickets.vue'
import ReviewMeetings from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/partials/ReviewMeetings.vue'

export default {
  components: {
    Tickets,
    ReviewMeetings
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
