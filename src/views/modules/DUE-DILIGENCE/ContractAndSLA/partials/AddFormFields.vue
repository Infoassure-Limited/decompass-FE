<template>
  <div>
    <el-row :gutter="2" class="padded">
      <el-col>
        <div style="overflow: auto">
          <h3>Add Form Fields</h3>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th></th>
                <th>Label</th>
                <th>Input Type</th>
                <!-- <th>Placeholder</th> -->
                <th>Is Required</th>
                <!-- <th>Min Count</th>
                <th>Max Count</th> -->
                <th>Available Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(form_field, index) in form_fields" :key="index">
                <td>
                  <span>
                    <el-button
                      v-if="form_fields.length > 1"
                      type="danger"
                      circle
                      size="mini"
                      @click="removeLine(index)"
                    >
                      <feather-icon icon="TrashIcon" />
                    </el-button>
                    <el-button
                      v-if="index + 1 === form_fields.length"
                      type="primary"
                      circle
                      size="mini"
                      @click="addLine(index)"
                    >
                      <feather-icon icon="PlusIcon" />
                    </el-button>
                  </span>
                </td>
                <td>
                  <el-input v-model="form_field.label" type="text" outline placeholder="Label" />
                  <small>The label on the form</small>
                </td>
                <td>
                  <el-select
                    v-model="form_field.input_type"
                    placeholder="Select Input Type"
                    filterable
                    class="span"
                  >
                    <el-option
                      v-for="(input_type, item_index) in input_types"
                      :key="item_index"
                      :value="input_type.value"
                      :label="input_type.label"
                    />
                  </el-select>
                </td>
                <!-- <td>
                  <el-input
                    v-model="form_field.placeholder"
                    type="text"
                    outline
                    placeholder="Placeholder"
                  />
                </td> -->
                <td>
                  <el-select
                    v-model="form_field.is_required"
                    placeholder="Select"
                    filterable
                    class="span"
                  >
                    <el-option
                      v-for="(required, required_index) in is_required"
                      :key="required_index"
                      :value="required.value"
                      :label="required.label"
                    /> </el-select
                  ><br />
                  <small>Set if field is compulsory</small>
                </td>
                <td>
                  <div v-if="form_field.input_type === 'select'">
                    <el-input v-model="form_field.available_options" type="textarea" />
                    <small
                      >Enter all available options for a dropdown. Separate entries by a comma
                      <code>,</code></small
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="fill_fields_error">
                <td colspan="5">
                  <label class="alert alert-danger"
                    >Please fill all empty fields before adding another row</label
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="2" class="padded">
      <el-col :xs="24" :sm="6" :md="6">
        <el-button type="success" @click="addFormFields">
          <i class="el-icon-plus"></i>
          Submit
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  name: 'AddFormField',

  data() {
    return {
      form_fields: [],
      fill_fields_error: false,
      blockRemoval: 0,
      input_types: [
        { label: 'Number', value: 'number_input' },
        { label: 'String', value: 'string_input' },
        { label: 'Dropdown', value: 'select' }
      ],
      is_required: [
        { label: 'Yes', value: '1' },
        { label: 'No', value: '0' }
      ]
    }
  },
  watch: {
    form_fields() {
      this.blockRemoval = this.form_fields.length <= 1
    }
  },
  mounted() {
    this.addLine()
  },
  methods: {
    addLine() {
      this.fill_fields_error = false

      const checkEmptyLines = this.form_fields.filter(
        (detail) =>
          detail.label === '' ||
          // detail.placeholder === '' ||
          detail.available_options === 0
      )

      if (checkEmptyLines.length >= 1 && this.form_fields.length > 0) {
        this.fill_fields_error = true
        // this.form_fields[index].seleted_category = true;
      } else {
        // if (this.form_fields.length > 0)
        //     this.form_fields[index].grade = '';

        this.form_fields.push({
          label: '',
          input_type: 'string_input',
          // placeholder: '',
          is_required: '0'
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.form_fields.splice(detailId, 1)
      }
    },
    addFormFields() {
      const params = { form_fields: this.form_fields }

      const createFormFields = new Resource('custom-fields/store')
      createFormFields.store(params).then((response) => {
        this.$message({
          message: 'Form Fields Created Successfully!!!',
          type: 'success'
        })
        this.$emit('save', response.message)
      })
    }
  }
}
</script>
