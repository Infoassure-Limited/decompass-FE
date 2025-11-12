<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 v-if="isAdmin" class="mb-0"> Fill the fields as applicable </h5>
          <h5 v-else class="mb-0"> Consultant's Remarks </h5>
          <div>
            <b-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </b-button>
          </div>
        </div>
        <div v-if="isAdmin" class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">
            <b-col cols="12">
              <label>Observations</label>
              <b-form-group label-for="v-findings">
                <el-input
                  v-model="form.observation"
                  type="textarea"
                  placeholder="State your findings..."
                  style="width: 100%"
                  @blur="saveRemark('observation')"
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
              <label>Risk Score</label>
              <b-form-group label-for="v-risk_score">
                <el-select
                  v-model="form.risk_score"
                  placeholder="Select Risk Score"
                  style="width: 100%"
                  @input="saveRemark('risk_score')"
                >
                  <el-option
                    v-for="(score, index) in risk_scores"
                    :key="index"
                    :value="score.value"
                    :label="score.label"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <label>Impact</label>
              <b-form-group label-for="v-impact">
                <el-input
                  v-model="form.impact"
                  placeholder="State Impact"
                  style="width: 100%"
                  @blur="saveRemark('impact')"
                />
                <!-- <el-select
                  v-model="form.impact"
                  placeholder="Select Status"
                  style="width: 100%;"
                  @blur="saveRemark('impact')"
                >
                  <el-option
                    v-for="(status, index) in statuses"
                    :key="index"
                    :value="status"
                    :label="status"
                  />
                </el-select> -->
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button type="submit" variant="primary" class="mr-1" @click="$emit('reload')">
                Submit
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div v-else class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">
            <b-col cols="12">
              <label>Observation</label>
              <p>{{ form.observation }}</p>
            </b-col>
            <!-- <b-col cols="12">
              <label>Recommendations</label>
              <p>{{ form.recommendations }}</p>
            </b-col>
            <b-col cols="12">
              <label>Risk Score</label>
              <p>{{ form.risk_score }}</p>
            </b-col>
            <b-col cols="12">
              <label>Impact</label>
              <p>{{ form.impact }}</p>
            </b-col> -->
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
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
      default: () => false
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
      risk_scores: [
        { value: 1, label: '1-Low' },
        { value: 2, label: '2-Medium' },
        { value: 3, label: '3-High' }
      ],
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
      const fetchConsultingsResource = new Resource('due-diligence/answers/update')
      fetchConsultingsResource.update(form.id, param).then(() => {})
    }
  }
}
</script>
