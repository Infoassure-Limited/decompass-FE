<template>
  <div>
    <el-row :gutter="5">
      <el-col :md="6">
        <el-card
          @click="$router.push({ name: 'SettingsIndex', params: { tab: 'manage-users' } })"
          style="cursor: pointer"
          shadow="hover"
        >
          <div class="flex items-center">
            <icon icon="tabler:users" size="50" class="mr-20px" />
            <div>
              <div class="text-32px font-bold"> {{ dashboardData.users }} </div>
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
            <icon icon="tabler:packages" size="50" class="mr-20px" />
            <div>
              <div class="text-32px font-bold"> {{ dashboardData.projects }} </div>
              <div class="mt-10px text-16px text-gray-500"> Subscribed Modules </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="6">
        <el-card
          @click="$router.push({ name: 'SettingsIndex', params: { tab: 'asset-inventory' } })"
          style="cursor: pointer"
          shadow="hover"
        >
          <div class="flex items-center">
            <icon icon="tabler:building-community" size="50" class="mr-20px" />
            <div>
              <div class="text-32px font-bold"> {{ dashboardData.assets }} </div>
              <div class="mt-5px mb-5px text-16px text-gray-500"> Assets Inventory</div>
            </div>
          </div>
        </el-card>
        <el-card
          class="mt-1"
          @click="$router.push({ name: 'SettingsIndex', params: { tab: 'business-unit' } })"
          style="cursor: pointer"
          shadow="hover"
        >
          <div class="flex items-center">
            <icon icon="tabler:building-cog" size="50" class="mr-20px" />
            <div>
              <div class="text-32px font-bold"> {{ dashboardData.business_units }} </div>
              <div class="mt-10px text-16px text-gray-500"> Business Units </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="12">
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
      <!-- <el-col :md="10">
        <SubscriptionCarousel
          v-if="dashboardData.available_modules.length > 0"
          :available-modules="dashboardData.available_modules"
        />
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :md="12">
        <ClientProjects :column-size="12" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
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
    ClientProjects
    // Revenue,
    // Debtors,
  },
  data() {
    return {
      dashboardData: {
        users: 0,
        projects: 0,
        project_completion: 0,
        available_modules: []
      },
      registerDialog: false,
      load: false,
      terms: [],
      sessions: [],
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
  created() {
    this.fetchData()
  },
  methods: {
    checkPermission,
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
