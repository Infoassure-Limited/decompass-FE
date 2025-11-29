<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <el-col :md="24">
        <small>
          Type in the names of the categories you want to add and hit enter to add more.
        </small>
        <el-input-tag
          v-model="names"
          placeholder="Please input"
          aria-label="Please click the Enter key after input"
        />
      </el-col>
      <!-- submit and reset -->
      <el-col :md="24">
        <el-button :loading="creating" type="primary" @click="submit()"> Submit </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      names: []
    }
  },
  methods: {
    submit() {
      this.creating = true
      const storeResource = new Resource('pam/store-infoneed-categories')
      storeResource
        .store({ names: this.names })
        .then(() => {
          this.creating = false
          this.names = []
          this.$message({
            message: 'Submitted Successfully',
            type: 'success'
          })
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
