<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <el-col v-if="form.client_id !== ''" cols="12">
        <v-text-field
          v-model="form.group_name"
          variant="outlined"
          label="Department (L1)"
          style="width: 100%"
        />
      </el-col>
      <el-col v-if="form.client_id !== ''" cols="12">
        <v-text-field
          v-model="form.unit_name"
          variant="outlined"
          label="Unit (L2)"
          style="width: 100%"
        />
      </el-col>
      <el-col v-if="form.client_id !== ''" cols="12">
        <!-- <v-text-field
                  v-model="form.teams"
                  variant="outlined" label="Example: Engineering, Backend, etc"
                  style="width: 100%;"
                /> -->
        <div>
          <el-tag
            v-for="team in form.teams"
            :key="team"
            closable
            type="success"
            :disable-transitions="false"
            @close="handleClose(team)"
          >
            {{ team }}
          </el-tag>
          <v-text-field
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            variant="outlined"
            label="Sub Units (L3)"
            size="mini"
            style="width: 70%"
            @blur="handleInputConfirm"
          />
          <a v-else style="color: #409eff; cursor: pointer; text-align: right" @click="showInput">
            + Add Sub Unit</a
          >
          <p></p>
        </div>
      </el-col>
      <el-col v-if="form.client_id !== ''" cols="12">
        <el-form-group variant="outlined" label="Function Performed" label-for="v-business-unit">
          <v-text-field
            v-model="form.function_performed"
            variant="outlined"
            label="Function Performed"
            style="width: 100%"
          />
        </el-form-group>
      </el-col>
      <el-col v-if="form.client_id !== ''" cols="12">
        <el-form-group variant="outlined" label="Contact Phone" label-for="v-business-unit">
          <v-text-field
            v-model="form.contact_phone"
            variant="outlined"
            label="Contact Phone"
            style="width: 100%"
          />
        </el-form-group>
      </el-col>
      <!-- submit and reset -->
      <el-col cols="12">
        <el-button type="primary" class="btn-block" @click="submit()"> Submit </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isEditBusinessUnitSidebarActive',
    event: 'update:is-edit-business-unit-sidebar-active'
  },
  props: {
    isEditBusinessUnitSidebarActive: {
      type: Boolean,
      required: true
    },
    clients: {
      type: Array,
      required: true
    },
    businessUnit: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        client_id: '',
        group_name: '',
        unit_name: '',
        function_performed: '',
        contact_phone: '',
        teams: []
      },
      loading: false,
      inputVisible: false,
      inputValue: '',
      teams: []
    }
  },
  created() {
    this.form = this.businessUnit
    this.teams = this.businessUnit.teams !== null ? this.businessUnit.teams : []
  },
  methods: {
    handleClose(tag) {
      this.teams.splice(this.teams.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const { inputValue } = this
      if (inputValue) {
        this.teams.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    update() {
      this.loading = true
      const param = this.form
      param.teams = this.teams
      const saveBusinessUnitsResource = new Resource('business-units/update-business-unit')
      saveBusinessUnitsResource
        .update(param.id, param)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful'
          })
          this.$emit('update')
          // this.$emit('update:is-edit-business-unit-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
