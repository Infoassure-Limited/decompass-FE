<template>
  <el-card v-loading="loading">
    <template v-slot:header>
      <div>
        <span v-if="display === 'details'" class="pull-right">
          <el-button type="success" @click="display = 'create'"> Create New </el-button>
          <el-button type="primary" :loading="downloading" @click="display = 'summary'">
            View Summary Sheet
          </el-button>
        </span>
        <span v-if="display === 'summary'" class="pull-right">
          <el-button type="danger" @click="display = 'details'"> View Details </el-button>
          <el-button type="primary" :loading="downloading" @click="exportToExcel('RoPASheet')">
            Export
          </el-button>
        </span>
        <span v-if="display === 'create'" class="pull-right">
          <el-button type="danger" @click="display = 'details'"> Close Form </el-button>
        </span>
        <h3>Records of Processing Activities</h3>
      </div>
    </template>
    <div v-if="display === 'details'">
      <p></p>
      <el-collapse accordion type="border">
        <el-collapse-item
          v-for="(ropa, index) in ropas"
          :key="index"
          :title="`${ropa.business_unit} - ${ropa.controller_name}`"
        >
          <edit-ro-p-a
            :selected-data="ropa"
            :countries="countries"
            @updated="($notify({ title: 'Data Updated' }), fetchRoPA())"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-if="display === 'summary'">
      <p></p>
      <ro-p-a-table id="RoPASheet" :table-data="ropas" />
    </div>
    <div v-if="display === 'create'">
      <create-ro-p-a
        :client-id="selectedClient.id"
        :standard-id="standardId"
        :countries="countries"
      />
    </div>
  </el-card>
</template>
<script>
// import TableToExcel from '@linways/table-to-excel'
import CreateRoPA from './partials/CreateRoPA.vue'
import EditRoPA from './partials/EditRoPA.vue'
import RoPATable from './RoPATable.vue'
import Resource from '@/api/resource'

export default {
  components: {
    CreateRoPA,
    EditRoPA,
    RoPATable
  },
  props: {
    selectedClient: {
      type: Object,
      required: true
    },
    standardId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      display: 'details',
      ropas: [],
      countries: [],
      loading: false,
      downloading: false
    }
  },
  created() {
    this.fetchRoPA()
    this.fetchCountries()
  },
  methods: {
    fetchCountries() {
      const countriesResources = new Resource('countries')
      countriesResources
        .list()
        .then((response) => {
          this.countries = response.countries
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchRoPA(load = true) {
      this.loading = load
      const clientId = this.selectedClient.id
      const ropaResource = new Resource('ndpa/ropa')
      ropaResource
        .list({
          client_id: clientId
        })
        .then((response) => {
          this.ropas = response.ropas
          this.loading = false
        })
    },
    exportToExcel(id) {
      // this.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: 'RoPA-Sheet.xlsx',
      //     sheet: {
      //       name: 'Records of Processing Activities'
      //     }
      //   })
      // }, 1000)
      // setTimeout(() => {
      //   this.downloading = false
      // }, 5000)
    }
    // exportToExcel(id1, id2) {
    //
    //   this.downloading = true
    //   setTimeout(() => {
    //     const table1 = document.getElementById(id1)
    //     const table2 = document.getElementById(id2)
    //     const book = TableToExcel.tableToBook(table1, { sheet: { name: 'Personal Data Analysis Form' } })
    //     TableToExcel.tableToSheet(book, table2, { sheet: { name: 'Overall Process Control Rating' } })
    //     TableToExcel.save(book, 'RCSA-Report.xlsx')
    //   }, 1000)

    //   setTimeout(() => {
    //     this.downloading = false
    //   }, 30000)
    // },
  }
}
</script>
