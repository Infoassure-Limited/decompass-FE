<template>
  <div>
    {{ data }}
    <el-collapse>
      <el-collapse-item v-for="(docData, index) in data" :key="index">
        <template #title>
          <h3><icon icon="tabler:folder-open" /> {{ docData.label }}</h3>
        </template>
        <div v-if="docData.children.length > 0">
          <FormatDocumentTree :data="docData" />
        </div>
        <div v-else>
          <CardNavView
            :id="`doc-${docData.details.id}`"
            :title="docData.details.title"
            title-icon="tabler:file-text"
            @clickToView="setView(docData.details)"
          />
        </div>
        <div v-for="(template, sub_index) in documentTemplates" :key="`${index}-${sub_index}`">
          <CardNavView
            :id="`doc-${index}-${sub_index}`"
            :title="template.title"
            title-icon="tabler:file-text"
            @clickToView="setView(template)"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CardNavView from '@/views/Components/CardNavView.vue'
import FormatDocumentTree from '@/views/modules/app-setup/FormatDocumentTree.vue'

export default {
  components: {
    CardNavView,
    FormatDocumentTree
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setView(template) {
      this.$emit('viewDocument', template)
    }
  }
}
</script>
