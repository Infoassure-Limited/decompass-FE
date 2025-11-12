<template>
  <div v-if="businessUnitId !== ''">
    <el-row :gutter="20" class="padded">
      <el-col>
        <div class="table-responsive">
          <h3>Create Risk/Threat Register</h3>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th></th>
                <th>Risk Type</th>
                <th>Vulnerability Description</th>
                <th>Impact/Outcome Description</th>
                <th>Existing Control</th>
                <th>Risk Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(risk_register, index) in risk_registers" :key="index">
                <td>
                  <span>
                    <el-button
                      v-if="risk_registers.length > 1"
                      type="danger"
                      circle
                      @click="removeLine(index)"
                    >
                      <feather-icon icon="TrashIcon" />
                    </el-button>
                    <el-button
                      v-if="index + 1 === risk_registers.length"
                      type="primary"
                      circle
                      @click="addLine(index)"
                    >
                      <feather-icon icon="PlusIcon" />
                    </el-button>
                  </span>
                </td>
                <td>
                  <!-- <input
                    v-model="risk_register.risk_type"
                    type="text"
                    outline
                    placeholder="Risk Type"
                  > -->
                  <select v-model="risk_register.risk_type" placeholder="Risk Type">
                    <option
                      v-for="(risk_type, type_index) in risk_types"
                      :key="type_index"
                      :value="risk_type"
                      :label="risk_type"
                    ></option>
                  </select>
                </td>
                <td>
                  <textarea
                    v-model="risk_register.vunerability_description"
                    type="textarea"
                    outline
                    placeholder="Describe Risk/Threat"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    v-model="risk_register.threat_impact_description"
                    type="textarea"
                    outline
                    placeholder="State impact outcome"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    v-model="risk_register.existing_controls"
                    type="textarea"
                    outline
                    placeholder="What controls are in place"
                  ></textarea>
                </td>
                <td>
                  <input
                    v-model="risk_register.risk_owner"
                    type="text"
                    outline
                    placeholder="State the Risk owner"
                  />
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
        <el-button type="success" @click="submit">
          <i class="el-icon-plus"></i>
          Submit
        </el-button>
      </el-col>
    </el-row>
  </div>
  <div v-else>
    <el-empty>Please select a Business Unit</el-empty>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  name: 'AddFormField',
  props: {
    clientId: {
      type: Number,
      default: null
    },
    businessUnitId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      risk_registers: [],
      fill_fields_error: false,
      blockRemoval: 0,
      form: {
        client_id: '',
        business_unit_id: ''
      },
      risk_types: ['Financial', 'Legal, Compliance & Regulatory', 'Operational', 'Strategic']
    }
  },
  watch: {
    risk_registers() {
      this.blockRemoval = this.risk_registers.length <= 1
    }
  },
  created() {
    this.addLine()
  },
  methods: {
    addLine() {
      this.fill_fields_error = false

      const checkEmptyLines = this.risk_registers.filter(
        (detail) =>
          detail.risk_type === '' ||
          detail.vunerability_description === '' ||
          detail.threat_impact_description === '' ||
          detail.existing_controls === '' ||
          detail.risk_owner === ''
      )

      if (checkEmptyLines.length >= 1 && this.risk_registers.length > 0) {
        this.fill_fields_error = true
        // this.risk_registers[index].seleted_category = true;
      } else {
        // if (this.risk_registers.length > 0)
        //     this.risk_registers[index].grade = '';
        this.risk_registers.push({
          risk_type: '',
          vunerability_description: '',
          threat_impact_description: '',
          existing_controls: '',
          risk_owner: ''
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.risk_registers.splice(detailId, 1)
      }
    },
    submit() {
      const params = {
        client_id: this.clientId,
        business_unit_id: this.businessUnitId,
        risk_registers: this.risk_registers
      }

      const createFormFields = new Resource('store-risk-registers')
      createFormFields.store(params).then(() => {
        this.$message({
          message: 'Submitted Successfully!!!',
          type: 'success'
        })
        this.$emit('save')
      })
    }
  }
}
</script>
