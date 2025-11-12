<template>
  <div>
    <div v-if="selectedClient !== null" v-loading="loading">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="16" :md="16">
          <p>Select the matrix your company uses</p>
          <el-select
            v-model="risk_matrix.current_matrix"
            style="width: 100%"
            @input="sendProposedMatrix($event)"
          >
            <el-option
              v-for="(matrix_val, index) in matrices"
              :key="index"
              :lable="matrix_val"
              :value="matrix_val"
            />
          </el-select>
          <p></p>
          <table v-if="risk_matrix !== null" class="table table-bordered">
            <tr>
              <th v-if="risk_matrix.proposed_matrix !== null"> Proposed Matrix </th>
              <th v-if="risk_matrix.proposed_matrix === null"> Active Matrix </th>
              <th v-if="risk_matrix.proposed_matrix !== null"> Proposed By </th>
              <th v-if="risk_matrix.proposed_matrix === null"> Approved By </th>
              <th v-if="risk_matrix.proposed_matrix !== null"></th>
            </tr>
            <tr>
              <td v-if="risk_matrix.proposed_matrix !== null">
                {{ risk_matrix.proposed_matrix }}
              </td>
              <td v-if="risk_matrix.proposed_matrix === null">
                {{ risk_matrix.current_matrix }}
              </td>
              <td v-if="risk_matrix.proposed_matrix !== null">
                {{ risk_matrix.creator ? risk_matrix.creator.name : '' }}
              </td>
              <td v-if="risk_matrix.proposed_matrix === null">
                {{ risk_matrix.approver ? risk_matrix.approver.name : '' }}
              </td>
              <td v-if="risk_matrix.proposed_matrix !== null">
                <el-button type="success" @click="approvematrix(risk_matrix.id)">
                  Click to approve
                </el-button>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col v-if="matrix !== '' && risk_matrix !== null" :xs="24" :sm="8" :md="8">
          <div
            :style="`background: ${setCoolBackground()};
              border: 2px solid ${setCoolBackground(0.9)};
              padding: 10px;
              border-radius: 5px;
              border-radius: 5px;
              text-align: center;
            `"
          >
            <strong>Set your Risk Appetite here</strong>
            <el-select
              v-model="risk_appetite"
              style="width: 100%"
              @change="setRiskAppetite(risk_matrix.id)"
            >
              <el-option
                v-for="(appetite, index) in fetchRiskAppetite(matrix)"
                :key="index"
                :value="appetite.value"
                :label="appetite.label"
              />
            </el-select>
            <!-- <highcharts :options="riskAppetiteAnalytics" /> -->
            <img :src="changeImpactImage(risk_appetite)" />
          </div>
        </el-col>
      </el-row>
      <el-tabs v-if="matrix !== ''" type="border-card">
        <el-tab-pane :label="`${matrix} Matrix Risk Ratings`">
          <div>
            <p>You can modify the description to suite your company's need</p>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8" :md="8">
                <h3>Impact Ratings</h3>
                <aside>
                  <table class="table table-bordered">
                    <tr>
                      <td>Rating</td>
                      <td>Description</td>
                    </tr>
                    <tr
                      v-for="(content, impact_matrix_index) in impact_matrices[matrix]"
                      :key="impact_matrix_index"
                    >
                      <td>{{ content.value }}</td>
                      <td>
                        <input
                          v-model="content.name"
                          type="text"
                          class="form-control"
                          @blur="customizeRiskMatrix(content.id, 'impact', 'name', $event)"
                        />
                      </td>
                    </tr>
                  </table>
                </aside>
              </el-col>
              <el-col :xs="24" :sm="16" :md="16">
                <h3>Likelihood Ratings</h3>
                <aside>
                  <table class="table table-bordered" nowrap>
                    <tr>
                      <td>Rating</td>
                      <td>Description</td>
                      <td>Summary</td>
                    </tr>
                    <tr
                      v-for="(content, likelihood_matrix_index) in likelihood_matrices[matrix]"
                      :key="likelihood_matrix_index"
                    >
                      <td>{{ content.value }}</td>
                      <td>
                        <input
                          v-model="content.name"
                          type="text"
                          class="form-control"
                          @blur="customizeRiskMatrix(content.id, 'likelihood', 'name', $event)"
                        />
                      </td>
                      <td>
                        <textarea
                          v-model="content.summary"
                          type="text"
                          class="form-control"
                          @blur="customizeRiskMatrix(content.id, 'likelihood', 'summary', $event)"
                        ></textarea>
                      </td>
                    </tr>
                  </table>
                </aside>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Impact Analysis">
          <el-row>
            <el-col :col="12">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Rating</th>
                      <th>Description</th>
                      <th
                        v-for="(impact_on_area, impact_area_index1) in impact_matrices[matrix][0]
                          .impact_on_areas"
                        :key="impact_area_index1"
                      >
                        {{ impact_on_area.impact_area.area }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(content, i_matrix_index) in impact_matrices[matrix]"
                      :key="i_matrix_index"
                    >
                      <td>{{ content.value }}</td>
                      <td>{{ content.name }}</td>
                      <td
                        v-for="(impact_on_area, impact_area_index2) in content.impact_on_areas"
                        :key="impact_area_index2"
                      >
                        <div>
                          <textarea
                            v-model="impact_on_area.impact_level"
                            type="text"
                            :placeholder="`Enter ${impact_on_area.impact_area.area}`"
                            @blur="saveImpactOnAreas(impact_on_area.id, $event)"
                          ></textarea>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Risk Ranking Matrix" :lazy="true">
          <risk-ranking-matrix :matrix="matrix" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import RiskRankingMatrix from './partials/RiskRankingMatrix.vue'
import Resource from '@/api/resource'
import { setCoolBackground } from '@/utils/tsxHelper'

export default {
  components: {
    RiskRankingMatrix
  },
  data() {
    return {
      // riskAppetiteAnalytics: {
      //   chart: {
      //     type: 'gauge',
      //     plotBackgroundColor: null,
      //     plotBackgroundImage: null,
      //     plotBorderWidth: 0,
      //     plotShadow: false,
      //   },
      //   title: {
      //     text: 'Risk Appetite Scale',
      //   },
      //   pane: {
      //     startAngle: -90,
      //     endAngle: 89.9,
      //     background: null,
      //     size: '80%',
      //   },
      //   // the value axis
      //   yAxis: {
      //     min: 0,
      //     max: 100,
      //     tickLength: 20,
      //     tickWidth: 2,
      //     minorTickInterval: null,
      //     tickPositions: [],
      //     tickColor: '#fff',
      //     labels: {
      //       step: 2,
      //       rotation: 'auto',
      //     },
      //     title: {
      //       text: '',
      //     },
      //     plotBands: [
      //       {
      //         from: 0,
      //         to: 4,
      //         thickness: 20,
      //         borderRadius: '50%',
      //         color: '#48a11e', // red
      //       },
      //       {
      //         from: 4,
      //         to: 7,
      //         thickness: 20,
      //         borderRadius: '50%',
      //         color: '#DDDF0D', // yellow
      //       },
      //       {
      //         from: 7,
      //         to: 12,
      //         thickness: 20,
      //         borderRadius: '50%',
      //         color: '#DF5353', // green
      //       },
      //     ],
      //   },
      //   series: [
      //     {
      //       dataLabels: {
      //         enabled: false,
      //       },
      //       name: 'Risk Appetite',
      //       data: [0],
      //       dial: {
      //         radius: '80%',
      //         backgroundColor: 'gray',
      //         baseWidth: 12,
      //         baseLength: '0%',
      //         rearLength: '0%',
      //       },
      //       pivot: {
      //         backgroundColor: 'gray',
      //         radius: 6,
      //       },
      //     },
      //   ],
      //   credits: {
      //     enabled: false,
      //   },
      //   exporting: {
      //     enabled: false,
      //   },
      // },
      clients: [],
      matrices: [],
      impact_matrices: [],
      likelihood_matrices: [],
      form: {
        proposed_matrix: '',
        client_id: ''
      },
      risk_matrix: { current_matrix: '', risk_appetite: '' },
      matrix: '',
      risk_impact_areas: [],
      risk_appetite: '',
      loader: false,
      loading: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.loadFunctions()
    }
  },
  created() {
    this.loadFunctions()
  },
  methods: {
    setCoolBackground,
    loadFunctions() {
      this.fetchRiskMatricesSetup()
      this.fetchRiskImpactAreas()
    },
    changeImpactImage(score) {
      const { matrix } = this
      if (matrix === '3x3') {
        if (score >= 6) {
          return 'images/project-icons/high-impact-level.png'
        }
        if (score >= 3 && score <= 5) {
          return 'images/project-icons/medium-impact-level.png'
        }
        if (score >= 1 && score <= 2) {
          return 'images/project-icons/low-impact-level.png'
        }
      }
      if (matrix === '5x5') {
        if (score >= 12) {
          return 'images/project-icons/high-impact-level.png'
        }
        if (score >= 5 && score <= 11) {
          return 'images/project-icons/medium-impact-level.png'
        }
        if (score >= 1 && score <= 4) {
          return 'images/project-icons/low-impact-level.png'
        }
      }

      return 'images/project-icons/no-impact-level.png'
    },
    fetchRiskImpactAreas() {
      this.loading = true
      const fetchRisksResource = new Resource('fetch-risk-impact-area')
      fetchRisksResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.risk_impact_areas = response.risk_impact_areas
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchRiskMatricesSetup() {
      const fetchMatriceResource = new Resource('setup-risk-matrices')
      fetchMatriceResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.impact_matrices = response.impact_matrices
          this.likelihood_matrices = response.likelihood_matrices
          this.risk_matrix = response.risk_matrix
          this.matrix = response.risk_matrix.current_matrix
          this.risk_appetite = response.risk_matrix.risk_appetite
          this.matrices = response.matrices
        })
        .catch()
    },
    customizeRiskMatrix(id, table, field, event) {
      const { value } = event.target
      const fetchMatriceResource = new Resource('customize-risk-matrix')
      fetchMatriceResource
        .store({
          id,
          table,
          field,
          value
        })
        .then()
        .catch()
    },
    saveImpactOnAreas(id, event) {
      const { value } = event.target
      const approveMatrixResource = new Resource('update-risk-impact-on-area')
      approveMatrixResource
        .update(id, { impact_level: value })
        .then(() => {})
        .catch()
    },
    sendProposedMatrix(matrix) {
      this.loader = true
      this.form.client_id = this.selectedClient.id
      this.form.proposed_matrix = matrix
      const proposedMatrixResource = new Resource('propose-matrix')
      proposedMatrixResource
        .store(this.form)
        .then((response) => {
          this.$notify({
            message: `${matrix} Matrix activation request sent and awaiting approval`,
            type: 'success'
          })
          this.risk_matrix = response.risk_matrix
          this.loader = false
        })
        .catch((this.loader = false))
    },
    approvematrix(id) {
      this.loader = true
      const approveMatrixResource = new Resource('approve-matrix')
      approveMatrixResource
        .update(id)
        .then(() => {
          this.loadFunctions()
          this.loader = false
        })
        .catch((this.loader = false))
    },
    setRiskAppetite(id) {
      this.loader = true
      const approveMatrixResource = new Resource('set-risk-appetite')
      approveMatrixResource
        .update(id, { risk_appetite: this.risk_appetite })
        .then((response) => {
          this.risk_matrix = response.risk_matrix
          this.loader = false
        })
        .catch((this.loader = false))
    },
    fetchRiskAppetite(matrix) {
      let matrixRange = []
      if (matrix === '3x3') {
        matrixRange = [
          { value: 2, label: 'LOW (1-2 Risk Score)' },
          { value: 5, label: 'MEDIUM (3-5 Risk Score)' },
          { value: 9, label: 'HIGH (Above 5 Risk Score)' }
        ]
      }
      if (matrix === '5x5') {
        matrixRange = [
          { value: 4, label: 'LOW (1-4 Risk Score)' },
          { value: 11, label: 'MEDIUM (5-11 Risk Score)' },
          { value: 25, label: 'HIGH (Above 12 Risk Score)' }
        ]
      }
      return matrixRange
    }
  }
}
</script>
