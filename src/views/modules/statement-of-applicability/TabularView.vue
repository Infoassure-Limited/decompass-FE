<template>
  <div
    v-if="selectedClient !== ''"
    v-loading="loading"
    element-loading-text="...loading, please wait"
    style="max-height: 650px; overflow: auto"
    class="table-responsive"
  >
    <el-button @click="exportToExcel('soaTable')"> Export </el-button>
    <p></p>
    <!-- <el-collapse v-if="!downloading">

          <el-collapse-item
            v-for="(soa, soa_index) in soas"
            :key="soa_index"
            :title="soa.name"
            :name="soa.id"
          >
            <div class="table-responsive">
              <el-table
                :data="soa.controls"
                style="width: 100%"
                height="450"
              >
                <el-table-column
                  fixed
                  label="Control"
                  width="250"
                >
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Control Description"
                  width="400"
                >
                  <template slot-scope="scope">
                    {{ scope.row.description }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Control Applicable"
                  width="150"
                >
                  <template slot-scope="scope">
                    <select
                      v-model="scope.row.soa.applicable"
                      placeholder="Applicable"
                      style="width: 100%"
                      @input="saveSOA('applicable', $event, scope.row.soa.id)"
                    >
                      <option value="Yes">
                        Yes
                      </option>
                      <option value="No">
                        No
                      </option>
                    </select>
                  </template>
                </el-table-column>
                <el-table-column label="REASONS FOR SELECTION">
                  <el-table-column
                    label="Legal/Contractual Requirement"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <select
                        v-model="scope.row.soa.legal_requirement"
                        placeholder="Implemented"
                        style="width: 100%"
                        @input="saveSOA('legal_requirement', $event, scope.row.soa.id)"
                      >
                        <option value="Yes">
                          Yes
                        </option>
                        <option value="No">
                          No
                        </option>
                      </select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Business Requirement"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <select
                        v-model="scope.row.soa.business_requirement"
                        placeholder="business_requirement"
                        style="width: 100%"
                        @input="saveSOA('business_requirement', $event, scope.row.soa.id)"
                      >
                        <option value="Yes">
                          Yes
                        </option>
                        <option value="No">
                          No
                        </option>
                      </select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Result of Risk Assessment"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <select
                        v-model="scope.row.soa.result_of_risk_assessment"
                        placeholder="result_of_risk_assessment"
                        style="width: 100%"
                        @input="saveSOA('result_of_risk_assessment', $event, scope.row.soa.id)"
                      >
                        <option value="Yes">
                          Yes
                        </option>
                        <option value="No">
                          No
                        </option>
                      </select>
                    </template>
                  </el-table-column>

                </el-table-column>
                <el-table-column
                  label="Description of Controls/Justification for Exclusion"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.justification_of_exclusion"
                      placeholder="Description of Controls/Justification for Exclusion"
                      style="width: 100%"
                      @blur="saveSOA('justification_of_exclusion', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reference to Control Document/Evidence"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.reference_to_control_document"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('reference_to_control_document', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Control Implemented"
                  width="150"
                >
                  <template slot-scope="scope">
                    <select
                      v-model="scope.row.soa.implemented"
                      placeholder="Implemented"
                      style="width: 100%"
                      @input="saveSOA('implemented', $event, scope.row.soa.id)"
                    >
                      <option value="Fully Implemented">
                        Fully Implemented
                      </option>
                      <option value="Partially Implemented">
                        Partially Implemented
                      </option>
                      <option value="Not Implemented">
                        Not Implemented
                      </option>
                    </select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Additional Controls Required (if any)"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.addition_control_required"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('addition_control_required', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Assets"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.assets"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('assets', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Risk"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.risk"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('risk', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Issue"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.issue"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('issue', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="R"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.r"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('r', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="A"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.a"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('a', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="C"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.c"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('c', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="I"
                  width="250"
                >
                  <template slot-scope="scope">
                    <textarea
                      v-model="scope.row.soa.i"
                      placeholder="Type here..."
                      style="width: 100%"
                      @blur="saveSOA('i', $event, scope.row.soa.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse> -->
    <table id="soaTable" data-cols-width="30,50,70,30,30,30,30,30,50,30,30,50,30,30,30,30,30,30">
      <thead>
        <tr>
          <th
            rowspan="2"
            style="font-size: 14px"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
            ><div style="width: 150px">AREA</div></th
          >
          <th
            rowspan="2"
            style="font-size: 14px"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
            ><div style="width: 250px">CONTROL</div></th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff" :data-a-wrap="true"
            ><div style="width: 250px">Control Description</div></th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">Control Applicable</th>
          <th
            colspan="3"
            style="font-size: 14px"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
            >REASONS FOR SELECTION</th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff"
            >Description of Controls/Justification for Exclusion</th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff"
            >Reference to Control Document/Evidence</th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">Control Implemented</th>
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff"
            >Additional Controls Required (if any)</th
          >
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">Asset</th>
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">Risk</th>
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">Issue</th>
          <th rowspan="2" data-fill-color="333333" data-f-color="ffffff">R</th>
          <th rowspan="2" data-fill-color="46035a" data-f-color="ffffff">A</th>
          <th rowspan="2" data-fill-color="46035a" data-f-color="ffffff">C</th>
          <th rowspan="2" data-fill-color="46035a" data-f-color="ffffff">I</th>
        </tr>
        <tr>
          <th data-fill-color="333333" data-f-color="ffffff">Legal/Contractual Requirement</th>
          <th data-fill-color="333333" data-f-color="ffffff">Business Requirement</th>
          <th data-fill-color="333333" data-f-color="ffffff">Result of Risk Assessment</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="soa in soas" :key="soa.name">
          <tr>
            <td data-a-v="top">
              {{ soa.name }}
            </td>
            <td v-for="cell in 17" :key="`${cell}-i`"></td>
          </tr>
          <tr v-for="control in soa.controls" :key="control.id">
            <td></td>
            <td data-a-v="top">
              {{ control.name }}
            </td>
            <td data-a-wrap="true" data-a-v="top">
              {{ control.description }}
            </td>
            <td data-a-v="top">
              {{ control.soa.applicable }}
            </td>
            <td data-a-v="top">
              {{ control.soa.legal_requirement }}
            </td>
            <td data-a-v="top">
              {{ control.soa.business_requirement }}
            </td>
            <td data-a-v="top">
              {{ control.soa.result_of_risk_assessment }}
            </td>
            <td data-a-wrap="true" data-a-v="top">
              {{ control.soa.justification_of_exclusion }}
            </td>
            <td data-a-wrap="true" data-a-v="top">
              {{ control.soa.reference_to_control_document }}
            </td>
            <td data-a-v="top">
              {{ control.soa.implemented }}
            </td>
            <td data-a-v="top">
              {{ control.soa.addition_control_required }}
            </td>
            <td data-a-v="top">
              {{ control.soa.assets ? control.soa.assets.toString() : '' }}
            </td>
            <td data-a-wrap="true" data-a-v="top">
              {{ control.soa.risk }}
            </td>
            <td data-a-v="top">
              {{ control.soa.issue }}
            </td>
            <td data-a-v="top">
              {{ control.soa.r }}
            </td>
            <td data-a-v="top">
              {{ control.soa.a }}
            </td>
            <td data-a-v="top">
              {{ control.soa.c }}
            </td>
            <td data-a-v="top">
              {{ control.soa.i }}
            </td>
          </tr>
          <tr>
            <td data-fill-color="2E37B4" data-f-color="ffffff">Totals: </td>
            <td data-fill-color="2E37B4" data-f-color="ffffff">{{ soa.controls.length }}</td>
            <td data-fill-color="2E37B4" data-f-color="ffffff"></td>
            <td data-fill-color="2E37B4" data-f-color="ffffff">{{
              getTotal('applicable', soa.controls)
            }}</td>
            <td data-fill-color="2E37B4" data-f-color="ffffff">{{
              getTotal('implemented', soa.controls)
            }}</td>
            <td v-for="cell in 13" :key="`${cell}-total`"></td>
          </tr>
          <tr>
            <td v-for="cell in 18" :key="`${cell}-border`" data-fill-color="000000"></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  data() {
    return {
      downloading: false,
      loading: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      summary: {}
    }
  },
  created() {
    this.fetchSOA()
    this.fetchReportSummary()
  },
  methods: {
    checkPermission,
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
    getTotal(field, controls) {
      let count = 0
      controls.forEach((control) => {
        if (control.soa[field] === 'Yes') {
          count += 1
        }
      })
      return count
    },
    fetchSOA(load = true) {
      this.loading = load
      const fetchSOAsResource = new Resource('soa/fetch-soa')
      fetchSOAsResource
        .list()
        .then((response) => {
          this.soas = response.soas
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchReportSummary() {
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list().then((response) => {
        this.summary = response
        // this.chart_report.series = response.series
        // this.chart_report.xAxis.categories = response.categories
        // this.chart_report.subtitle.text = response.subtitle
      })
    },
    exportToExcel(id) {
      // this.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: `${this.selectedClient.name}-SOADetails.xlsx`,
      //     sheet: {
      //       name: 'Sheet 1'
      //     }
      //   })
      // }, 1000)
      // setTimeout(() => {
      //   this.downloading = false
      // }, 30000)
    }
  }
}
</script>
<style scoped>
table,
th,
td {
  border: 1px solid #cccccc;
  border-collapse: collapse;
  padding: 5px;
}
</style>
