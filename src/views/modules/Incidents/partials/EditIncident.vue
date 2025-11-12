<template>
  <div>
    <el-row v-if="loading" :gutter="10">
      <el-col :md="12" v-for="count in 6" :key="count">
        <el-skeleton :rows="1" animated />
      </el-col>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :md="12">
        <label for="">Incident Category</label>
        <el-select
          v-model="form.incident_type_id"
          placeholder="Select Incident Category"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(cat, index) in incident_categories"
            :key="index"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label for="">Incident Date</label>
        <el-date-picker
          v-model="form.occurred_at"
          type="datetime"
          placeholder="Select date and time"
          style="width: 100%"
          :shortcuts="shortcuts"
        />
      </el-col>
      <el-col :md="24">
        <v-text-field
          v-model="form.title"
          :readonly="loader"
          class="mb-2"
          label="Title"
          placeholder="Give the incident a title"
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
          label="Description"
          placeholder="Briefly describe the incident"
          variant="outlined"
        />
      </el-col>
      <el-col :md="24">
        <v-text-field
          v-model="form.loction"
          :readonly="loader"
          class="mb-2"
          label="Incident Location"
          placeholder="Specify the location of the incident"
          variant="outlined"
        />
      </el-col>
      <el-col :md="12">
        <label for="">Severity</label>
        <el-select
          v-model="form.severity"
          placeholder="Select Severity"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(severity, index) in ['Low', 'Medium', 'High', 'Critical']"
            :key="index"
            :label="severity"
            :value="severity"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label for="">Affected Assets</label>
        <el-select
          v-model="form.affected_assets"
          placeholder="Select Affected Assets"
          filterable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="(asset, index) in assets"
            :key="index"
            :label="asset.name"
            :value="asset.name"
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
    categoryId: {
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
      assets: [],
      form: {
        title: null,
        description: null,
        incident_type_id: null,
        severity: null,
        affected_assets: [],
        location: null,
        occurred_at: null
      },
      empty_form: {
        title: null,
        description: null,
        incident_type_id: null,
        severity: null,
        affected_assets: [],
        location: null,
        occurred_at: null
      },
      loader: false,
      loading: false
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
    this.fetchIncidentCategories()
    this.fetchAssets()
  },
  methods: {
    fetchAssets() {
      this.loading = true
      const fetchAssetsResource = new Resource('assets/fetch-assets')
      fetchAssetsResource
        .list()
        .then((response) => {
          this.assets = response.assets
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchIncidentCategories() {
      const fetchEntryResource = new Resource('isms/incident-types')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      fetchEntryResource
        .list()
        .then((response) => {
          this.incident_categories = response.data
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    formSubmitted() {
      const createResource = new Resource('isms/incidents/store')
      const { form } = this
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
