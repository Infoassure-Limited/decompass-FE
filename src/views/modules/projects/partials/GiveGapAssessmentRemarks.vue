<template>
  <div>
    <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
      <h3 v-if="isAdmin" class="mb-0"> Give your remarks </h3>
      <!-- <div>
          <b-button
            variant="gradient-danger"
            class="btn-icon"
            @click="hide"
          >
            <feather-icon
              icon="XIcon"
            />
          </b-button>
        </div> -->
    </div>
    <div v-if="isAdmin" class="justify-content-between align-items-center px-2 py-1">
      <b-row v-loading="loading">
        <b-col cols="12">
          <label>Assessment Grade</label>
          <b-form-group label-for="v-consultant_grade">
            <el-select
              v-model="form.consultant_grade"
              placeholder="Select Grade"
              style="width: 100%"
              @input="saveRemark('consultant_grade')"
            >
              <el-option
                v-for="(grade, index) in grades"
                :key="index"
                :value="grade"
                :label="grade"
              />
            </el-select>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <label>Findings</label>
          <b-form-group label-for="v-findings">
            <el-input
              v-model="form.findings"
              type="textarea"
              placeholder="State your findings..."
              style="width: 100%"
              @blur="saveRemark('findings')"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <label>Recommendations</label>
          <b-form-group label-for="v-recommendations">
            <el-input
              v-model="form.recommendations"
              type="textarea"
              placeholder="State your recommendations..."
              style="width: 100%"
              @blur="saveRemark('recommendations')"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <label>Assessment Status</label>
          <b-form-group label-for="v-status">
            <el-select
              v-model="form.status"
              placeholder="Select Status"
              style="width: 100%"
              @input="saveRemark('status')"
            >
              <el-option
                v-for="(status, index) in statuses"
                :key="index"
                :value="status"
                :label="status"
              />
            </el-select>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <label>General Remark</label>
          <b-form-group label-for="v-remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="Type your remark here..."
              style="width: 100%"
              @blur="saveRemark('remark')"
            />
          </b-form-group>
        </b-col>
        <!-- submit and reset -->
        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="$emit('reload')"
          >
            Submit
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div v-else class="justify-content-between align-items-center px-2 py-1">
      <b-row v-loading="loading">
        <b-col cols="12">
          <label>Assessment Grade</label>
          <p
            ><el-alert :closable="false" type="error">
              {{ form.consultant_grade ? form.consultant_grade : 'No grade given yet' }}
            </el-alert></p
          >
        </b-col>
        <b-col cols="12">
          <label>Findings</label>
          <p
            ><el-alert :closable="false">
              {{ form.findings ? form.findings : 'No findings made for now' }}
            </el-alert></p
          >
        </b-col>
        <b-col cols="12">
          <label>Recommendations</label>
          <p
            ><el-alert :closable="false" type="warning">
              {{ form.recommendations ? form.recommendations : 'Nothing to recommend' }}
            </el-alert></p
          >
        </b-col>
        <b-col cols="12">
          <label>Assessment Status</label>
          <p
            ><el-alert :closable="false" type="success">
              {{ form.status ? form.status : 'Open' }}
            </el-alert></p
          >
        </b-col>
        <b-col v-if="form.remark" cols="12">
          <label>General Remark</label>
          <p
            ><el-alert :closable="false">
              {{ form.remark ? form.remark : 'Nothing to remark on ' }}
            </el-alert></p
          >
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active'
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true
    },
    answer: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      form: {
        id: '',
        consultant_grade: '',
        findings: '',
        recommendations: '',
        status: '',
        remark: ''
      },
      loading: false,
      grades: ['Conformity', 'Non-Conformity', 'Opportunity For Improvement', 'Not Applicable'],
      statuses: ['Open', 'Work In Progress', 'Closed'],
      selectedConsulting: {}
    }
  },
  created() {
    this.form = this.answer
  },
  methods: {
    saveRemark(field) {
      const { form } = this
      // console.log(answer[field])
      const param = { answer: form[field], field }
      const fetchConsultingsResource = new Resource('answers/update')
      fetchConsultingsResource.update(form.id, param).then(() => {})
    }
  }
}
</script>
