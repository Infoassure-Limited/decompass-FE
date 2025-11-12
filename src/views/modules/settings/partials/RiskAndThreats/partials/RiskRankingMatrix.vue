<template>
  <el-card>
    <template v-slot:header>
      <div class="clearfix">
        <!-- <h1
        style="cursor: pointer"
        class="pull-right"
        @click="toggleDescription"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="View Description"
          placement="top-start"
        >
          <i class="el-icon-info" />
        </el-tooltip>
      </h1> -->
        <strong>Risk Heat Map ({{ matrix }} Matrix)</strong>
      </div>
    </template>
    <div v-if="matrix === '3x3'">
      <table class="table table-sm table-bordered">
        <tbody>
          <tr>
            <td rowspan="2">Likelihood</td>
            <td colspan="3"> Impact </td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>3</td>
            <td style="color: #000000; background: yellow"> 3 </td>
            <td style="color: #000000; background: red"> 6 </td>
            <td style="color: #000000; background: red"> 9 </td>
          </tr>
          <tr>
            <td>2</td>
            <td style="color: #000000; background: green"> 2 </td>
            <td style="color: #000000; background: yellow"> 4 </td>
            <td style="color: #000000; background: red"> 6 </td>
          </tr>
          <tr>
            <td>1</td>
            <td style="color: #000000; background: green"> 1 </td>
            <td style="color: #000000; background: green"> 2 </td>
            <td style="color: #000000; background: yellow"> 3 </td>
          </tr>
        </tbody>
      </table>
      <table v-if="showDescription" class="table table-sm table-bordered">
        <tbody>
          <tr>
            <td> Risk Rating Scale </td>
            <td> Description </td>
          </tr>
          <tr>
            <td style="color: #000000; background: red"> High </td>
            <td>All risk value &gt; 5 (Management Action/decision required for risk treatment)</td>
          </tr>
          <tr>
            <td style="color: #000000; background: yellow"> Medium </td>
            <td> All risk values &gt;= 3 but &lt;= 5 (Line Manager action/decision required)</td>
          </tr>
          <tr>
            <td style="color: #000000; background: green"> Low </td>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            <td
              >All risk values &gt;=1 but &lt;= 2 (no action required however recommended for
              improvement to Line Manager)</td
            >
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="matrix === '5x5'">
      <table class="table table-sm table-bordered">
        <tbody>
          <tr>
            <td rowspan="2">Likelihood</td>
            <td colspan="5"> Impact </td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
          </tr>
          <tr>
            <td>5</td>
            <td style="color: #000000; background: yellow"> 5 </td>
            <td style="color: #000000; background: yellow"> 10 </td>
            <td style="color: #000000; background: red"> 15 </td>
            <td style="color: #000000; background: red"> 20 </td>
            <td style="color: #000000; background: red"> 25 </td>
          </tr>
          <tr>
            <td>4</td>
            <td style="color: #000000; background: green"> 4 </td>
            <td style="color: #000000; background: yellow"> 8 </td>
            <td style="color: #000000; background: red"> 12 </td>
            <td style="color: #000000; background: red"> 16 </td>
            <td style="color: #000000; background: red"> 20 </td>
          </tr>
          <tr>
            <td>3</td>
            <td style="color: #000000; background: green"> 3 </td>
            <td style="color: #000000; background: yellow"> 6 </td>
            <td style="color: #000000; background: yellow"> 9 </td>
            <td style="color: #000000; background: red"> 12 </td>
            <td style="color: #000000; background: red"> 15 </td>
          </tr>
          <tr>
            <td>2</td>
            <td style="color: #000000; background: green"> 2 </td>
            <td style="color: #000000; background: green"> 4 </td>
            <td style="color: #000000; background: yellow"> 6 </td>
            <td style="color: #000000; background: yellow"> 8 </td>
            <td style="color: #000000; background: yellow"> 10 </td>
          </tr>
          <tr>
            <td>1</td>
            <td style="color: #000000; background: green"> 1 </td>
            <td style="color: #000000; background: green"> 2 </td>
            <td style="color: #000000; background: green"> 3 </td>
            <td style="color: #000000; background: green"> 4 </td>
            <td style="color: #000000; background: yellow"> 5 </td>
          </tr>
        </tbody>
      </table>
      <table v-if="showDescription" class="table table-sm table-bordered">
        <tbody>
          <tr>
            <td> Risk Rating Scale </td>
            <td> Description </td>
          </tr>
          <tr>
            <td style="color: #000000; background: red"> High </td>
            <td
              >All risk value &gt;= 12 (Management Action/decision required for risk treatment)</td
            >
          </tr>
          <tr>
            <td style="color: #000000; background: yellow"> Medium </td>
            <td> All risk values &gt;= 5 but &lt;= 11 (Line Manager action/decision required)</td>
          </tr>
          <tr>
            <td style="color: #000000; background: green"> Low </td>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            <td
              >All risk values &gt;=1 but &lt;= 4 (no action required however recommended for
              improvement to Line Manager)</td
            >
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div v-if="showDescription">

      <table class="table table-bordered">
        <tbody>
          <tr>
            <td colspan="3">
              Confidentiality Requirement Level
            </td>
          </tr>
          <tr>
            <td>Value</td>
            <td>Ranking</td>
            <td>Guideline/Description</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Low</td>
            <td>The impact of unauthorized disclosure of such information shall not harm organisation in anyway.</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Medium</td>
            <td>The unauthorized disclosure of information here can cause a limited harm to the organization.</td>
          </tr>
          <tr>
            <td>3</td>
            <td>High</td>
            <td>The unauthorized disclosure of such information can cause severe harm (e.g. legal or financial liability, adverse competitive impact, loss of brand name).</td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered">
        <tbody>
          <tr>
            <td colspan="3">
              Integrity Requirement Level
            </td>
          </tr>
          <tr>
            <td>Value</td>
            <td>Ranking</td>
            <td>Guideline/Description</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Low</td>
            <td>There is no impact on business if the accuracy and completeness of data is degraded</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Medium</td>
            <td>There is minimal impact on the business if the accuracy and completeness of data is degraded.</td>
          </tr>
          <tr>
            <td>3</td>
            <td>High</td>
            <td>There is severe impact on business if the asset if the accuracy and completeness of data is degraded.</td>
          </tr>
        </tbody>
      </table>
    </div> -->
  </el-card>
</template>
<script>
export default {
  props: {
    matrix: {
      type: String,
      default: () => '3x3'
    }
  },
  data() {
    return {
      showDescription: false
    }
  },
  methods: {
    toggleDescription() {
      this.showDescription = !this.showDescription
    }
  }
}
</script>
