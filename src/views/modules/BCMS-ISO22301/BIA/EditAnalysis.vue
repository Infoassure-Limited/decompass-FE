<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="14">
        <v-stepper
          model-value="0"
          non-linear
          editable
          hide-actions
          :items="['Impact Assessment by Duration', 'Criticality Assessment']"
        >
          <template v-slot:item.1>
            <el-collapse accordion type="margin">
              <el-collapse-item
                v-for="(distruption_impact, index) in selectedData.impacts"
                :key="index"
                :title="distruption_impact.criteria"
                :is-visible="true"
              >
                <template #title>
                  <h3>{{ distruption_impact.criteria }}</h3>
                </template>
                <el-row :gutter="20">
                  <el-col
                    v-for="(
                      impact_data, impact_index
                    ) in distruption_impact.process_disruption_impact"
                    :key="impact_index"
                    :md="24"
                  >
                    <label for="">
                      {{ `${impact_data.name} (${impact_data.time_in_minutes} mins)` }}
                    </label>
                    <el-select
                      v-model="impact_data.value"
                      placeholder="Select Impact Value"
                      @change="updateImpact(distruption_impact.id, impact_data.id, $event)"
                    >
                      <el-option
                        v-for="(impact, c_index) in impacts"
                        :key="c_index + impact_index"
                        :label="`${impact.value}-${impact.name}`"
                        :value="`${impact.value}`"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </template>
          <template v-slot:item.2>
            <el-row :gutter="20">
              <el-col :md="24">
                <label for="">Maximum Allowable Downtime (MAD)</label>
                <el-input
                  v-model="form.maximum_allowable_outage"
                  placeholder="ENTER Maximum Allowable Downtime"
                  @change="updateBIA(selectedData.id, 'maximum_allowable_outage', $event)"
                >
                  <template #append> Hour(s) </template>
                </el-input>
              </el-col>
              <el-col :md="24">
                <label for="">Recovery Time Objective (RTO)</label>
                <el-input
                  v-model="form.recovery_time_objective"
                  placeholder="ENTER Recovery Time Objective"
                  @change="updateBIA(selectedData.id, 'recovery_time_objective', $event)"
                >
                  <template #append> Hour(s) </template>
                </el-input>
              </el-col>
              <el-col :md="24">
                <label for="">Recovery Point Objective (RPO)</label>
                <el-input
                  v-model="form.recovery_point_objective"
                  placeholder="ENTER Recovery Point Objective"
                  @change="updateBIA(selectedData.id, 'recovery_point_objective', $event)"
                >
                  <template #append> Hour(s) </template>
                </el-input>
              </el-col>
            </el-row>
          </template>
        </v-stepper>
        <br />
        <el-button type="success" @click="formSubmitted()"> Submit </el-button>
      </el-col>
      <el-col :md="10">
        <div v-if="selectedData !== null">
          <h3>PRIORITY</h3>
          <div
            :style="`background: #${form.priority_color}; color: #000000; text-align: center; padding: 10px; border: 2px solid #000000; border-radius: 5px;`"
          >
            <h3>{{ form.priority }}</h3>
          </div>
          <hr />
          <div
            style="
              background: #f7f0da;
              padding: 10px;
              border: 2px solid #d2a204;
              border-radius: 5px;
            "
          >
            <p>
              <strong>Business Unit:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.business_unit"></span>
            </p>
            <p>
              <strong>Business Process:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.business_process"></span>
            </p>
            <p>
              <strong>Business Process Description:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.description"></span>
            </p>
            <p v-if="selectedData.product_or_service_delivered !== null">
              <strong>Product/Service Delivered</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.product_or_service_delivered"></span>
            </p>
            <p v-if="selectedData.no_of_people_involved !== null">
              <strong>No. of people involved</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.no_of_people_involved"></span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedData: {
      type: Object,
      required: true
    },
    impacts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        impacts: []
      },
      loading: false,
      selectedClient: {},
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false
    }
  },
  watch: {
    selectedData() {
      this.form = this.selectedData
    }
  },
  created() {
    this.form = this.selectedData
  },
  methods: {
    updateField(value, field, id) {
      const params = {
        field,
        value
      }

      // assessment.loader = true
      const updateResources = new Resource('bcms/bia/update-fields')
      updateResources
        .update(id, params)
        .then((response) => {
          this.form = response
        })
        .catch(() => {
          this.form.loader = false
        })
    },
    formSubmitted() {
      this.$emit('updated')
    },
    async updateImpact(parentId, id, value) {
      const updateImpactResource = new Resource('bcms/bia/update-disruption-impact')
      const response = await updateImpactResource.update(parentId, { id, value })
      this.form = response.business_impact_analysis
    },
    async updateBIA(id, field, value) {
      const updateBIAResource = new Resource('bcms/bia/update-bia')
      await updateBIAResource.update(id, { value, field })
    }
  }
}
</script>
