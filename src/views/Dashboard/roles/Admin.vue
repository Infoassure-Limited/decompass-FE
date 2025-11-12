<template>
  <div>
    <DataCount v-if="dashboardData !== null" :data="dashboardData" />
    <!-- <el-row :gutter="10">
      <el-col :md="10">
        <SubscriptionCarousel
          v-if="dashboardData.available_modules.length > 0"
          :available-modules="dashboardData.available_modules"
        />
      </el-col>
      <el-col :md="6">
        <el-card
          @click="$router.push({ name: 'ManageClientUsers' })"
          style="cursor: pointer"
          shadow="hover"
        >
          <div class="flex items-center">
            <icon icon="tabler:users" size="70" class="mr-20px" />
            <div>
              <div class="text-32px"> {{ dashboardData.users }} </div>
              <div class="mt-5px mb-5px text-16px text-gray-500"> Registered Users </div>
            </div>
          </div>
        </el-card>
        <el-card
          class="mt-1"
          @click="$router.push({ name: 'ManageProjectIndex' })"
          style="cursor: pointer"
          shadow="hover"
        >
          <div class="flex items-center">
            <icon icon="tabler:packages" size="70" class="mr-20px" />
            <div>
              <div class="text-32px"> {{ dashboardData.projects }} </div>
              <div class="mt-10px text-16px text-gray-500"> Subscribed Modules </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card shadow="hover">
          <div class="flex items-center">
            <el-progress
              type="dashboard"
              :stroke-width="20"
              :width="210"
              :percentage="dashboardData.project_completion"
              :color="colors"
              class="mr-20px"
            />
            <h4>Project Completion Status</h4>
          </div>
        </el-card>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :md="24">
        <el-tabs>
          <el-tab-pane
            v-for="subscription in subscriptions"
            :key="subscription"
            :label="formatModuleName(subscription)"
          >
            <BCMSDashboard v-if="subscription === 'bcms'" />
            <ISMSDashboard v-if="subscription === 'isms'" />
            <NDPADashboard v-if="subscription === 'ndpa'" />
            <TPDDDashboard v-if="subscription === 'vdd'" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :md="24">
        <ClientProjects :column-size="6" />
      </el-col>
      <!-- <el-col :md="12">
        <el-card>
          <el-empty description="A summary of analytics for all subscribed modules go here" />
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
import { formatModuleName } from '@/utils/tsxHelper'
import DataCount from '@/views/Dashboard/components/DataCount.vue'
import ISMSDashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
import BCMSDashboard from '@/views/modules/BCMS-ISO22301/Dashboard.vue'
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
import TPDDDashboard from '@/views/modules/DUE-DILIGENCE/Dashboard.vue'
import checkPermission from '@/utils/permission'
// import SubscriptionCarousel from '@/views/Dashboard/components/SubscriptionCarousel.vue'
import ClientProjects from '@/views/modules/projects/ClientProjects.vue'
// import Users from '@/views/modules/user/ClientUsers.vue'
// import AdminChart from './components/admin_report_chart.vue'
// import Revenue from './components/charts/Revenue.vue'
// import Debtors from './components/charts/Debtors.vue'

import Resource from '@/api/resource'

export default {
  components: {
    DataCount,
    BCMSDashboard,
    ISMSDashboard,
    NDPADashboard,
    TPDDDashboard,
    // SubscriptionCarousel,
    ClientProjects
  },
  data() {
    return {
      dashboardData: null,
      registerDialog: false,
      load: false,
      colors: [
        { color: '#dc3545', percentage: 20 },
        { color: '#fd7e14', percentage: 40 },
        { color: '#ffc107', percentage: 60 },
        { color: '#0dcaf0', percentage: 80 },
        { color: '#20c997', percentage: 95 },
        { color: '#198754', percentage: 100 }
      ]
    }
  },
  computed: {
    subscriptions() {
      return this.$store.getters.userData.modules
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    checkPermission,
    formatModuleName,
    increase() {
      this.dashboardData.project_completion += 10
      if (this.dashboardData.project_completion > 100) {
        this.dashboardData.project_completion = 100
      }
    },
    decrease() {
      this.dashboardData.project_completion -= 10
      if (this.dashboardData.project_completion < 0) {
        this.dashboardData.project_completion = 0
      }
    },
    fetchData() {
      this.load = true
      this.registerDialog = false
      const adminDashboardResource = new Resource('reports/admin-data-analysis-dashboard')
      adminDashboardResource
        .list()
        .then((response) => {
          this.dashboardData = response
          this.load = false
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    }
  }
}
</script>
