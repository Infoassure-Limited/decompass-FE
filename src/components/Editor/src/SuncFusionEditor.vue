<template>
  <div>
    <div class="control-section">
      <div class="sample-container">
        <div class="default-section">
          <ejs-richtexteditor ref="rte_instance" id="rte1" v-model="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  RichTextEditorComponent,
  Toolbar,
  Link,
  Image,
  HtmlEditor
} from '@syncfusion/ej2-vue-richtexteditor'
export default {
  name: 'NormalView',
  components: {
    'ejs-richtexteditor': RichTextEditorComponent
  },
  data: function () {
    return {
      value:
        '<p>The Rich Text Editor component is a WYSIWYG editor that provides the best user experience to create and update the content. Users can format their content using standard toolbar commands.</p>'
    }
  },
  provide: {
    richtexteditor: [Toolbar, Link, Image, HtmlEditor]
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
