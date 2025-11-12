<template>
  <div>
    <aside>
      <el-row :gutter="10">
        <el-col :md="24">
          <label
            >Type in the asset types and hit enter to add more. Then click on the Submit
            button</label
          >
          <el-select
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
          </el-select>
        </el-col>
        <el-col :md="4">
          <br />
          <el-button type="success" @click="submitEntry()"> Submit </el-button>
        </el-col>
      </el-row>
    </aside>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    clientId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      form: { names: [] },
      assetTypesList: [{ name: 'Application Server' }, { name: 'Data' }, { name: 'People' }],
      options: []
    }
  },
  computed: {
    // assetTypesList() {
    //   return this.$store.getters.assetTypesList
    // },
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
      form.client_id = this.clientId
      this.loading = true
      saveEntryResource
        .store(form)
        .then(() => {
          this.form.names = []
          this.$message('Submitted')
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
