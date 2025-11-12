<template>
  <div>
    <el-row v-if="loading" :gutter="10">
      <el-col :md="12" v-for="count in 6" :key="count">
        <el-skeleton :rows="1" animated />
      </el-col>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :md="12">
        <label for="">Assign To</label>
        <el-select
          v-model="form.assigned_to"
          placeholder="Select Assignee"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(user, index) in client_users"
            :key="index"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label for="">Deadline</label>
        <el-date-picker
          v-model="form.deadline"
          type="date"
          placeholder="Select date and time"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          :shortcuts="shortcuts"
        />
      </el-col>
      <el-col :md="24">
        <v-text-field
          v-model="form.title"
          :readonly="loader"
          class="mb-2"
          label="Task Title"
          placeholder="Give the task a title"
          variant="outlined"
          :error-messages="v$.form.title.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="24">
        <v-textarea
          v-model="form.description"
          :readonly="loader"
          class="mb-2"
          :rows="3"
          label="Task Description"
          placeholder="Detailed description of the task/action"
          variant="outlined"
        />
      </el-col>
      <el-col :md="24">
        <label for="">Priority</label>
        <el-select
          v-model="form.priority"
          placeholder="Select Priority"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(priority, index) in ['Low', 'Medium', 'High', 'Critical']"
            :key="index"
            :label="priority"
            :value="priority"
          />
        </el-select>
      </el-col>
      <el-col :md="24">
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
    incident: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      shortcuts,
      client_users: [],
      form: {
        title: null,
        description: null,
        assigned_to: null,
        priority: 'High',
        deadline: null
      },
      empty_form: {
        title: null,
        description: null,
        assigned_to: null,
        priority: 'High',
        deadline: null
      },
      loader: false,
      loading: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  validations() {
    return {
      form: {
        title: { required }
      }
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  mounted() {
    this.fetchClientUsers()
  },
  methods: {
    fetchClientUsers() {
      this.loading = true
      const clientUsersResource = new Resource('clients/users')
      clientUsersResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.client_users = response.users
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    formSubmitted() {
      const createResource = new Resource('isms/incidents/store-tasks')
      const { form } = this
      form.incident_id = this.incident.id
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
