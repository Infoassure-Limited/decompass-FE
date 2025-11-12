<template>
  <div>
    <aside>
      <el-row :gutter="10">
        <el-col :md="24">
          <label
            >Type in the asset types applicable to your organization. <br />
            Separate multiple entries with a comma (<code>,</code>). Then click on the Submit
            button</label
          >
          <el-input
            v-model="asset_types"
            type="textarea"
            placeholder="Example: Software, Hardware, etc"
            rows="5"
            style="width: 100%"
          />
          <!-- <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            remote
            reserve-keyword
            clearable
            :remote-method="remoteMethod"
            placeholder="Example: People, IT equipment, etc"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select> -->
        </el-col>
        <el-col :md="4">
          <br />
          <el-button :loading="loading" type="success" @click="submitEntry()"> Submit </el-button>
        </el-col>
      </el-row>
    </aside>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  data() {
    return {
      loading: false,
      form: { names: [] },
      asset_types: '',
      options: []
    }
  },
  computed: {
    assetTypesList() {
      return this.$store.getters.assetTypesList
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.assetTypesList.filter(
            (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.options = []
      }
    },
    submitEntry() {
      const saveEntryResource = new Resource('assets/save-asset-types')
      const { form } = this
      form.names = this.asset_types.split(',')
      this.loading = true
      saveEntryResource
        .store(form)
        .then(() => {
          this.form.names = []
          this.$message('Added Successfully')
          this.loading = false
          this.$emit('saved')
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    }
  }
}
</script>
