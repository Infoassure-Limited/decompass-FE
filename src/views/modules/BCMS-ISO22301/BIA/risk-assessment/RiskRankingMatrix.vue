<template>
  <div>
    <div v-if="matrix === '3x3'">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <td rowspan="5"> Likelihood </td>
            <td rowspan="2"></td>
            <td colspan="3"> Impact </td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>3</td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
          </tr>
          <tr>
            <td>2</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: red"></td>
          </tr>
          <tr>
            <td>1</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered">
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
            <td> All risk values &gt; 2 but &lt;= 5 (Line Manager action/decision required)</td>
          </tr>
          <tr>
            <td style="color: #000000; background: green"> Low </td>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            <td
              >All risk values &gt;=1 but &lt; 3 (no action required however recommended for
              improvement to Line Manager)</td
            >
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="matrix === '5x5'">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <td rowspan="7"> Likelihood </td>
            <td rowspan="2"></td>
            <td colspan="5"> Impact </td>
          </tr>
          <tr>
            <td>1-Improbable</td>
            <td>2-Unlikely</td>
            <td>3-Moderate</td>
            <td>4-Very Likely</td>
            <td>5-Almost Certain</td>
          </tr>
          <tr>
            <td>5-Very High</td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
          </tr>
          <tr>
            <td>4-High</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
          </tr>
          <tr>
            <td>3-Moderate</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: red"></td>
            <td style="color: #000000; background: red"></td>
          </tr>
          <tr>
            <td>2-Slight</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: yellow"></td>
            <td style="color: #000000; background: yellow"></td>
          </tr>
          <tr>
            <td>1-Negligible</td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: green"></td>
            <td style="color: #000000; background: yellow"></td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered">
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
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td colspan="3"> Confidentiality Requirement Level </td>
        </tr>
        <tr>
          <td>Value</td>
          <td>Ranking</td>
          <td>Guideline/Description</td>
        </tr>
        <tr>
          <td>1</td>
          <td>Low</td>
          <td
            >The impact of unauthorized disclosure of such information shall not harm organisation
            in anyway.</td
          >
        </tr>
        <tr>
          <td>2</td>
          <td>Medium</td>
          <td
            >The unauthorized disclosure of information here can cause a limited harm to the
            organization.</td
          >
        </tr>
        <tr>
          <td>3</td>
          <td>High</td>
          <td
            >The unauthorized disclosure of such information can cause severe harm (e.g. legal or
            financial liability, adverse competitive impact, loss of brand name).</td
          >
        </tr>
      </tbody>
    </table>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td colspan="3"> Integrity Requirement Level </td>
        </tr>
        <tr>
          <td>Value</td>
          <td>Ranking</td>
          <td>Guideline/Description</td>
        </tr>
        <tr>
          <td>1</td>
          <td>Low</td>
          <td
            >There is no impact on business if the accuracy and completeness of data is degraded</td
          >
        </tr>
        <tr>
          <td>2</td>
          <td>Medium</td>
          <td
            >There is minimal impact on the business if the accuracy and completeness of data is
            degraded.</td
          >
        </tr>
        <tr>
          <td>3</td>
          <td>High</td>
          <td
            >There is severe impact on business if the asset if the accuracy and completeness of
            data is degraded.</td
          >
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    matrix: {
      type: String,
      default: '3x3'
    }
  }
}
</script>
