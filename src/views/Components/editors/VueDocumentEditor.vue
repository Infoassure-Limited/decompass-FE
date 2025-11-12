<template>
  <div v-loading="loading" element-loading-text="loading document, please wait...">
    <div>
      <el-tooltip class="item" effect="dark" content="Save" placement="top-start">
        <el-button type="success" size="mini" :disabled="disableButton" @click="saveFile">
          <icon icon="tabler:device-floppy" />
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Download" placement="top-start">
        <el-button type="primary" size="mini" :disabled="disableButton" @click="downloadFile">
          <icon icon="tabler:download" />
        </el-button>
      </el-tooltip>
    </div>

    <ejs-documenteditorcontainer
      ref="doceditcontainer"
      height="500px"
      :service-url="serviceUrl"
      :toolbar-items="items"
      :enable-toolbar="true"
      :enable-sfdt-export="true"
      :enable-word-export="true"
      :enable-selection="true"
      :enable-editor="true"
      :isReadOnly="true"
    />
  </div>
</template>
<script>
// import {
//   DocumentEditorComponent,
//   Print,
//   SfdtExport,
//   WordExport,
//   TextExport,
//   Selection,
//   Search,
//   Editor,
//   ImageResizer,
//   EditorHistory,
//   ContextMenu,
//   OptionsPane,
//   HyperlinkDialog,
//   TableDialog,
//   BookmarkDialog,
//   TableOfContentsDialog,
//   PageSetupDialog,
//   StyleDialog,
//   ListDialog,
//   ParagraphDialog,
//   BulletsAndNumberingDialog,
//   FontDialog,
//   TablePropertiesDialog,
//   BordersAndShadingDialog,
//   TableOptionsDialog,
//   CellOptionsDialog,
//   StylesDialog
// } from '@syncfusion/ej2-vue-documenteditor'
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-vue-documenteditor'

import Resource from '@/api/resource'
export default {
  components: {
    'ejs-documenteditorcontainer': DocumentEditorContainerComponent
  },
  props: {
    documentPath: {
      type: String,
      default: ''
    },
    documentTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disableButton: true,
      loading: false,
      serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/',
      items: [
        // 'New',
        // 'Open',
        'Separator',
        'Undo',
        'Redo',
        'Separator',
        'Comments',
        'Find',
        'Separator',
        'Image',
        'Table',
        'Hyperlink',
        'Separator',
        'Header',
        'Footer',
        'Break' /* 'TableOfContents', 'Bookmark',  'PageSetup', 'PageNumber', 'Separator', 'LocalClipboard', 'RestrictEditing', */
      ]
    }
  },
  provide: {
    DocumentEditorContainer: [Toolbar]
    // Inject require modules.
    // DocumentEditor: [
    //   Print,
    //   SfdtExport,
    //   WordExport,
    //   TextExport,
    //   Selection,
    //   Search,
    //   Editor,
    //   ImageResizer,
    //   EditorHistory,
    //   ContextMenu,
    //   OptionsPane,
    //   HyperlinkDialog,
    //   TableDialog,
    //   BookmarkDialog,
    //   TableOfContentsDialog,
    //   PageSetupDialog,
    //   StyleDialog,
    //   ListDialog,
    //   ParagraphDialog,
    //   BulletsAndNumberingDialog,
    //   FontDialog,
    //   TablePropertiesDialog,
    //   BordersAndShadingDialog,
    //   TableOptionsDialog,
    //   CellOptionsDialog,
    //   StylesDialog
    // ]
  },
  mounted() {
    this.fetchSFDTFile()
  },
  methods: {
    openFileButtonClickHandler() {
      console.log('Open file button clicked')
      this.$refs.fileUpload.click()
    },
    fetchSFDTFile() {
      this.loading = true
      const formData = {
        path: this.documentPath
      }
      const fetchResource = new Resource('format-doc-to-sfdt')
      fetchResource
        .list(formData)
        .then((response) => {
          // open the SFDT text in Document Editor
          this.$refs.doceditcontainer.ej2Instances.documentEditor.open(response)
          this.loading = false
          this.disableButton = false
        })
        .catch((e) => {
          this.loading = false
          this.disableButton = true
          // console.log(e.response.data.message)
          this.$message({ message: e.response.data.message, type: 'error' })
        })
    },
    downloadFile() {
      // Download the document in docx format.
      this.$refs.doceditcontainer.ej2Instances.documentEditor.save(this.documentTitle, 'Docx')
    },
    // onFileUpload(e) {
    //   if (e.target.files[0]) {
    //     const file = e.target.files[0]
    //     if (file.name.substr(file.name.lastIndexOf('.')) === '.docx') {
    //       const fileReader = new FileReader()
    //       // eslint-disable-next-line no-shadow
    //       fileReader.onload = e => {
    //         const contents = e.target.result
    //         // Open the default document in Document Editor.
    //         this.$refs.doceditcontainer.ej2Instances.documentEditor.open(contents)
    //       }
    //       fileReader.readAsText(file)
    //     }
    //   }
    // },

    saveFile() {
      this.$confirm('This will overwrite the existing document. Continue?', 'Warning', {
        confirmButtonText: 'Yes, Please',
        cancelButtonText: 'No, Abort',
        type: 'warning'
      })
        .then(() => {
          this.$refs.doceditcontainer.ej2Instances.documentEditor
            .saveAsBlob('Docx')
            .then((exportedDocument) => {
              // The blob can be processed further
              const formData = new FormData()
              formData.append('file_to_be_saved', exportedDocument)
              formData.append('path', this.documentPath)
              this.saveDocBlob(formData)
            })
        })
        .catch(() => {})
    },
    saveDocBlob(formData) {
      this.loading = true
      const saveResource = new Resource('save-doc-template')
      saveResource
        .store(formData)
        .then((response) => {
          // open the SFDT text in Document Editor
          this.$message(response.message)
          // this.$refs.doceditcontainer.ej2Instances.documentEditor.open(response)
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
<style>
@import '../../../styles/ej2-base/buttons.css';
@import '../../../styles/ej2-base/inputs.css';
@import '../../../styles/ej2-base/popups.css';
@import '../../../styles/ej2-base/lists.css';
@import '../../../styles/ej2-base/navigations.css';
@import '../../../styles/ej2-base/splitbuttons.css';
@import '../../../styles/ej2-base/dropdowns.css';
@import '../../../styles/ej2-base/base.css';
@import '../../../styles/ej2-base/doc-editor-material.css';
/* @import '@/styles/ej2-base/doc-editor-material.css' */
</style>
