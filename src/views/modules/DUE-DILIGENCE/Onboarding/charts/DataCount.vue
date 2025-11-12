<template>
  <div>
    <el-row v-if="loading" :gutter="15">
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton :loading="loading" :rows="3" animated />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="!loading">
      <el-row :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="20" color="black" icon="tabler:users" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ vendor_count }}
                </h2>
                <span>Total Vendors</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-warning" size="50">
                <icon size="20" color="orange" icon="tabler:users" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ pending_approval }}
                </h2>
                <span>Pending</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="20" color="green" icon="tabler:user-check" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ approved_vendors }}
                </h2>
                <span>Approved</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="20" color="red" icon="tabler:user-cancel" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ rejected_vendors }}
                </h2>
                <span>Rejected</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  data() {
    return {
      vendor_count: 0,
      approved_vendors: 0,
      rejected_vendors: 0,
      pending_approval: 0,
      loading: false
    }
  },
  mounted() {
    this.fetchVendorsStat()
  },
  methods: {
    fetchVendorsStat() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-count')
      fetchStaffResource
        .list(this.query)
        .then((response) => {
          this.vendor_count = response.vendor_count
          this.approved_vendors = response.approved_vendors
          this.rejected_vendors = response.rejected_vendors
          this.pending_approval = response.pending_approval
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
