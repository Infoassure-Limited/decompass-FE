<template>
  <div style="max-height: 400px; overflow: auto; padding: 20px">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(detail, index) in measures"
        :key="index"
        :title="`${index + 1} - ${detail.name}`"
        :name="index"
      >
        <template #title>
          <strong
            >{{ index + 1 }} -
            {{ detail.title !== '' ? detail.title : 'Define New Measure' }}</strong
          >
        </template>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :md="24">
            <v-text-field
              v-model="detail.title"
              density="compact"
              variant="outlined"
              type="text"
              label="Measure Title"
              placeholder="Percentage of policy reviewed"
            />
          </el-col>
          <el-col :md="24">
            <v-textarea
              v-model="detail.measurement_need"
              density="compact"
              variant="outlined"
              rows="3"
              label="Measurement Need"
              placeholder="To evaluate whether the policies for information security are reviewed at planned intervals or if significant changes occur"
            />
          </el-col>
        </el-row>
        <el-button-group>
          <el-button v-if="measures.length > 1" type="danger" @click="removeLine(index)">
            <icon icon="tabler:trash" />
          </el-button>
          <el-button
            v-if="index + 1 === measures.length"
            type="success"
            @click="(addLine(index), (activeName = parseInt(index + 1)))"
          >
            <icon icon="tabler:plus" /> Add More
          </el-button>
        </el-button-group>
      </el-collapse-item>
    </el-collapse>
    <div v-if="fill_fields_error">
      <label class="alert alert-danger"
        >Please fill all empty fields before adding another row</label
      >
    </div>
  </div>
  <el-button
    class="pull-right"
    :loading="loader"
    :disabled="rowIsEmpty()"
    type="primary"
    @click="formSubmitted"
  >
    Submit All
  </el-button>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    infoNeedId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    const maxDate = new Date()
    return {
      activeName: 0,
      max: maxDate,

      form: {
        info_need_id: '',
        measures: []
      },
      empty_form: {
        info_need_id: '',
        measures: []
      },
      loader: false,
      measures: [],
      fill_fields_error: false,
      loadTasks: false,
      other_tasks: [],
      templates: []
    }
  },
  created() {
    this.addLine()
  },
  methods: {
    rowIsEmpty() {
      return this.measures.some((detail) => detail.name === '' || detail.activity_no === '')
    },
    addLine() {
      this.fill_fields_error = false

      if (this.rowIsEmpty() && this.measures.length > 0) {
        this.fill_fields_error = true
      } else {
        this.measures.push({
          title: '',
          measurement_need: '',
          metadata: []
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.measures.splice(detailId, 1)
      }
    },
    formSubmitted() {
      const createTaskResource = new Resource('pam/measures/store')
      const { form } = this
      form.info_need_id = this.infoNeedId
      form.measures = this.measures
      this.loader = true
      createTaskResource
        .store(form)
        .then(() => {
          this.form = this.empty_form
          this.measures = []
          this.addLine()
          this.loader = false

          this.$message('Action Successful')
          // this.$router.push({ path: 'login' })
          this.$emit('saved')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    }
  }
}
</script>
