<!-- eslint-disable vue/html-indent -->
<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="400px" style="background-color: #fcfcfc">
      <h3>Risk Categories</h3>
      <!-- <aside>
        <el-input v-model="filterText" placeholder="Filter keyword" />
      </aside> -->
      <div v-for="(category, index) in categories" :key="index">
        <CardNavView
          :id="`category-${index}`"
          :title="category.name"
          :tag-label="`${category.sub_categories.length} subs`"
          @clickToView="viewDetails(category)"
        >
          <!-- <template #description>
            <div>
              <el-tag class="pull-right" effect="dark" type="success" round>
                {{ category.sub_categories.length }} Subs
              </el-tag>
            </div>
          </template> -->
        </CardNavView>
      </div>
    </el-aside>

    <el-container v-loading="loading">
      <el-header style="font-size: 12px; padding: 10px">
        <el-button v-if="isEdit" type="primary" @click="createNew()">
          <icon icon="tabler:plus" /> Create New
        </el-button>
        <el-popconfirm
          v-if="categories.length < 1"
          width="400"
          hide-icon
          title="The system can auto-generate pre-defined risk categories. Click YES to proceed."
          @confirm="importRiskCategory"
        >
          <template #reference>
            <el-button type="info"> <icon icon="tabler:package-import" /> Generate </el-button>
          </template>
        </el-popconfirm>
      </el-header>

      <el-main>
        <div>
          <create-risk-category
            :client-id="selectedClient.id"
            :selected-data="selectedRiskCategory"
            :is-edit="isEdit"
            @saved="fetchCategory"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import CreateRiskCategory from './partials/CreateRiskCategory.vue'
import Resource from '@/api/resource'
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    CreateRiskCategory,
    CardNavView
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
    this.fetchCategory()
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
        this.loading = true
        setTimeout(() => {
          this.selectedRiskCategory = category
          this.isEdit = true
          this.loading = false
        }, 1)
      }
    },
    importRiskCategory() {
      const fetchEntryResource = new Resource('risk-assessment/generate-risk-categories')
      this.loading = true
      fetchEntryResource
        .store({ client_id: this.selectedClient.id })
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
