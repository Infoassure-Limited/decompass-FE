import Editor from './src/Editor.vue'
// import Editor from './src/SuncFusionEditor.vue'
import { IDomEditor } from '@wangeditor/editor'

export interface EditorExpose {
  getEditorRef: () => Promise<IDomEditor>
}

export { Editor }
