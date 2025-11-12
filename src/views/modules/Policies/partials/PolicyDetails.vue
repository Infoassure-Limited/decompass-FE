<template>
  <div v-loading="loading">
    <el-row v-if="policy_details !== null" :gutter="10">
      <el-col :md="24">
        <el-button-group>
          <el-tooltip content="Submit for Review">
            <el-button
              :disabled="policy_details.status !== 'draft'"
              type="info"
              round
              @click="policyActions(policy_details.id, 'submit-for-review')"
            >
              <icon icon="tabler:file-search" size="25" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Approve">
            <el-button
              :disabled="policy_details.status !== 'review'"
              type="primary"
              round
              @click="policyActions(policy_details.id, 'approve')"
            >
              <icon icon="tabler:file-like" size="25" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Publish">
            <el-button
              :disabled="policy_details.status !== 'approved'"
              type="success"
              round
              @click="policyActions(policy_details.id, 'publish')"
            >
              <icon icon="tabler:news" size="25" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Archive">
            <el-button
              :disabled="policy_details.status !== 'published'"
              type="danger"
              round
              @click="policyActions(policy_details.id, 'archive')"
            >
              <icon icon="tabler:file-stack" size="25" />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <div class="pull-right">
          <el-alert effect="dark" type="info">
            <strong>STATUS: {{ policy_details.status.toUpperCase() }}</strong>
          </el-alert>
        </div>
      </el-col>
      <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div>
          <label for="">Review Interval</label>
          <el-select
            v-model="policy_details.review_interval"
            style="width: 100%"
            :disabled="policy_details.due_for_review === 0"
            @change="updateFields(policy_details, 'review_interval', $event)"
          >
            <el-option
              v-for="(interval, int_index) in review_intervals"
              :key="int_index"
              :value="interval"
              :label="interval"
            />
          </el-select>
        </div>
      </el-col>
      <!-- <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div>
          <label for="">Next Review date</label>
          <el-date-picker
            v-model="policy_details.review_date"
            type="date"
            placeholder="Set Review Date"
            size="large"
            style="width: 100%"
            @change="updateFields(policy_details, 'review_date', $event)"
            :disabled="policy_details.status !== 'review'"
          />
        </div>
      </el-col> -->
      <!-- <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div v-if="policy_details.status === 'review'">
          <label for="">Review Interval</label>
          <el-select
            v-model="policy_details.review_interval"
            style="width: 100%"
            @change="updateFields(policy_details, 'review_interval', $event)"
          >
            <el-option
              v-for="(interval, int_index) in review_intervals"
              :key="int_index"
              :value="interval"
              :label="interval"
            />
          </el-select>
        </div>
        <el-tag v-else type="info">
          <strong> {{ policy_details.review_interval }}</strong>
        </el-tag>
      </el-col>
      <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div v-if="policy_details.status === 'review'">
          <label for="">Effective Date</label>
          <el-date-picker
            v-model="policy_details.effective_date"
            type="date"
            placeholder="Set Effective Date"
            size="large"
            style="width: 100%"
            @change="updateFields(policy_details, 'effective_date', $event)"
          />
        </div>
        <el-tag v-else type="info">
          <strong> {{ moment(policy_details.effective_date).format('ll') }}</strong>
        </el-tag>
      </el-col>
      <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div v-if="policy_details.status === 'review'">
          <label for="">Review date</label>
          <el-date-picker
            v-model="policy_details.review_date"
            type="date"
            placeholder="Set Review Date"
            size="large"
            style="width: 100%"
            @change="updateFields(policy_details, 'review_date', $event)"
          />
        </div>
        <el-tag v-else type="info">
          <strong> {{ moment(policy_details.review_date).format('ll') }}</strong>
        </el-tag>
      </el-col> -->
      <el-col v-if="policy_details.status !== 'draft'" :md="6">
        <div>
          <label for="">Expiry date</label>
          <el-date-picker
            v-model="policy_details.expiry_date"
            type="date"
            placeholder="Set Expiry Date"
            size="large"
            style="width: 100%"
            @change="updateFields(policy_details, 'expiry_date', $event)"
            :disabled="policy_details.due_for_review === 0"
          />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="policy_details !== null" :gutter="10">
      <el-col :md="16">
        <el-row :gutter="5">
          <el-col :md="24">
            <div>
              <v-text-field
                v-model="policy_details.title"
                class="mb-2"
                label="Title"
                placeholder="Information Security Policy"
                variant="outlined"
              />
            </div>
          </el-col>
          <el-col :md="24">
            <Editor
              v-model="policy_details.content"
              height="300px"
              label="Content of the policy..."
            />
          </el-col>
          <el-col :md="24">
            <p></p>
            <div>
              <v-textarea
                v-model="change_summary"
                class="mb-2"
                label="Change Summary"
                placeholder="Give a summary of the changes made"
                variant="outlined"
                :row="3"
              />
            </div>
          </el-col>
          <el-col :md="8">
            <v-btn
              :disabled="policy_details.due_for_review === 0 || updateLoader"
              :loading="updateLoader"
              color="black"
              size="x-large"
              variant="flat"
              block
              @click="updatePolicy"
            >
              Update
            </v-btn>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="8">
        <div v-if="policy_details !== null" style="background: #fcfcfc; padding: 10px">
          <h4>Dates</h4>
          <el-alert :closable="false" type="info" size="large">
            <strong>Created: {{ moment(policy_details.created_at).format('ll') }}</strong>
          </el-alert>
          <p></p>
          <el-alert :closable="false" type="info">
            <strong>
              Review Date:
              {{
                policy_details.approved_at
                  ? moment(policy_details.approved_at).format('ll')
                  : 'Not Set'
              }}</strong
            >
          </el-alert>
          <p></p>
          <el-alert :closable="false" type="warning">
            <strong>
              Next Review Date:
              {{
                policy_details.review_date
                  ? moment(policy_details.review_date).format('ll')
                  : 'Not Set'
              }}
            </strong>
          </el-alert>
          <p></p>
          <el-alert :closable="false" type="success">
            <strong>
              Published:
              {{
                policy_details.published_at
                  ? moment(policy_details.published_at).format('ll')
                  : 'Not Set'
              }}</strong
            >
          </el-alert>
          <p></p>
          <el-alert :closable="false" type="error">
            <strong
              >Expiry Date:
              {{
                policy_details.expiry_date
                  ? moment(policy_details.expiry_date).format('ll')
                  : 'Not Set'
              }}</strong
            >
          </el-alert>
        </div>
        <aside v-if="policy_details !== null">
          <h4>Versions</h4>
          <div style="max-height: 500px; overflow: auto">
            <el-skeleton v-if="loadVersions" :rows="2" animated />
            <el-card v-esle v-for="(version, index) in versions" :key="index">
              <div style="cursor: pointer" @click="viewVersion(version)">
                <small class="pull-right">by {{ version.creator.name }}</small>
                <strong>Version {{ version.version_number }}</strong>
              </div>
            </el-card>
          </div>
        </aside>
      </el-col>
    </el-row>
    <el-dialog v-model="showVersion" width="95%" destroy-on-close hide-footer>
      <template v-slot:header>
        <strong>Content of Version {{ selectedVersion.version_number }}</strong>
        <el-button
          type="primary"
          class="pull-right"
          round
          @click="generatePdf(policy_details.title, selectedVersion.version_number)"
        >
          <icon icon="tabler:file-download" size="25" /> Download
        </el-button>
      </template>
      <el-row :gutter="20">
        <el-col :md="18">
          <div class="pdf-container">
            <div ref="pdfContent" style="height: 500px; overflow: auto">
              <div v-if="policy_details.status !== 'published'" class="watermark">
                {{ policy_details.status.toUpperCase() }}
              </div>
              <h3>{{ policy_details.title }}</h3>
              <div v-html="selectedVersion.content"></div>
            </div>
          </div>
        </el-col>
        <el-col :md="6"> Hello </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import Resource from '@/api/resource'
import { Editor } from '@/components/Editor'
export default {
  components: {
    Editor
  },
  props: {
    selectedData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      versions: [],
      selectedVersion: null,
      showVersion: false,
      loading: false,
      loadVersions: false,
      updateLoader: false,
      showEdit: false,
      policy_details: null,
      change_summary: '',
      review_intervals: ['Quarterly', 'Biannually', 'Annually']
    }
  },
  mounted() {
    this.fetchPolicyDetails()
    this.fetchPolicyVersions()
  },
  methods: {
    moment,
    fetchPolicyDetails() {
      const fetchEntryResource = new Resource('policy/policies/show')
      this.loading = true
      fetchEntryResource
        .get(this.selectedData.id)
        .then((response) => {
          this.policy_details = response.data
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchPolicyVersions() {
      const fetchEntryResource = new Resource('policy/policies/versions')
      this.loadVersions = true
      fetchEntryResource
        .get(this.selectedData.id)
        .then((response) => {
          this.versions = response.data
          this.loadVersions = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loadVersions = false
        })
    },
    updatePolicy() {
      const updateResource = new Resource('policy/policies/update')
      const form = this.policy_details
      form.change_summary = this.change_summary
      this.updateLoader = true
      updateResource
        .update(form.id, form)
        .then((response) => {
          this.updateLoader = false
          this.$message(`Action Successful`)
          this.change_summary = ''
          this.fetchPolicyVersions()
        })
        .catch((error) => {
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })

          this.updateLoader = false
        })
    },
    updateFields(policy_details, field, value) {
      const updateResource = new Resource('policy/policies/update-fields')
      const form = { field, value }
      updateResource
        .update(policy_details.id, form)
        .then((response) => {
          this.$message(`Action Successful`)
          this.change_summary = ''
          this.fetchPolicyVersions()
        })
        .catch((error) => {
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })
        })
    },
    viewVersion(version) {
      this.selectedVersion = version
      this.showVersion = true
    },
    generatePdf(title, version) {
      const element = this.$refs.pdfContent.innerHTML
      const opt = {
        margin: 10,
        filename: `${title}-v${version}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).save()
    },
    policyActions(policyId, action) {
      if (window.confirm(`Click OK to confirm ${action} action`)) {
        const actionResource = new Resource(`policy/policies/${action}`)
        const form = this.policy_details
        this.loading = true
        actionResource
          .update(policyId)
          .then((response) => {
            this.loading = false
            this.$message(`Action Successful`)
            this.fetchPolicyDetails()
          })
          .catch((error) => {
            this.$message({
              message: error.response.data.message,
              type: 'danger'
            })

            this.loading = false
          })
      }
    }
  }
}
</script>
<style scoped>
.pdf-container {
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 10em;
  color: rgba(0, 0, 0, 0.1);
  user-select: none;
  pointer-events: none;
}
</style>
