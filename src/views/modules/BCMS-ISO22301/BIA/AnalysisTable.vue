<template>
  <el-card>
    <el-button :loading="downloading" type="info" @click="exportToExcel('BIAReport')">
      Export
    </el-button>
    <!-- <el-button
      v-if="!expand"
      type="warning"
      size="mini"
      @click="expand = true"
    >
      Expand Table
    </el-button>
    <el-button
      v-else
      type="danger"
      size="mini"
      @click="expand = false"
    >
      Shrink Table
    </el-button> -->
    <div style="max-height: 500px; overflow: auto">
      <table id="BIAReport" v-loading="loading" class="table table-bordered">
        <thead>
          <tr>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 10px"> SN </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Business Unit </div>
            </th>
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Business Process Name </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 350px"> Business Process Description Summary </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Role(s) responsible for business process </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 150px">
                Number of individuals involved in performing the business process
              </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 150px">
                Minimum number of people that can carry out this process that would still make
                economic sense
              </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Product or Service being delivered </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Legal, Regulatory and Contractual Obligations </div>
            </th>
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Impact Criteria </div>
            </th>
            <th
              v-for="(disruption_impact, pdi_index) in process_disruption_impact"
              :key="pdi_index"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px">
                {{ disruption_impact['name'] }} ({{ disruption_impact['time_in_minutes'] }} mins)
              </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Priority </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Minimum Service Level </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> MAO (Maximum Allowable Outage) </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> RTO (Recovery Time Objective) </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> RPO (Recovery Point Objective) </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Applications used by process </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Which Business Units are you dependent on? </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px">
                Which Business Processes are you dependent on in the Business Unit(s) listed in the
                previous cell.
              </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Who are your Key vendors or External dependencies </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Vital Non-Electronic Records </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Vital Electronic Records </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Alternative Workarounds during system failure </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px">
                Are there important key individuals this process is dependent on
              </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Peak Period </div>
            </th>
            <th
              v-if="expand"
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="14"
            >
              <div style="width: 250px"> Remote Working </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(report, index) in bias" :key="index">
            <tr>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ index + 1 }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_unit }}
              </td>
              <td :rowspan="report.impacts.length">
                {{ report.business_process }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="report.description"></span>
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.roles_responsible }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.no_of_people_involved }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.minimum_no_of_people_involved }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.product_or_service_delivered }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.regulatory_obligations }}
              </td>
              <td
                style="background: #000000; color: #ffffff"
                data-fill-color="000000"
                data-f-color="FFFFFF"
                >{{ report.impacts[0].criteria }}</td
              >
              <td
                v-for="(disruption_impact_value, pdi_val) in report.impacts[0]
                  .process_disruption_impact"
                :key="`${pdi_val}-1`"
              >
                {{ disruption_impact_value.meaning }}
              </td>
              <td
                v-if="expand"
                :rowspan="report.impacts.length"
                :style="`background: #${report.priority_color}`"
                :data-fill-color="`${report.priority_color ? report.priority_color : 'FFFFFF'}`"
                data-f-color="000000"
              >
                {{ report.priority }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                <!-- {{ calculateMinimumServiceLevel(report.minimum_no_of_people_involved, report.no_of_people_involved) }}% -->
                {{ report.minimum_service_level }}%
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.maximum_allowable_outage }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.recovery_time_objective }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.recovery_point_objective }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.applications_used }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.business_units_depended_on }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.processes_depended_on }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.key_vendors_or_external_dependencies }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.vital_non_electronic_records }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.vital_electronic_records }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.alternative_workaround_during_system_failure }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.key_individuals_process_depends_on }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.peak_periods }}
              </td>
              <td v-if="expand" :rowspan="report.impacts.length">
                {{ report.business_process.remote_working }}
              </td>
            </tr>
            <template v-if="report.impacts.length > 1">
              <tr v-for="(impact, impact_index) in report.impacts" :key="impact_index">
                <template v-if="report.impacts[impact_index + 1]">
                  <td
                    style="background: #000000; color: #ffffff"
                    data-fill-color="000000"
                    data-f-color="FFFFFF"
                    >{{ report.impacts[impact_index + 1].criteria }}</td
                  >
                  <td
                    v-for="(disruption_impact_value, pdi_val) in report.impacts[impact_index + 1]
                      .process_disruption_impact"
                    :key="`${pdi_val}-2`"
                  >
                    {{ disruption_impact_value.meaning }}
                  </td>
                </template>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </el-card>
</template>
<script>
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      expand: true,
      bias: [],
      process_disruption_impact: [],
      loading: false,
      downloading: false
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
  created() {
    this.fetchBIA()
  },
  methods: {
    fetchBIA() {
      this.loading = true
      const fetchBIAResource = new Resource('bcms/bia/fetch-bia')
      fetchBIAResource.list({ client_id: this.selectedClient.id }).then((response) => {
        this.loading = false
        this.bias = response.bias
        this.process_disruption_impact = response.process_disruption_impact
      })
    },
    calculateMinimumServiceLevel(numerator, denominator) {
      let minimumServiceLevel = 0
      if (numerator > 0 && denominator > 0) {
        minimumServiceLevel = 100 * (numerator / denominator)
      }
      return minimumServiceLevel.toFixed(1)
    },
    exportToExcel(id) {
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: `${this.selectedClient.name}-BIA.xlsx`,
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
