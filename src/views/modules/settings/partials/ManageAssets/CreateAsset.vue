<template>
  <div>
    <el-row v-loading="creating" :gutter="20">
      <el-col :md="12">
        <label>
          Asset Type
          <el-button type="text" @click="showCreate = true">
            <icon icon="tabler:plus" />Click to create if not listed
          </el-button>
        </label>
        <el-select
          v-model="form.asset_type_id"
          filterable
          placeholder="Select Asset type"
          value-key="id"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in assetTypes"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label class="mb-5">Asset Name</label>
        <el-input v-model="form.name" placeholder="Enter name of the asset" style="width: 100%" />
        <!-- <el-select
          v-model="form.name"
          filterable
          allow-create
          clearable
          placeholder="Type in an asset"
          default-first-option
          style="width: 100%"
        >
          <el-option v-for="(item, index) in options" :key="index" :label="item" :value="item" />
        </el-select> -->
      </el-col>
      <el-col :md="12">
        <label>Asset Description</label>
        <el-input
          v-model="form.description"
          placeholder="Briefly describe this asset"
          type="textarea"
          maxlength="300"
          show-word-limit
          style="width: 100%"
        />
      </el-col>
      <el-col :md="12">
        <label>Asset Classification</label>
        <el-select
          v-model="form.classification"
          filterable
          placeholder="Classification"
          style="width: 100%"
        >
          <el-option
            v-for="item in ['Public', 'Internal', 'Confidential', 'Restricted']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label>Purpose of the asset</label>
        <el-input
          v-model="form.purpose"
          placeholder="Briefly state the purpose of this asset"
          type="text"
          style="width: 100%"
        />
      </el-col>
      <el-col :md="12">
        <label>Type of information stored</label>
        <el-select v-model="form.information_stored" filterable style="width: 100%">
          <el-option
            v-for="item in [
              'None',
              'Personal Data',
              'Organization Data',
              'Commercial Data',
              'Intellectual Property'
            ]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <label>Location of the asset</label>
        <p></p>
        <el-radio-group v-model="form.location_type">
          <el-radio label="Physical" border> Physical </el-radio>
          <el-radio label="Virtual" border> Virtual </el-radio>
          <el-radio label="Remote" border> Remote </el-radio>
        </el-radio-group>
        <p></p>
        <el-input
          v-if="form.location_type !== ''"
          v-model="form.location"
          :placeholder="`Where is the asset located ${form.location_type}ly?`"
          type="text"
          style="width: 100%"
        />
      </el-col>
      <!-- <el-col :md="12">
      <label>Assign Asset Owner</label>
      <el-select
        v-model="form.owner_id"
        placeholder="Select Asset Owner"
        filterable
        style="width: 100%"
      >
        <el-option
          v-for="(user, user_index) in staff"
          :key="user_index"
          :value="user.id"
          :label="user.name"
        >
          <span style="float: left">{{ user.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            user.designation ? user.designation : ''
          }}</span>
        </el-option>
      </el-select>
    </el-col> -->
      <el-col :md="24">
        <p></p>
        <el-button type="success" @click="submit()"> Submit </el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="showCreate"
      title="Create Asset Types"
      width="40%"
      destroy-on-close
      hide-footer
    >
      <CreateAssetType @saved="($emit('updateAssetTypes'), (showCreate = false))" />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import CreateAssetType from './CreateAssetType.vue'

export default {
  components: {
    CreateAssetType
  },
  props: {
    assetTypes: {
      type: Array,
      default: () => []
    },
    clientId: {
      type: Number,
      default: null
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      assets: [],
      form: {
        asset_type_id: '',
        name: '',
        description: '',
        purpose: '',
        classification: '',
        information_stored: '',
        location: '',
        location_type: ''
      },
      createModal: false,
      showCreate: false,
      assetsList: [],
      options: [],
      selectedAssetType: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
    // assetsList() {
    //   return this.$store.getters.assetsList
    // },
  },
  methods: {
    setSampleAssets() {
      // this.assetsList = []
      this.form.asset_type_id = this.selectedAssetType.id
      this.options = this.selectedAssetType.asset_samples
    },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.options = this.assetsList.filter(
    //         (item) => item.toLowerCase().indexOf(query.toLowerCase()) > -1
    //       )
    //     }, 200)
    //   } else {
    //     this.options = []
    //   }
    // },
    submit() {
      this.creating = true
      const formData = this.form
      formData.client_id = this.clientId
      formData.location = `${formData.location_type} - ${formData.location}`
      const updatePhotoResource = new Resource('assets/save-assets')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.creating = false
          this.form = { names: [] }
          this.$message('Submitted')
          this.$emit('save')
        })
        .catch((e) => {
          this.creating = false
          this.$message(e.response.data.message)
        })
    }
  }
}
</script>
