<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="20">
        <h3>Edit Asset</h3>
      </el-col>
      <el-col v-if="checkPermission(['delete-assets'])" :md="4">
        <el-button type="danger" @click="deleteAsset()">
          <icon icon="tabler:trash" /> Delete
        </el-button>
      </el-col>
    </el-row>
    <el-row v-loading="loading" :gutter="20">
      <el-col :md="24">
        <label>Asset Type</label>
        <el-select
          v-model="form.asset_type_id"
          filterable
          placeholder="Select Asset type"
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
      <el-col :md="24">
        <label>Asset Name</label>
        <el-select
          v-model="form.name"
          filterable
          allow-create
          remote
          reserve-keyword
          clearable
          placeholder="Example: Laptop, Router, Switches, etc"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-col>
      <el-col :md="24">
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
      <el-col :md="24">
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
      <el-col :md="24">
        <label>Purpose of the asset</label>
        <el-input
          v-model="form.purpose"
          placeholder="Briefly state the purpose of this asset"
          type="text"
          style="width: 100%"
        />
      </el-col>
      <el-col :md="24">
        <label>Type of information stored</label>
        <el-select v-model="form.information_stored" filterable style="width: 100%">
          <el-option
            v-for="item in [
              'Personal Data',
              'Sensitive Personal Data',
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
      <el-col :md="24">
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
      <!-- <el-col :md="24">
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
        <br />
        <el-button type="success" @click="update()"> Update </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    assetTypes: {
      type: Array,
      default: () => []
    },
    selectedAsset: {
      type: Object,
      required: true
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
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
        location_type: '',
        owner_id: ''
      },
      createModal: false,
      assetsList: [{ name: 'Laptop' }, { name: 'Router' }, { name: 'Switches' }],
      options: []
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
  mounted() {
    this.form = this.selectedAsset
  },
  methods: {
    checkPermission,
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.assetsList.filter(
            (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.options = []
      }
    },
    update() {
      this.loading = true
      const formData = this.form
      const updatePhotoResource = new Resource('assets/update-asset')
      updatePhotoResource
        .update(formData.id, formData)
        .then(() => {
          this.loading = false
          this.$message('Updated')
          this.$emit('update')
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.data.message)
        })
    },
    deleteAsset() {
      if (window.confirm('Click OK to confirm delete action')) {
        const deleteEntryResource = new Resource('assets/delete-asset')
        this.loading = true
        deleteEntryResource
          .destroy(this.selectedAsset.id)
          .then(() => {
            this.$emit('deleted')
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            app.$message.error(error.response.data.error)
            app.loading = false
          })
      }
    }
  }
}
</script>
