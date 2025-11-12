<!-- eslint-disable vue/html-indent -->
<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="300px" style="background-color: #fcfcfc">
      <div
        style="
          text-align: center;
          background-color: #000000;
          color: #ffffff;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        "
      >
        <span>Risk Categories</span>
      </div>
      <aside>
        <el-input v-model="filterText" placeholder="Filter keyword" />
      </aside>
      <el-tree
        ref="tree"
        class="filter-tree"
        :highlight-current="true"
        :accordion="true"
        :data="categories"
        :props="treeProps"
        :filter-node-method="filterNode"
        @node-click="viewDetails"
      />
      <!-- <el-menu
        background-color="#fcfcfc"
        text-color="#00000"
      >
        <el-menu-item
          v-for="(category, index) in categories"
          :key="index"
          :index="index"
          @click="viewDetails(category)"
        >
          <span slot="title">{{ category.name }}</span>
        </el-menu-item>
      </el-menu> -->
    </el-aside>

    <el-container v-loading="loading">
      <el-header style="text-align: right; font-size: 12px; padding: 10px">
        <el-button type="primary" plain size="mini" @click="createNew()"> Create New </el-button>
      </el-header>

      <el-main>
        <div>
          <create-risk-category
            :client-id="selectedClient.id"
            :selected-data="selectedRiskCategory"
            :is-edit="isEdit"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import CreateRiskCategory from './partials/CreateRiskCategory.vue'
import Resource from '@/api/resource'

export default {
  components: {
    CreateRiskCategory
  },
  data() {
    return {
      categories: [],
      form: { name: '', sub_categories: [] },
      selectedRiskCategory: { name: '', sub_categories: [] },
      loading: false,
      isEdit: false,
      treeProps: {
        children: 'sub_categories',
        label: 'name'
      },
      inputVisible: false,
      inputValue: '',
      filterText: ''
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchCategory()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // this.fetchCategory()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.name.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_categories.splice(this.sub_categories.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const { inputValue } = this
      if (inputValue) {
        this.sub_categories.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    createNew() {
      this.selectedRiskCategory = this.form
      this.isEdit = false
    },
    viewDetails(category) {
      if (category.id) {
        this.isEdit = false
        setTimeout(() => {
          this.selectedRiskCategory = category
          this.isEdit = true
        }, 1)
      }
    },
    fetchCategory() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.categories = response.categories

          this.loading = false
        })
        .catch((error) => {
          console.log(error.response)
          // this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-category')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchCategory()
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error(error.response.data.error)
            this.loading = false
          })
      }
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
