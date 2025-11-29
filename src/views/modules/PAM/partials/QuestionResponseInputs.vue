<template>
  <div v-if="data !== null">
    <div v-if="submitStatus === 0">
      <el-input
        v-if="data.input_type === 'text'"
        v-model="response"
        type="text"
        label="Give Response"
        variant="outlined"
        @change="(val) => $emit('string-response', val)"
      />
      <el-input
        v-if="data.input_type === 'text_area'"
        v-model="response"
        type="textarea"
        label="Give Response"
        variant="outlined"
        rows="3"
        @change="(val) => $emit('string-response', val)"
      />
      <el-select
        v-if="data.input_type === 'dropdown' && data.is_multiple_select === 0"
        v-model="response"
        placeholder="Select Response"
        @change="(val) => $emit('string-response', val)"
      >
        <el-option
          v-for="(option, index1) in data.select_options.split(', ')"
          :key="index1"
          :value="option"
          :label="option"
        />
      </el-select>
      <el-select
        v-if="data.input_type === 'dropdown' && data.is_multiple_select === 1"
        v-model="response_array"
        placeholder="Select Multiple Responses"
        multiple
        @change="(val) => $emit('array-response', val)"
      >
        <el-option
          v-for="(option, index1) in data.select_options.split(', ')"
          :key="index1"
          :value="option"
          :label="option"
        />
      </el-select>
    </div>
    <div v-if="submitStatus === 1">
      <br />
      <p v-if="analysis.response !== null"><strong>Response: </strong> {{ analysis.response }}</p>
      <p v-if="analysis.response_array !== null">
        <strong>Responses: </strong>
        <el-tag
          v-for="item in analysis.response_array"
          :key="item"
          type="primary"
          effect="light"
          round
        >
          {{ item }}
        </el-tag>
      </p>
      <p v-if="analysis.details !== null"><strong>Details:</strong> {{ analysis.details }}</p>
      <div
        :style="`background: ${analysis.status === 'Compliant' ? '#d5ffd1' : analysis.status === 'Opportunity for Improvement' ? '#fff6c6' : '#ffc6c6'}; padding: 10px; border-radius: 5px`"
      >
        <p>
          <strong>Status:</strong> {{ analysis.status }}<br />
          <strong>Justification:</strong> {{ analysis.justification }}<br />
          <strong>Recommendation:</strong> {{ analysis.recommendation }}<br />
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import QuestionResponseInputs from './QuestionResponseInputs.vue'

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    modelValue: {
      type: String,
      default: null
    },
    submitStatus: {
      type: Number,
      default: 0
    },
    analysis: {
      type: Object,
      default: null
    }
  },
  emits: ['string-response', 'array-response'],
  data() {
    return {
      response: null,
      response_array: null,
      style: ''
    }
  },
  mounted() {
    this.response = this.analysis.response
    this.response_array = this.analysis.response_array
  },
  methods: {}
}
</script>
