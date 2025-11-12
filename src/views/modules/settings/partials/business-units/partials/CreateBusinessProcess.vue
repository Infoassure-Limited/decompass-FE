<template>
  <div style="border: #333333 solid 3px; border-radius: 5px">
    <div class="justify-content-between align-items-center px-2 py-1">
      <el-button type="primary" :disabled="isImportantFieldsEmpty()" @click="submit()">
        Submit
      </el-button>
      <p></p>
      <el-form label-position="top">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="1">
            <template v-slot:title>
              <h3>Process Description</h3>
            </template>
            <el-row :gutter="10" v-loading="loading">
              <el-col :md="12">
                <el-form-item label="Process Title" label-for="v-name">
                  <el-input v-model="form.name" placeholder="Process Title" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="Process Objective" label-for="v-description">
                  <el-input
                    v-model="form.objective"
                    placeholder="Process Objective"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="Process Owner" label-for="v-name">
                  <el-select
                    v-model="form.process_owner"
                    placeholder="Select Process Owner"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(user, user_index) in staff"
                      :key="user_index"
                      :value="user.name"
                      :label="user.name"
                    >
                      <span style="float: left">{{ user.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{
                        user.designation ? user.designation : ''
                      }}</span>
                    </el-option>
                  </el-select>
                  <!-- <el-input
                  v-model="form.process_owner"
                  placeholder="Example: CTO"
                  style="width: 100%"
                /> -->
                  <!-- <el-select
                  v-model="form.process_owner"
                  placeholder="Process Owner"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(owner, index) in team_members"
                    :key="index"
                    :label="owner.name"
                    :value="owner.id"
                  />
                </el-select> -->
                </el-form-item>
              </el-col>
              <!-- <el-col :md="12">
              <el-form-item label="Teams Involved" label-for="v-description">
                <el-select v-model="form.teams" placeholder="Teams" multiple style="width: 100%">
                  <el-option
                    v-for="(team, index) in unitTeams"
                    :key="index"
                    :label="team"
                    :value="team"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
              <!--<el-col
              :md="12"
            >
              <el-form-item
                label="Process Objective"
                label-for="v-description"
              >
                <el-input
                  v-model="form.objective"
                  type="textarea"
                  placeholder="Process Objective"
                  style="width: 100%;"
                />
              </el-form-item>
              <br>
            </el-col> -->
              <el-col :md="20">
                <el-form-item label="Detailed Description/Narrative of process" label-for="v-name">
                  <!-- <ckeditor v-model="form.description" :editor="editor" :config="editorConfig" /> -->
                  <Editor v-model="form.description" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template v-slot:title>
              <h3>Other Details</h3>
            </template>
            <el-row :gutter="10" v-loading="loading">
              <el-col :md="12">
                <el-form-item label-for="v-roles">
                  <small
                    >Role(s) responsible for business process. (Separate multiple by a comma)</small
                  >
                  <el-input
                    v-model="form.roles_responsible"
                    type="textarea"
                    placeholder="Role(s) responsible for business process. (Separate multiple by a comma)"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-no_of_people_involved">
                  <small>Number of individuals involved in performing the business process</small>
                  <el-input-number
                    v-model="form.no_of_people_involved"
                    type="number"
                    :min="1"
                    placeholder="No. of people involved"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-minimum_no_of_people_involved">
                  <small
                    >Minimum number of people that can carry out this process that would still make
                    economic sense</small
                  >
                  <el-input-number
                    v-model="form.minimum_no_of_people_involved"
                    type="number"
                    :min="1"
                    placeholder="Minimum number of people that can carry out this process that would still make economic sense"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-product_or_service_delivered">
                  <small>Product or Service being delivered</small>
                  <el-input
                    v-model="form.product_or_service_delivered"
                    type="textarea"
                    placeholder="Product or Service being delivered"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-regulatory_obligations">
                  <small>Legal, Regulatory and Contractual Obligations</small>
                  <el-input
                    v-model="form.regulatory_obligations"
                    type="textarea"
                    placeholder="Legal, Regulatory and Contractual Obligations"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-applications_used">
                  <small>Applications used by process</small>
                  <el-input
                    v-model="form.applications_used"
                    type="textarea"
                    placeholder="Applications used by process"
                    style="width: 100%"
                  />
                  <small>(Separate multiple by a comma)</small>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-business_units_depended_on">
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
                </el-form-item>
              </el-col>

              <el-col :md="12">
                <el-form-item label-for="v-processes_depended_on">
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
                </el-form-item>
              </el-col>

              <el-col :md="12">
                <el-form-item label-for="v-key_vendors_or_external_dependencies">
                  <small>Who are your Key vendors or External dependencies</small>
                  <el-input
                    v-model="form.key_vendors_or_external_dependencies"
                    type="textarea"
                    placeholder="Who are your Key vendors or External dependencies"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-vital_non_electronic_records">
                  <small>Vital Non-Electronic Records</small>
                  <el-input
                    v-model="form.vital_non_electronic_records"
                    placeholder="Vital Non-Electronic Records"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-vital_electronic_records">
                  <small>Vital Electronic Records</small>
                  <el-input
                    v-model="form.vital_electronic_records"
                    placeholder="Vital Electronic Records"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-alternative_workaround_during_system_failure">
                  <small>Alternative Workarounds during system failure</small>
                  <el-input
                    v-model="form.alternative_workaround_during_system_failure"
                    placeholder="Alternative Workarounds during system failure"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-key_individuals_process_depends_on">
                  <small>Are there important key individuals this process is dependent on</small>
                  <el-input
                    v-model="form.key_individuals_process_depends_on"
                    type="textarea"
                    placeholder="Are there important key individuals this process is dependent on"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-peak_periods">
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
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label-for="v-remote_working">
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
                    >How long can this activity be performed at an acceptable level from
                    home?</small
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>

      <!-- <el-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="mr-1"
        :disabled="isImportantFieldsEmpty()"
        @click="submit()"
      >
        Submit
      </el-button> -->
    </div>
  </div>
</template>
<script>
import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'

export default {
  components: { Editor },
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
      activeName: '1',
      business_units: [],
      selectedBusinessUnit: null,
      unitTeams: [],
      team_members: [],
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        description: '',
        process_owner: '',
        teams: [],
        // narrative: '',
        objective: '',
        roles_responsible: '',
        no_of_people_involved: 1,
        minimum_no_of_people_involved: 1,
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
      selectedClient: {},
      staff: []
    }
  },
  created() {
    this.fetchStaff()
    this.fetchBusinessUnits()
    this.form.business_unit_id = this.businessUnitId
    this.form.client_id = this.clientId
  },
  methods: {
    isImportantFieldsEmpty() {
      // if (this.form.name === '' || this.form.process_owner === '' || this.form.description === '' || this.form.objective === '') {
      //   return true
      // }
      if (this.form.name === '' || this.form.process_owner === '') {
        return true
      }
      return false
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    fetchBusinessUnits() {
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.business_units = response.business_units
          this.business_units.forEach((unit) => {
            if (unit.id === this.businessUnitId) {
              this.selectedBusinessUnit = unit
              const { teams } = unit
              const teamMembers = unit.team_members
              this.unitTeams = teams
              this.team_members = teamMembers
            }
          })
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
