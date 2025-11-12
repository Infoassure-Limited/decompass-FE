<template>
  <div v-loading="loader">
    <el-row>
      <span class="pull-right">
        <el-button v-if="!add_form_field" type="primary" @click="add_form_field = true">
          <feather-icon icon="PlusIcon" class="mr-50" />
          <span class="align-middle">Add Form Fields</span>
        </el-button>
        <el-button v-if="add_form_field" type="danger" @click="add_form_field = false">
          <feather-icon icon="XIcon" class="mr-50" />
          <span class="align-middle">Cancel</span>
        </el-button>
      </span>
    </el-row>
    <v-client-table
      v-if="!add_form_field"
      :data="form_fields"
      :columns="columns"
      :options="options"
    >
      <template v-slot:action="props">
        <div>
          <!-- <el-button
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </el-button> -->
          <el-button type="danger" circle @click="destroyRow(props.row)">
            <feather-icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <div v-if="add_form_field">
      <add-form-fields @save="updateTable" />
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import AddFormFields from './partials/AddFormFields.vue'

export default {
  components: {
    AddFormFields
  },
  data() {
    return {
      form_fields: [],
      columns: [
        'label',
        'input_type',
        'is_required',
        'available_options',
        'action' /* 'data_type', 'min_count', 'max_count', */
      ],

      options: {
        headings: {},
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        // editableColumns:['name', 'category.name', 'sku'],
        sortable: ['label'],
        filterable: ['label', 'available_options']
      },
      loader: false,
      add_form_field: false
    }
  },
  mounted() {
    this.fetchFormFields()
  },
  methods: {
    fetchFormFields() {
      this.loader = true

      const fetchFormFieldsResource = new Resource('custom-fields')
      fetchFormFieldsResource
        .list()
        .then((response) => {
          this.form_fields = response.form_fields
          this.loader = false
        })
        .catch((error) => {
          this.loader = false
          console.log(error)
        })
    },
    updateTable() {
      this.add_form_field = false
      this.fetchFormFields()
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loader = true
        const destroyQuestionsResource = new Resource('custom-fields/destroy')
        destroyQuestionsResource.destroy(row.id).then(() => {
          this.fetchFormFields()
          this.loader = false
        })
      }
    }
  }
}
</script>
