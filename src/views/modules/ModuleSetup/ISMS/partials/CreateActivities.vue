<template>
  <el-row :gutter="20">
    <el-col :md="24">
      <label label-for="roles" rules="required">Select Control</label>
      <el-select v-model="form.clause_id" filterable style="width: 100%">
        <el-option
          v-for="(clause, index) in clauses"
          :key="index"
          :value="clause.id"
          :label="`${clause.name} - ${clause.description}`"
        />
      </el-select>
    </el-col>
    <el-col :md="24">
      <div style="max-height: 450px; overflow: auto">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Control No.</th>
              <th>Name/Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in details" :key="index">
              <td>
                <span>
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
                </span>
              </td>
              <td>
                <el-input v-model="detail.activity_no" type="text" placeholder="e.g. 4.1-a" />
              </td>
              <td>
                <el-input
                  v-model="detail.name"
                  type="text"
                  placeholder="e.g. Identify external factors"
                />
              </td>
              <td>
                <el-input
                  v-model="detail.description"
                  type="textarea"
                  placeholder="e.g. List all regulatory, legal, market, and technological factors affecting ISMS."
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
      <el-button :loading="loader" type="success" @click="formSubmitted"> Submit </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    clauses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,

      form: {
        clause_id: '',
        details: []
      },
      empty_form: {
        clause_id: '',
        details: []
      },
      loader: false,
      details: [],
      fill_fields_error: false
    }
  },
  created() {
    // this.fetchFormDetails()
    this.addLine()
  },
  methods: {
    addLine() {
      this.fill_fields_error = false

      const checkEmptyLines = this.details.filter(
        (detail) => detail.name === '' || detail.activity_no === ''
      )

      if (checkEmptyLines.length >= 1 && this.details.length > 0) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          activity_no: '',
          name: '',
          description: ''
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
      const createActivityResource = new Resource('isms/calendar/store-clause-activities')
      const { form } = this
      form.details = this.details
      this.loader = true
      createActivityResource
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
