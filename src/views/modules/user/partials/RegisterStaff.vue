<template>
  <el-row :gutter="20">
    <el-col :md="12">
      <v-text-field id="name" v-model="form.name" label="Full Name" variant="outlined" />
    </el-col>
    <el-col :md="12">
      <v-text-field id="email" v-model="form.email" label="Email" type="email" variant="outlined" />
    </el-col>
    <el-col :md="12">
      <v-text-field
        id="phone"
        v-model="form.phone"
        label="Primay Phone Number"
        variant="outlined"
      />
    </el-col>
    <el-col :md="12">
      <label label-for="roles" rules="required">Staff Role</label>
      <el-select v-model="form.role_id" style="width: 100%">
        <el-option
          v-for="(role, index) in staff_roles"
          :key="index"
          :value="role.id"
          :label="role.display_name"
          :disabled="role.name === 'super'"
        />
      </el-select>
    </el-col>
    <el-col :md="24">
      <el-button type="success" @click="formSubmitted"> Submit </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,

      form: {
        name: '',
        email: '',
        phone: '',
        role_id: ''
      },
      empty_form: {
        name: '',
        email: '',
        phone: '',
        role_id: ''
      },
      // codeIcon,
      genders: ['Male', 'Female'],
      loader: false,
      staff_roles: []
    }
  },
  created() {
    // this.fetchFormDetails()
    this.fetchRoles()
  },
  methods: {
    fetchRoles() {
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list({ option: 'staff' }).then((response) => {
        this.staff_roles = response.roles
      })
    },
    formSubmitted() {
      const registerStaffResource = new Resource('users/register')
      const { form } = this
      this.loader = true
      registerStaffResource
        .store(form)
        .then(() => {
          this.form = this.empty_form
          this.loader = false

          this.$message('Successful Registration', 'Success', {
            type: 'success',
            duration: 5000
          })
          // this.$router.push({ path: 'login' })
          this.$emit('saved')
          // send mail
        })
        .catch((error) => {
          console.log(error)
          this.$message(error.response.data.message, 'Error', {
            type: 'danger',
            duration: 5000
          })
          this.loader = false
        })
    }
  }
}
</script>
