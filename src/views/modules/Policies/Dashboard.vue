<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="6">
        <div v-if="loading">
          <el-row :gutter="15">
            <el-col v-for="(count, count_index) in 7" :key="count_index" :md="24">
              <el-card>
                <el-skeleton :loading="loading" :rows="1" animated />
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <DataCount v-if="dashboardData !== null" :dashboard-data="dashboardData" />
        </div>
      </el-col>
      <el-col :md="18">
        <el-row :gutter="15">
          <el-col :md="24">
            <div v-if="loading">
              <el-card>
                <el-skeleton :loading="loading" :rows="3" animated />
              </el-card>
            </div>
            <div v-else>
              <PolicyByCategory
                v-if="dashboardData !== null"
                :data="dashboardData.policies_by_category"
              />
            </div>
          </el-col>
          <el-col :md="24">
            <aside>
              <div v-if="loading">
                <el-row :gutter="15">
                  <el-col v-for="(count, count_index) in 4" :key="count_index" :md="24">
                    <el-card>
                      <el-skeleton :loading="loading" :rows="1" animated />
                    </el-card>
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                <h4>Recent Activities</h4>
                <div v-if="dashboardData !== null" style="max-height: 700px; overflow: auto">
                  <el-card v-for="(activity, index) in dashboardData.recent_activity" :key="index">
                    <div>
                      <div>
                        <strong>{{ activity.details }}</strong>

                        <small class="pull-right">
                          {{ moment(activity.created_at).format('lll') }}
                        </small>
                      </div>
                      <div>
                        <small>{{
                          `${activity.user.name} ${activity.action} ${activity.policy.title} for document number : ${activity.policy.document_number}`
                        }}</small>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </aside>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog v-model="showVersion" width="95%" destroy-on-close hide-footer>
      <template v-slot:header>
        <strong>Details of Activity</strong>
        <el-button
          type="primary"
          class="pull-right"
          round
          @click="
            generatePdf(selectedActivity.policy.title, selectedActivity.policy.document_number)
          "
        >
          <icon icon="tabler:file-download" size="25" /> Download
        </el-button>
      </template>
      <div class="pdf-container">
        <div ref="pdfContent" style="height: 500px; overflow: auto">
          <div v-if="selectedActivity.policy.status !== 'published'" class="watermark">
            {{ selectedActivity.policy.status.toUpperCase() }}
          </div>
          <h3>{{ selectedActivity.policy.title }}</h3>
          <div v-html="selectedActivity.policy.content"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import DataCount from './charts/DataCount.vue'
import Resource from '@/api/resource'
import PolicyByCategory from './charts/PolicyByCategory.vue'

export default {
  components: {
    DataCount,
    PolicyByCategory
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      dashboardData: null,
      selectedActivity: null,
      showVersion: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.fetchPolicyDashboard()
  },
  methods: {
    moment,
    fetchPolicyDashboard() {
      const dashboardResource = new Resource('policy/dashboard')
      this.loading = true
      dashboardResource
        .list()
        .then((response) => {
          this.dashboardData = response.data
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    viewVersion(version) {
      this.selectedActivity = version
      this.showVersion = true
    },
    generatePdf(title, version) {
      const element = this.$refs.pdfContent.innerHTML
      const opt = {
        margin: 10,
        filename: `${title}-v${version}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).save()
    }
  }
}
</script>
<style scoped>
.pdf-container {
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 10em;
  color: rgba(0, 0, 0, 0.1);
  user-select: none;
  pointer-events: none;
}
</style>
