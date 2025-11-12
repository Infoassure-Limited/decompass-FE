<template>
  <div>
    <div>
      <span>
        <el-button
          variant="outline-secondary"
          :loading="downloading"
          @click="exportTableToExcel('PDATable')"
        >
          <icon icon="tabler:download" />
          <span class="align-middle">Export</span>
        </el-button>
      </span>
    </div>
    <table id="PDATable" v-loading="loading" class="table table-bordered table-responsive">
      <thead>
        <tr>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            REF
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 150px"> UNIT/ DEPARTMENT </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> PROJECT OR BUSINESS PROCESS </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> PERSONAL DATA ITEM </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 150px"> DESCRIPTION </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 150px"> IS SENSITITVE PERSONAL DATA? </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> ARTICLE 1.3(xxv) EXCEPTION USED (SENSITIVE DATA ONLY) </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> OBTAINED FROM DATA SUBJECT? </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> OWNER </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> PROCESSING PURPOSE </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> LAWFUL BASIS OF PROCESSING </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 100px"> IF CONSENT- BASED, HOW IS CONSENT OBTAINED? </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> AUTOMATED DECISION-MAKING? </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> LEVEL OF DATA SUBJECT ACCESS </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> LOCATION STORED </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> COUNTRY STORED IN </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> RETENTION PERIOD </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> ENCRYPTION LEVEL </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> ACCESS CONTROLS </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> THIRD PARTIES SHARED WITH </div>
          </th>
          <th
            data-fill-color="666666"
            data-el-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> COMMENTS </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in tableData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ report.business_unit }}</td>
          <td>{{ report.business_process }}</td>
          <td>{{ report.personal_data_item.toString(',') }}</td>
          <td>{{ report.description }}</td>
          <td>{{ report.sensitive_personal_data }}</td>
          <td>
            {{ report.exception_used_personal_data }}
          </td>
          <td>
            {{ report.obtained_from_data_source }}
          </td>
          <td>
            {{ report.owner }}
          </td>
          <td>
            {{ report.processing_purpose }}
          </td>
          <td>
            {{ report.lawful_basis_of_processing }}
          </td>
          <td>
            {{ report.how_is_consent_obtained }}
          </td>
          <td>
            {{ report.automated_decision_making }}
          </td>
          <td>
            {{ report.level_of_data_subject_access }}
          </td>
          <td>
            {{ report.location_stored }}
          </td>
          <td>
            {{ report.country_stored_in }}
          </td>
          <td>
            {{ report.retention_period }}
          </td>
          <td>
            {{ report.encryption_level }}
          </td>
          <td>
            {{ report.access_control }}
          </td>
          <td>
            {{ report.third_parties_shared_with }}
          </td>
          <td>
            {{ report.comments }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      tableData: [],
      loading: false,
      downloading: false
    }
  },
  created() {
    this.fetchPDA()
  },
  methods: {
    fetchPDA(load = true) {
      this.loading = load
      const pdaResource = new Resource('ndpa/pda')
      pdaResource
        .list({
          client_id: this.clientId
        })
        .then((response) => {
          this.tableData = response.pdas
          this.loading = false
        })
    },
    exportTableToExcel(id) {
      // this.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: 'PDATable.xlsx',
      //     sheet: {
      //       name: 'Sheet 1'
      //     }
      //   })
      //   this.downloading = false
      // }, 1000)
    }
  }
}
</script>
