<template>
  <el-row :gutter="20">
    <el-col :md="24">
      <div style="max-height: 450px; overflow: auto">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Threat</th>
              <th>
                Vulnerabilities<br />
                <small
                  ><em
                    >Type in all applicable vulnerabilities separated by a COMMA <code>,</code></em
                  ></small
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in details" :key="index">
              <td>
                <el-button-group>
                  <el-button
                    v-if="details.length > 1"
                    type="danger"
                    circle
                    size="mini"
                    @click="removeLine(index)"
                  >
                    <icon icon="tabler:trash" />
                  </el-button>
                  <el-button
                    v-if="index + 1 === details.length"
                    type="success"
                    circle
                    size="mini"
                    @click="addLine(index)"
                  >
                    <icon icon="tabler:plus" />
                  </el-button>
                </el-button-group>
              </td>
              <td>
                <el-input
                  v-model="detail.threat"
                  type="text"
                  placeholder="example: Phishing Attack"
                />
              </td>
              <td>
                <small>Do not forget to separate muliple entries by a COMMA</small>
                <el-input
                  v-model="detail.vulnerabilities"
                  type="textarea"
                  :rows="3"
                  placeholder="example: Lack of user awareness, weak passwords"
                />
              </td>
            </tr>
            <tr v-if="fill_fields_error">
              <td colspan="4">
                <label class="alert alert-danger"
                  >Please fill all empty fields before adding another row</label
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-col>
    <el-col :md="24">
      <el-button :loading="loader" :disabled="rowIsEmpty()" type="success" @click="formSubmitted">
        Submit
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    assetType: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,

      form: {
        clause_id: '',
        module_activity_id: '',
        details: []
      },
      empty_form: {
        clause_id: '',
        module_activity_id: '',
        details: []
      },
      loader: false,
      details: [],
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
      return this.details.some((detail) => detail.threat === '')
    },
    addLine() {
      this.fill_fields_error = false

      if (this.rowIsEmpty() && this.details.length > 0) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          threat: '',
          vulnerabilities: []
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.details.splice(detailId, 1)
      }
    },
    formSubmitted() {
      const createTaskResource = new Resource('risk-library/store')
      const { form } = this
      form.data = this.details
      form.asset_type = this.assetType.name
      this.loader = true
      createTaskResource
        .store(form)
        .then(() => {
          this.form = this.empty_form
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
