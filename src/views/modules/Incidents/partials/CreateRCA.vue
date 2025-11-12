<template>
  <div>
    <el-row v-if="loading" :gutter="10">
      <el-col :md="12" v-for="count in 6" :key="count">
        <el-skeleton :rows="1" animated />
      </el-col>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :md="12">
        <v-textarea
          v-model="form.description"
          :readonly="loader"
          class="mb-2"
          :rows="2"
          label="Root Cause Description"
          placeholder="Explain the root cause of the incident"
          variant="outlined"
        />
      </el-col>
      <el-col :md="12">
        <v-textarea
          v-model="form.impact_of_the_incident"
          :readonly="loader"
          class="mb-2"
          :rows="2"
          label="Impact of the Incident"
          placeholder="Describe the impact caused by the incident."
          variant="outlined"
        />
      </el-col>
      <el-col :md="12">
        <v-textarea
          v-model="form.preventive_measures"
          :readonly="loader"
          class="mb-2"
          :rows="2"
          label="Preventive Measures"
          placeholder="Describe actions to prevent similar incidents in the future"
          variant="outlined"
        />
      </el-col>
      <el-col :md="12">
        <label for="">Method of Analysis used</label>
        <el-select v-model="form.method" placeholder="Select Method" filterable style="width: 100%">
          <el-option
            v-for="(method, index) in analysis_methods"
            :key="index"
            :label="method"
            :value="method"
          />
        </el-select>
      </el-col>
      <el-col :md="24">
        <label for="">Indicate if additional follow-up actions are required</label>
        <el-radio-group v-model="form.follow_up_required" style="width: 100%">
          <el-radio value="No">No</el-radio>
          <el-radio value="Yes">Yes</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :md="24">
        <div class="pull-right">
          <v-btn
            :disabled="loader"
            :loading="loader"
            color="green"
            size="x-large"
            variant="flat"
            block
            @click="validationFormInfo"
          >
            Submit
          </v-btn>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@validations'
import Resource from '@/api/resource'

const shortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    }
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    }
  }
]
export default {
  props: {
    incidentId: {
      type: Number,
      required: true
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      shortcuts,
      incident_categories: [],
      analysis_methods: ['5-whys', 'Fishbone', 'Pareto'],
      form: {
        description: null,
        impact_of_the_incident: null,
        preventive_measures: '',
        follow_up_required: 'No',
        method: null
      },
      empty_form: {
        description: null,
        impact_of_the_incident: null,
        preventive_measures: '',
        follow_up_required: 'No',
        method: null
      },
      loader: false,
      loading: false,
      uploadedFile: null
    }
  },
  validations() {
    return {
      form: {
        description: { required }
      }
    }
  },
  methods: {
    formSubmitted() {
      const createResource = new Resource('isms/incidents/store-rca')
      const { form } = this
      form.incident_id = this.incidentId
      this.loader = true
      createResource
        .store(form)
        .then((response) => {
          this.loader = false
          this.$emit('saved')
          this.$message(`Action Successful`)
          this.form = this.empty_form
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })

          this.loader = false
        })
    },
    async validationFormInfo() {
      const success = await this.v$.$validate()
      if (success) {
        this.formSubmitted()
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
