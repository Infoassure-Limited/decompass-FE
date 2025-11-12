<template>
  <div style="background: #eef1f6; border-radius: 5px">
    <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
      <h3 v-if="isAdmin" class="mel-0"> Give your remarks </h3>
      <h3 v-else class="mel-0"> Asessment Analysis </h3>
      <!-- <div>
          <el-button
            variant="gradient-danger"
            class="btn-icon"
            @click="hide"
          >
            <feather-icon
              icon="XIcon"
            />
          </el-button>
        </div> -->
    </div>
    <div v-if="isAdmin" class="justify-content-between align-items-center px-2 py-1">
      <el-row v-loading="loading">
        <el-col :md="12">
          <label>Assessment Grade</label>
          <el-form-group label-for="v-consultant_grade">
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
          </el-form-group>
        </el-col>
        <el-col :md="12">
          <label>Findings</label>
          <el-form-group label-for="v-findings">
            <el-input
              v-model="form.findings"
              type="textarea"
              placeholder="State your findings..."
              style="width: 100%"
              @blur="saveRemark('findings')"
            />
          </el-form-group>
        </el-col>
        <el-col :md="12">
          <label>Recommendations</label>
          <el-form-group label-for="v-recommendations">
            <el-input
              v-model="form.recommendations"
              type="textarea"
              placeholder="State your recommendations..."
              style="width: 100%"
              @blur="saveRemark('recommendations')"
            />
          </el-form-group>
        </el-col>
        <el-col :md="12">
          <label>Assessment Status</label>
          <el-form-group label-for="v-status">
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
          </el-form-group>
        </el-col>
        <el-col :md="12">
          <label>General Remark</label>
          <el-form-group label-for="v-remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="Type your remark here..."
              style="width: 100%"
              @blur="saveRemark('remark')"
            />
          </el-form-group>
        </el-col>
        <!-- submit and reset -->
        <el-col :md="12">
          <el-button type="primary" @click="$emit('reload')"> Submit </el-button>
        </el-col>
      </el-row>
    </div>
    <div v-else class="justify-content-between align-items-center px-2 py-1">
      <el-row v-loading="loading">
        <el-col :md="12">
          <label>Assessment Grade</label>
          <p
            ><el-alert :closable="false" type="error">
              {{ form.consultant_grade ? form.consultant_grade : 'No grade given yet' }}
            </el-alert></p
          >
        </el-col>
        <el-col :md="12">
          <label>Findings</label>
          <p
            ><el-alert :closable="false">
              {{ form.findings ? form.findings : 'No findings made for now' }}
            </el-alert></p
          >
        </el-col>
        <el-col :md="12">
          <label>Recommendations</label>
          <p
            ><el-alert :closable="false" type="warning">
              {{ form.recommendations ? form.recommendations : 'Nothing to recommend' }}
            </el-alert></p
          >
        </el-col>
        <el-col :md="12">
          <label>Assessment Status</label>
          <p
            ><el-alert :closable="false" type="success">
              {{ form.status ? form.status : 'Open' }}
            </el-alert></p
          >
        </el-col>
        <el-col v-if="form.remark !== ''" :md="12">
          <label>General Remark</label>
          <p
            ><el-alert :closable="false">
              {{ form.remark !== '' ? form.remark : 'Nothing to remark on ' }}
            </el-alert></p
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
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
