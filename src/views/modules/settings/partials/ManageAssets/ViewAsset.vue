<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="20">
        <h3>Edit Asset</h3>
      </el-col>
    </el-row>
    <el-row v-loading="loading" :gutter="20">
      <el-col :md="12">
        <label>Asset Type</label>
        <el-select
          v-model="form.asset_type_id"
          filterable
          disabled
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
      <el-col :md="12">
        <label>Asset Name</label>
        <el-select
          v-model="form.name"
          filterable
          allow-create
          remote
          reserve-keyword
          clearable
          disabled
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
      <el-col :md="12">
        <label>Asset Description</label>
        <el-input
          v-model="form.description"
          disabled
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
          disabled
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
          disabled
          placeholder="Briefly state the purpose of this asset"
          type="text"
          style="width: 100%"
        />
      </el-col>
      <el-col :md="12">
        <label>Type of information stored</label>
        <el-select v-model="form.information_stored" filterable disabled style="width: 100%">
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
          :disabled
          placeholder="`Where is the asset located ${form.location_type}ly?`"
          type="text"
          style="width: 100%"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
    }
  }
}
</script>
