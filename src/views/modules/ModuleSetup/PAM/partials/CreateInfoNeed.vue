<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row :gutter="20" v-loading="loading">
      <el-col :md="24">
        <el-select
          v-model="form.info_need_category_id"
          placeholder="Select Information Need Category"
          style="width: 100%; margin-bottom: 15px"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-col>
      <el-col :md="24">
        <small>
          Type in the names of the information needs you want to add and hit enter to add more.
        </small>
        <el-input-tag
          v-model="form.names"
          placeholder="Please input"
          aria-label="Please click the Enter key after input"
        />
      </el-col>
      <!-- submit and reset -->
      <el-col :md="24">
        <el-button
          :disabled="form.info_need_category_id !== '' && form.names.length > 0 ? false : true"
          :loading="creating"
          type="primary"
          @click="submit()"
        >
          Submit
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  props: {
    categories: {
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
      form: {
        info_need_category_id: '',
        names: []
      }
    }
  },
  methods: {
    submit() {
      this.creating = true
      const form = this.form
      const storeResource = new Resource('pam/store-infoneeds')
      storeResource
        .store(form)
        .then(() => {
          this.creating = false
          this.form.names = []
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
