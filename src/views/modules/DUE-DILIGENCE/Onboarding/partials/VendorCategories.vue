<template>
  <div v-loading="loading">
    <div>
      <el-row>
        <el-col :md="12">
          <h3>Available Categories</h3>
        </el-col>
        <el-col v-if="checkRole(['admin'])" :md="12">
          <span class="pull-right">
            <el-button type="primary" @click="isCreateCategorySidebarActive = true">
              <icon icon="tabler:plus" />
              <span class="align-middle">Create Category</span>
            </el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <hr />
    <v-client-table :data="categories" :columns="columns" :options="options">
      <!-- <template v-slot:assigned_permissions="props">
        <div>
          <span v-for="(permission, perm_index) in props.row.permissions" :key="perm_index">
            <el-tag>{{ perm_index + 1 + ') ' + permission.display_name }}</el-tag
            >&nbsp;
          </span>
        </div>
      </template> -->
      <template v-slot:action="props">
        <el-button-group v-if="checkRole(['admin'])">
          <el-tooltip content="Edit">
            <el-button @click="editThisRow(props.row)">
              <icon icon="tabler:edit" color="orange" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Delete">
            <el-button @click="destroy(props.row)">
              <icon icon="tabler:trash" color="red" />
            </el-button>
          </el-tooltip>
        </el-button-group>
      </template>
    </v-client-table>
    <el-dialog
      title="Create Category"
      v-if="isCreateCategorySidebarActive"
      v-model="isCreateCategorySidebarActive"
    >
      <AddCategory @save="updateTable" />
    </el-dialog>
    <el-dialog
      title="Edit Category"
      v-if="isEditCategorySidebarActive"
      v-model="isEditCategorySidebarActive"
    >
      <EditCategory
        v-if="isEditCategorySidebarActive"
        :selected-category="editable_row"
        @update="updateTable"
      />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import AddCategory from './AddCategory.vue'
import EditCategory from './EditCategory.vue'
import checkRole from '@/utils/role'

export default {
  components: {
    // VueGoodTable,
    AddCategory,
    EditCategory
  },
  data() {
    return {
      loading: false,
      selectedCategory: null,
      isCreateCategorySidebarActive: false,
      isEditCategorySidebarActive: false,
      pageLength: 10,

      columns: [
        // 'name',
        'name',
        // 'description',
        'action'
      ],

      options: {
        headings: {
          name: 'Category Name',
          action: ''

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: [
          // 'name',
          'name',
          'description'
        ],
        // filterable: false,
        filterable: [
          // 'name',
          'name',
          'description'
        ]
      },
      categories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      selected_category_index: ''
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    checkRole,
    fetchCategories(load = true) {
      this.loading = load
      const fetchCategoryResource = new Resource('vdd/fetch-vendor-categories')
      fetchCategoryResource
        .list()
        .then((response) => {
          this.categories = response.categories
          // this.categories = response.categories
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateTable(categories) {
      this.isCreateCategorySidebarActive = false
      this.isEditCategorySidebarActive = false
      this.fetchCategories(false)
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditCategorySidebarActive = true
    },
    destroy(row) {
      this.$confirm('Are you sure you want to delete this category?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const deleteCategoryResource = new Resource('vdd/delete-vendor-category')
        deleteCategoryResource
          .delete(row.id)
          .then(() => {
            this.loading = false
            this.$message({
              type: 'success',
              message: 'Category deleted successfully!'
            })
            this.fetchCategories(false)
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
