<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateBusinessProcessSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-business-process-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Create Business Process </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label-for="v-name">
                <small>Process Name</small>
                <el-input v-model="form.name" placeholder="Process Name" style="width: 100%" />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-description">
                <small>Process Description</small>
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Process Description"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-roles">
                <small
                  >Role(s) responsible for business process. (Separate multiple by a comma)</small
                >
                <el-input
                  v-model="form.roles_responsible"
                  placeholder="Role(s) responsible for business process. (Separate multiple by a comma)"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-no_of_people_involved">
                <small>Number of individuals involved in performing the business process</small>
                <el-input
                  v-model="form.no_of_people_involved"
                  type="number"
                  placeholder="No. of people involved"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-minimum_no_of_people_involved">
                <small
                  >Minimum number of people that can carry out this process that would still make
                  economic sense</small
                >
                <el-input
                  v-model="form.minimum_no_of_people_involved"
                  type="number"
                  placeholder="Minimum number of people that can carry out this process that would still make economic sense"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-product_or_service_delivered">
                <small>Product or Service being delivered</small>
                <el-input
                  v-model="form.product_or_service_delivered"
                  placeholder="Product or Service being delivered"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-regulatory_obligations">
                <small>Legal, Regulatory and Contractual Obligations</small>
                <el-input
                  v-model="form.regulatory_obligations"
                  placeholder="Legal, Regulatory and Contractual Obligations"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-applications_used">
                <small>Applications used by process</small>
                <el-input
                  v-model="form.applications_used"
                  placeholder="Applications used by process"
                  style="width: 100%"
                />
                <small>(Separate multiple by a comma)</small>
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-business_units_depended_on">
                <small>Which Business Units are you dependent on</small>
                <el-select
                  v-model="form.business_units_depended_on"
                  multiple
                  placeholder="Which Business Units are you dependent on"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :disabled="business_unit.id === form.business_unit_id"
                    :value="business_unit.unit_name"
                    :label="business_unit.unit_name"
                  />
                </el-select>
              </el-form-group>
              <br />
            </el-col>

            <el-col cols="12">
              <el-form-group label-for="v-processes_depended_on">
                <small
                  >Which Business Processes are you dependent on in the Business Unit(s) listed
                  above</small
                >
                <el-input
                  v-model="form.processes_depended_on"
                  type="textarea"
                  placeholder="Which Business Processes are you dependent on in the Business Unit(s) listed above"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>

            <el-col cols="12">
              <el-form-group label-for="v-key_vendors_or_external_dependencies">
                <small>Who are your Key vendors or External dependencies</small>
                <el-input
                  v-model="form.key_vendors_or_external_dependencies"
                  type="textarea"
                  placeholder="Who are your Key vendors or External dependencies"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-vital_non_electronic_records">
                <small>Vital Non-Electronic Records</small>
                <el-input
                  v-model="form.vital_non_electronic_records"
                  placeholder="Vital Non-Electronic Records"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-vital_electronic_records">
                <small>Vital Electronic Records</small>
                <el-input
                  v-model="form.vital_electronic_records"
                  placeholder="Vital Electronic Records"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-alternative_workaround_during_system_failure">
                <small>Alternative Workarounds during system failure</small>
                <el-input
                  v-model="form.alternative_workaround_during_system_failure"
                  placeholder="Alternative Workarounds during system failure"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-key_individuals_process_depends_on">
                <small>Are there important key individuals this process is dependent on</small>
                <el-input
                  v-model="form.key_individuals_process_depends_on"
                  type="textarea"
                  placeholder="Are there important key individuals this process is dependent on"
                  style="width: 100%"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-peak_periods">
                <small>Peak Period</small>
                <el-input
                  v-model="form.peak_periods"
                  type="textarea"
                  placeholder="Peak Period"
                  style="width: 100%"
                />
                <small
                  >Indicate specific periods that are more critical than others (days, weeks,
                  months, quarter)</small
                >
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <el-form-group label-for="v-remote_working">
                <small>Remote Working</small>
                <el-select
                  v-model="form.remote_working"
                  placeholder="Please Select"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(remote_working, index) in remote_working_periods"
                    :key="index"
                    :value="remote_working"
                    :label="remote_working"
                  />
                </el-select>
                <small
                  >How long can this activity be performed at an acceptable level from home?</small
                >
                <br />
              </el-form-group>
              <br />
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  directives: {
    Ripple
  },
  model: {
    prop: 'isCreateBusinessProcessSidebarActive',
    event: 'update:is-create-business-process-sidebar-active'
  },
  props: {
    isCreateBusinessProcessSidebarActive: {
      type: Boolean,
      required: true
    },
    businessUnitId: {
      type: Number,
      default: null
    },
    clientId: {
      type: Number,
      default: null
    }
    // registeredBusinessProcesss: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      business_units: [],
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        description: '',
        roles_responsible: '',
        no_of_people_involved: '',
        minimum_no_of_people_involved: '',
        product_or_service_delivered: '',
        regulatory_obligations: '',
        applications_used: '',
        business_units_depended_on: [],
        processes_depended_on: '',
        key_vendors_or_external_dependencies: '',
        vital_non_electronic_records: '',
        vital_electronic_records: '',
        alternative_workaround_during_system_failure: '',
        key_individuals_process_depends_on: '',
        peak_periods: '',
        remote_working: ''
      },
      remote_working_periods: [
        'This cannot be done',
        '0-4 hours',
        'Up to 1 Business Day',
        'Up to 3 Business Days',
        'Up to 1 Month',
        'More than 1 Month'
      ],
      loading: false,
      selectedClient: {}
    }
  },
  created() {
    this.fetchBusinessUnits()
    this.form.business_unit_id = this.businessUnitId
    this.form.client_id = this.clientId
  },
  methods: {
    fetchBusinessUnits() {
      this.form.business_unit_id = ''
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    submit() {
      this.loading = true
      const saveBusinessProcessResource = new Resource('business-units/save-business-processes')
      const param = this.form
      saveBusinessProcessResource
        .store(param)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful'
          })
          this.form = {
            client_id: '',
            business_unit_id: '',
            name: '',
            description: '',
            roles_responsible: '',
            no_of_people_involved: '',
            minimum_no_of_people_involved: '',
            product_or_service_delivered: '',
            regulatory_obligations: '',
            applications_used: '',
            business_units_depended_on: [],
            processes_depended_on: '',
            key_vendors_or_external_dependencies: '',
            vital_non_electronic_records: '',
            vital_electronic_records: '',
            alternative_workaround_during_system_failure: '',
            key_individuals_process_depends_on: '',
            peak_periods: '',
            remote_working: ''
          }
          this.$emit('save')
          // this.$emit('update:is-create-business-process-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
