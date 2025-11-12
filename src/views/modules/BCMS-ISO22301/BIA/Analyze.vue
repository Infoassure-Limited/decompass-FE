<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button type="primary" @click="viewType = 'tabular'"
            ><icon icon="tabler:table" /> Tabular View</el-button
          >
        </span>
        <h3>Business Impact Analysis</h3>
      </div>
    </template>
    <el-container style="height: 100%; border: 1px solid #eee; background: #fff">
      <el-aside
        v-if="showMenu"
        v-loading="loading"
        element-loading-text="loading assessment, please wait..."
        width="300px"
      >
        <el-collapse>
          <el-collapse-item
            v-for="(assessments, business_unit) in business_impact_analyses"
            :key="business_unit"
            :index="`${business_unit}`"
          >
            <template #title>
              <strong>{{ business_unit }}</strong>
            </template>
            <CardNavView
              v-for="(assessment, assessments_index) in assessments"
              :key="assessments_index"
              :id="`${business_unit}-${assessments_index}`"
              :title="`Process ${assessment.generated_process_id} `"
              @click="viewDetails(assessment)"
            >
              <template #description>
                <div>
                  <em>
                    <icon icon="tabler:arrow-badge-right" /> {{ assessment.business_process }}
                  </em>
                </div>
              </template>
            </CardNavView>
          </el-collapse-item>
        </el-collapse>
      </el-aside>

      <el-container>
        <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-fold"></i
            ></a>
            <a v-else style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-unfold"></i
            ></a>
          </el-tooltip>
        </h1>

        <el-main v-loading="loadView">
          <div v-if="viewType === 'edit'">
            <edit-analysis
              :impacts="impacts"
              :selected-data="selectedData"
              @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'tabular'">
            <analysis-table />
          </div>
          <div v-if="viewType === 'welcome'" align="center">
            <img src="/images/project-icons/bia-large.png" width="200" />
            <h3>Manage your BIA here</h3>
            <span align="center">
              <p>Use the Left Navigation to perform your analysis </p>
            </span>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>
<script>
import CardNavView from '@/views/Components/CardNavView.vue'
import EditAnalysis from './EditAnalysis.vue'
import AnalysisTable from './AnalysisTable.vue'
import Resource from '@/api/resource'

export default {
  components: {
    CardNavView,
    EditAnalysis,
    AnalysisTable
  },
  data() {
    return {
      viewType: 'welcome',
      showMenu: true,
      business_impact_analyses: [],
      impacts: [],
      selectedData: [],
      loading: false,
      loadView: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    selectedClient() {
      this.fetchBIA()
      this.fetchImpacts()
    }
  },
  created() {
    this.fetchBIA()
    this.fetchImpacts()
  },
  methods: {
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    // viewDetails(data) {
    //   this.selectedData = data
    //   this.viewType = 'edit'
    //   // this.showMenu = false
    // },
    viewDetails(data, viewId) {
      if (data.id) {
        this.selectedData = data
        this.viewType = 'edit'
      }
    },
    fetchBIA() {
      this.loading = true
      const fetchBIAResource = new Resource('bcms/bia/fetch-bia')
      fetchBIAResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.loading = false
          this.business_impact_analyses = response.business_impact_analyses
        })
        .catch(() => {
          this.loading = false
        })
    },
    renderViewAgain() {
      this.fetchBIA()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    }
  }
}
</script>
