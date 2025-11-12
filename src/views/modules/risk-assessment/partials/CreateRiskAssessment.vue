<template>
  <div>
    <el-row>
      <el-col v-if="form.business_unit" md="6">
        <el-form-group label="Business Unit">
          <input v-model="form.business_unit" disabled class="form-control" />
        </el-form-group>
      </el-col>
      <el-col v-if="form.business_process" md="6">
        <el-form-group label="Business Process">
          <textarea v-model="form.business_process" disabled class="form-control"></textarea>
        </el-form-group>
      </el-col>
      <el-col v-if="form.asset_type" md="6">
        <el-form-group label="Asset Type">
          <input v-model="form.asset_type" disabled class="form-control" />
        </el-form-group>
      </el-col>
      <el-col v-if="form.asset" md="6">
        <el-form-group label="Asset">
          <input v-model="form.asset" disabled class="form-control" />
        </el-form-group>
      </el-col>
      <el-col md="12">
        <!-- <el-form-group
          label="Select Threats & Vulnerabilities"
        >
          <a
            style="color: #409EFF"
            @click="showRisksForm = true"
          > <i class="el-icon-plus" /> Click to pick from Risk Register</a>
          />
        </el-form-group> -->
        <v-client-table v-model="risk_registers" :columns="columns" :options="options">
          <template v-slot:select="{ row }">
            <div>
              <el-checkbox v-model="form.risk_register_ids" :label="row.risk_id" border />
            </div>
          </template>
        </v-client-table>
      </el-col>
    </el-row>
    <P />
    <el-button :loading="loading" type="primary" @click="saveRiskAssessment()"> Save </el-button>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedData: {
      type: Object,
      default: () => null
    },
    riskAppetite: {
      type: Number,
      required: true
    },
    likelihoods: {
      type: Array,
      default: () => []
    },
    impacts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      createAssetTypeModal: false,
      createAssetModal: false,
      form: {
        module: '',
        risk_register_ids: [],
        client_id: '',
        business_unit_id: null,
        business_process_id: null,
        asset_type_id: null,
        asset_id: null
      },
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      columns: ['select', 'risk_id', 'threat', 'vulnerability_description', 'control_description'],
      options: {
        headings: {
          risk_id: 'REF',
          vulnerability_description: 'Risk Desc',
          control_description: 'Control'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['risk_id', 'threat', 'vulnerability_description', 'control_description'],
        // filterable: false,
        filterable: ['risk_id', 'threat', 'vulnerability_description', 'control_description']
      },
      loading: false,
      uploadableFile: null,
      risk_registers: [],
      risk_scenerios: [],
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
      asset_types: [],
      assets: [],
      selectedAssetTypeId: '',
      risk_appetite: null,
      performAssessment: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    this.form = this.selectedData
    this.fetchRiskRegister()
  },
  methods: {
    fetchRiskRegister() {
      this.loading = true
      const fetchRisksResource = new Resource('fetch-module-risk-registers')
      fetchRisksResource
        .list({ client_id: this.selectedClient.id, module: this.selectedData.module })
        .then((response) => {
          this.risk_registers = response.risk_registers
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveRiskAssessment() {
      this.loading = true
      const fetchRisksResource = new Resource('risk-assessment/store-risk-assessment')
      fetchRisksResource
        .store(this.form)
        .then(() => {
          this.$emit('save')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
