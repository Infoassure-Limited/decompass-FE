<template>
  <div v-loading="loading">
    <h3>Kindly fill the form below</h3>
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :md="12">
          <label>
            Select Business Unit
            <el-select
              v-model="form.business_unit_id"
              placeholder="Select Business Unit"
              style="width: 100%"
              filterable
              @change="fetchBusinessProcesses()"
            >
              <el-option
                v-for="(business_unit, index) in business_units"
                :key="index"
                :value="business_unit.id"
                :label="business_unit.unit_name"
              />
            </el-select>
          </label>
        </el-col>
        <el-col :md="12">
          <label>
            Select Business Process
            <el-select
              v-model="selectedBusinessProcess"
              placeholder="Select Business process"
              value-key="id"
              style="width: 100%"
              filterable
              @change="setProcessOwner()"
            >
              <el-option
                v-for="(business_process, index) in business_processes"
                :key="index"
                :value="business_process"
                :label="business_process.name"
              />
            </el-select>
          </label>
        </el-col>
      </el-row>

      <div v-if="form.business_process_id !== ''">
        <el-row :gutter="20">
          <el-col :md="24">
            <label>
              Personal Data Item (multiple selection enabled)
              <el-tooltip
                content="The actual data involved; this may be a single item or a logical group of data e.g. 'customer name' or 'customer name and address'"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <br />
              <small><em>Press the Enter key to add multiple items</em></small>
            </label>
            <!-- <el-tag v-for="pdi in form.personal_data_item" :key="pdi" :closable="false">
              {{ pdi }}
            </el-tag>
            <p></p> -->
            <el-input-tag
              v-model="form.personal_data_item"
              tag-type="primary"
              placeholder="Please input"
              aria-label="Please click the Enter key after input"
            />
            <!-- <el-input
              id="personal_data_item"
              v-model="form.personal_data_item"
              type="textarea"
              placeholder="Example: Name, Address, BVN, etc"
              style="width: 100%"
            /> -->
            <!-- <el-select
              id="personal_data_item"
              v-model="form.personal_data_item"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="Example: Name, Address, BVN, etc"
              style="width: 100%"
            >
              <el-option
                v-for="item in personalDataItems"
                :key="item.id"
                :label="item.item"
                :value="item.item"
              />
            </el-select> -->
          </el-col>
          <el-col :md="24">
            <label>
              Description
              <el-tooltip content="More information about the data item(s), if any">
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
            </label>

            <el-input
              type="textarea"
              id="description"
              v-model="form.description"
              placeholder="Enter Description"
            />
          </el-col>
          <el-col :md="12">
            <label>
              Is the personal data sensitive?
              <el-tooltip
                raw-content
                content="Does the personal data fall into one or more of the special categories defined by the GDPR, namely <br />  racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, genetic data, biometric data,<br /> data concerning health or data concerning a natural person's sex life or sexual orientation"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select
                id="sensitive_personal_data"
                v-model="form.sensitive_personal_data"
                @change="form.exception_used_personal_data = 'N/A'"
              >
                <el-option v-for="option in yes_no" :key="option" :value="option" :label="option" />
              </el-select>
            </label>
          </el-col>
          <el-col v-if="form.sensitive_personal_data === 'Yes'" :md="12">
            <label>
              Exception Used
              <el-tooltip
                content="For special category data, what is the Article 9 paragraph 2 exception used to allow processing?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select
                id="exception_used_personal_data"
                v-model="form.exception_used_personal_data"
              >
                <el-option
                  v-for="option in exceptions"
                  :key="option"
                  :value="option"
                  :label="option"
                />
              </el-select>
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Was the data obtained from the data subject directly?
              <el-tooltip
                content="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select id="obtained_from_data_source" v-model="form.obtained_from_data_source">
                <el-option v-for="option in yes_no" :key="option" :value="option" :label="option" />
              </el-select>
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Owner
              <el-tooltip content="The role that is responsible for the personal data">
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input id="owner" v-model="form.owner" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Processing Purpose
              <el-tooltip
                content="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input type="textarea" id="processing_purpose" v-model="form.processing_purpose" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Lawful basis of processing
              <el-tooltip
                content="The rationale for why the processing is lawful under Article 6 of the GDPR. Options include consent, contractual and legal."
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select
                id="lawful_basis_of_processing"
                v-model="form.lawful_basis_of_processing"
                @change="
                  form.lawful_basis_of_processing !== 'Consent-based'
                    ? (form.how_is_consent_obtained = 'N/A')
                    : (form.how_is_consent_obtained = '')
                "
              >
                <el-option
                  v-for="option in lawful_bases"
                  :key="option"
                  :value="option"
                  :label="option"
                />
              </el-select>
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              How is the consent obtained?
              <el-tooltip
                content="If the lawful basis of the processing is consent, how does the data subject signify consent and how would this be evidenced?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input
                id="how_is_consent_obtained"
                v-model="form.how_is_consent_obtained"
                placeholder="Kindly specify how consent is obtained"
                :disabled="form.lawful_basis_of_processing !== 'Consent-based'"
              />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Automated decision making?
              <el-tooltip
                content="Does the business process involve a decision based solely on automated processing which may significantly affect the data subject?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select id="automated_decision_making" v-model="form.automated_decision_making">
                <el-option v-for="option in yes_no" :key="option" :value="option" :label="option" />
              </el-select>
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Level of data access
              <el-tooltip
                content="What access does the data subject have to their personal data to exercise their rights e.g review it for accuracy and change it?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input
                id="level_of_data_subject_access"
                v-model="form.level_of_data_subject_access"
              />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Location Stored
              <el-tooltip
                content="The physical place the data reside in e.g. a server or a filing cabinet"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input id="location_stored" v-model="form.location_stored" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Country Stored In
              <el-tooltip
                content="The country the data are stored in e.g. the physical location of the servers that hold the data"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-select
                id="country_stored_in"
                v-model="form.country_stored_in"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="option in countries"
                  :key="option"
                  :value="option"
                  :label="option"
                />
              </el-select>
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Retention Period
              <el-tooltip
                content="How long is the data kept for before being deleted or amended so that it no longer represents personal data?"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input id="retention_period" v-model="form.retention_period" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Encryption Level
              <el-tooltip content="What is the level of encryption on the data?">
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input id="encryption_level" v-model="form.encryption_level" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Access Control
              <el-tooltip content="What are the appropriate access controls applied to the data?">
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input id="access_control" v-model="form.access_control" />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Third parties shared with
              <el-tooltip
                raw-content
                content="Names of third parties with whom the data are shared i.e. <br /> those that will also hold and process the data on their own account (not simply hosting a storage location that you control)"
              >
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input
                type="textarea"
                id="third_parties_shared_with"
                v-model="form.third_parties_shared_with"
              />
            </label>
          </el-col>
          <el-col :md="12">
            <label>
              Comments
              <el-tooltip content="Any other relevant information">
                <span style="cursor: pointer">
                  <icon icon="tabler:info-circle" color="green" size="15" />
                </span>
              </el-tooltip>
              <el-input type="textarea" id="comments" v-model="form.comments" />
            </label>
          </el-col>
        </el-row>
        <el-button type="success" @click="submit()"> Submit </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    clientId: {
      type: Number,
      required: true
    },
    countries: {
      type: Array,
      required: true
    },
    personalDataItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      yes_no: ['Yes', 'No'],
      lawful_bases: [
        'Consent-based',
        'Contractual',
        'Legal Obligation',
        'Vital Interests',
        'Public Interests',
        'Legitimate Interests'
      ],
      exceptions: [
        'Explicit Consent',
        'Legal Obligation',
        'Public Data',
        'Legal Claims',
        'Public Interest',
        'Health Purposes',
        'Public Health',
        'Archiving and Research'
      ],
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        personal_data_item: '',
        description: '',
        sensitive_personal_data: '',
        exception_used_personal_data: '',
        obtained_from_data_source: '',
        owner: '',
        processing_purpose: '',
        lawful_basis_of_processing: '',
        how_is_consent_obtained: '',
        automated_decision_making: '',
        level_of_data_subject_access: '',
        location_stored: '',
        country_stored_in: '',
        retention_period: '',
        encryption_level: '',
        access_control: '',
        third_parties_shared_with: '',
        comments: ''
      },
      business_units: [],
      business_processes: [],
      selectedBusinessProcess: '',
      loading: false,
      selectedClient: {},
      uploadableFile: null
    }
  },
  created() {
    this.form.client_id = this.clientId
    this.fetchBusinessUnits()
  },
  methods: {
    setProcessOwner() {
      this.form.business_process_id = this.selectedBusinessProcess.id
      this.form.owner = this.selectedBusinessProcess.process_owner
    },
    fetchBusinessUnits() {
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
    fetchBusinessProcesses() {
      this.business_processes = []
      this.business_process_id = ''
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource
        .list({ business_unit_id: this.form.business_unit_id })
        .then((response) => {
          this.business_processes = response.business_processes
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    isEmpty() {
      return (
        this.form.personal_data_item === '' ||
        this.form.description === '' ||
        this.form.sensitive_personal_data === '' ||
        this.form.exception_used_personal_data === '' ||
        this.form.obtained_from_data_source === '' ||
        this.form.owner === '' ||
        this.form.processing_purpose === '' ||
        this.form.lawful_basis_of_processing === '' ||
        this.form.how_is_consent_obtained === '' ||
        this.form.automated_decision_making === '' ||
        this.form.level_of_data_subject_access === '' ||
        this.form.location_stored === '' ||
        this.form.country_stored_in === '' ||
        this.form.retention_period === '' ||
        this.form.encryption_level === '' ||
        this.form.access_control === '' ||
        this.form.third_parties_shared_with === '' ||
        this.form.comments === ''
      )
    },
    submit() {
      if (this.isEmpty()) {
        this.$alert('No field should be left blank')
        return
      }

      const form = this.form
      // form.personal_data_item = this.form.personal_data_item.split(',')
      this.loading = true
      const saveRisksResource = new Resource('ndpa/pda/store')
      saveRisksResource
        .store(form)
        .then(() => {
          this.loading = false
          this.$emit('submit')
          this.form = {
            personal_data_item: '',
            description: '',
            sensitive_personal_data: '',
            exception_used_personal_data: '',
            obtained_from_data_source: '',
            owner: '',
            processing_purpose: '',
            lawful_basis_of_processing: '',
            how_is_consent_obtained: '',
            automated_decision_making: '',
            level_of_data_subject_access: '',
            location_stored: '',
            country_stored_in: '',
            retention_period: '',
            encryption_level: '',
            access_control: '',
            third_parties_shared_with: '',
            comments: ''
          }
          this.$notify({
            content: 'Submitted Successfully'
          })
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
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
