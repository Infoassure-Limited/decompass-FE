<template>
  <el-row v-if="invoice !== null" :gutter="10">
    <el-col :md="17">
      <div style="border: #f0f0f0 4px solid; padding: 10px; border-radius: 5px">
        <el-row>
          <el-col :md="12">
            <p><strong>Invoice No.:</strong> {{ invoice.invoice_no }}</p>
            <p><strong>Due Date:</strong> {{ invoice.due_date }}</p>
          </el-col>
          <el-col :md="12">
            <div style="text-align: right">
              <p>
                <strong>Approval Status:</strong>
                {{
                  invoice.invoice_approval !== null && invoice.invoice_approval.action === 'Approve'
                    ? 'Approved'
                    : invoice.invoice_approval !== null &&
                        invoice.invoice_approval.action === 'Reject'
                      ? 'Rejected'
                      : 'Pending'
                }}
                <br />
                <small v-if="invoice.invoice_approval !== null"
                  ><em>{{ invoice.invoice_approval.details }}</em></small
                >
              </p>
              <p
                ><strong>Approval Date:</strong>
                {{
                  invoice.invoice_approval !== null ? invoice.invoice_approval.date : 'Pending'
                }}</p
              >
              <div v-if="invoice.status === 'Paid'">
                <strong>Payment Status:</strong>
                <el-tag v-if="invoice.is_confirmed === 0" type="warning"
                  >Awaiting Confirmation from vendor</el-tag
                >
                <el-tag v-if="invoice.is_confirmed === 1" type="success">Payment Confirmed</el-tag>
              </div>
            </div>
          </el-col>
          <el-col v-if="invoice.invoice_items.length < 1" :md="24">
            <div>
              <p v-if="invoice.discount > 0">
                <strong>Discount:</strong> {{ currency }}
                {{ Number(invoice.discount).toLocaleString() }}
              </p>
              <p
                ><strong>Amount:</strong> {{ currency }}
                {{ Number(invoice.amount).toLocaleString() }}</p
              >
              <p><strong>In Words:</strong> {{ inWords(invoice.amount).toUpperCase() }}</p>
            </div>
          </el-col>
        </el-row>
        <div v-if="invoice.invoice_items.length > 0">
          <h4><em>Invoice Item Details</em></h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoice.invoice_items" :key="index">
                <td>{{ item.description }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ currency }}{{ Number(item.rate).toLocaleString() }}</td>
                <td align="right"> {{ currency }}{{ Number(item.amount).toLocaleString() }} </td>
              </tr>
              <tr>
                <td colspan="3" align="right">
                  <strong>Subtotal</strong>
                </td>
                <td align="right">
                  {{ currency }}{{ Number(invoice.subtotal).toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td colspan="3" align="right">
                  <strong>Discount</strong>
                </td>
                <td align="right">
                  {{ currency }}{{ Number(invoice.discount).toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td colspan="3" align="right">
                  <strong>Grand Total</strong>
                </td>
                <td align="right"> {{ currency }}{{ Number(invoice.amount).toLocaleString() }} </td>
              </tr>
              <tr>
                <td colspan="4" align="right">
                  <p><strong>In Words:</strong> {{ inWords(invoice.amount).toUpperCase() }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-row :gutter="10">
          <el-col v-if="invoice.invoice_link !== null" :md="24">
            <h4>Uploaded Invoice</h4>
            <iframe
              class="pdf"
              :src="baseServerUrl + 'storage/' + invoice.invoice_link"
              width="600"
              height="500"
            ></iframe>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :md="7">
      <aside>
        <div>
          <span v-if="invoice.status === 'Pending' || invoice.status === 'Overdue'">
            <div v-if="invoice.invoice_approval === null">
              <strong>Invoice Approval Actions</strong>
              <el-button type="success" @click="approveInvoice(invoice, 'Approve')">
                Click to Approve
              </el-button>
              &nbsp;
              <el-popover placement="right" width="500" trigger="click">
                <div
                  style="
                    background: #333333;
                    color: #ffffff;
                    padding: 10px;
                    text-align: left;
                    border-radius: 5px;
                  "
                >
                  <strong>Give reasons for rejection</strong>
                  <el-input
                    v-model="approvalForm.details"
                    placeholder="Type reason here..."
                    type="textarea"
                  />
                  <br /><br />
                  <el-button
                    :loading="approvalLoading"
                    size="mini"
                    type="primary"
                    plain
                    :disabled="approvalForm.details === ''"
                    @click="approveInvoice(invoice, 'Reject')"
                  >
                    Submit
                  </el-button>
                </div>
                <template v-slot:reference>
                  <el-button type="danger"> Click to Reject </el-button>
                </template>
              </el-popover>
            </div>
            <div v-else>
              <el-button
                v-if="invoice.invoice_approval.action === 'Reject'"
                type="success"
                @click="approveInvoice(invoice, 'Approve')"
              >
                Click to Approve
              </el-button>
              &nbsp;
              <el-popover placement="right" width="500" trigger="click">
                <div
                  style="
                    background: #333333;
                    color: #ffffff;
                    padding: 10px;
                    text-align: left;
                    border-radius: 5px;
                  "
                >
                  <strong>Give reasons for rejection</strong>
                  <el-input
                    v-model="approvalForm.details"
                    placeholder="Type reason here..."
                    type="textarea"
                  />
                  <br /><br />
                  <el-button
                    :loading="approvalLoading"
                    size="mini"
                    type="primary"
                    plain
                    :disabled="approvalForm.details === ''"
                    @click="approveInvoice(invoice, 'Reject')"
                  >
                    Submit
                  </el-button>
                </div>
                <template v-slot:reference>
                  <el-button v-if="invoice.invoice_approval === null" type="danger">
                    Click to Reject
                  </el-button>
                </template>
              </el-popover>
            </div>
          </span>
          <div>
            <span v-if="invoice.invoice_approval !== null">
              <span v-if="invoice.invoice_approval.action === 'Approve'">
                <p v-if="invoice.status !== 'Paid'">
                  <el-button type="text" icon="el-icon-money" @click="makePayment(invoice)">
                    Mark Invoice as Paid
                  </el-button>
                </p>

                <!-- <div v-if="invoice.status === 'Paid'">
                  <el-tag
                    v-if="invoice.is_confirmed === 0"
                    type="warning"
                  >Awaiting Confirmation from vendor</el-tag>
                  <el-tag
                    v-if="invoice.is_confirmed === 1"
                    type="success"
                  >Payment Confirmed</el-tag>
                </div> -->

                <el-popover
                  placement="bottom"
                  title="Upload payment evidence"
                  width="400"
                  trigger="hover"
                >
                  <small>Acceptable file formats are .pdf, .jpg & .png</small>
                  <input
                    class="form-control"
                    type="file"
                    @change="onImageChange($event, invoice.id)"
                  />
                  <template v-slot:reference>
                    <el-button
                      v-if="invoice.payment_evidence === null"
                      type="text"
                      icon="el-icon-upload2"
                      >Upload payment evidence</el-button
                    >
                  </template>
                </el-popover>
              </span>
            </span>
          </div>
        </div>

        <div v-if="invoice.payment_evidence !== null">
          <h4>Uploaded payment evidence</h4>
          <div style="overflow: auto">
            <iframe
              class="pdf"
              :src="baseServerUrl + 'storage/' + invoice.payment_evidence"
              height="500"
            ></iframe>
          </div>
        </div>
      </aside>
    </el-col>
  </el-row>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    selectedInvoice: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      currency: '₦',
      approvalLoading: false,
      approvalAction: null,
      approvalForm: {
        details: '',
        action: ''
      },
      invoice: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.invoice = this.selectedInvoice
  },
  methods: {
    onImageChange(e, invoiceId) {
      console.log(e.target.files[0].type)
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
        this.$alert('Acceptable file formats are .pdf, .jpg & .png')
        return false
      }
      this.loading = true
      const formData = new FormData()
      formData.append('invoice_id', invoiceId)
      formData.append('file_uploaded', e.target.files[0])
      const uploadEvidenceResource = new Resource('vdd/invoices/upload-payment-evidence')
      uploadEvidenceResource
        .store(formData)
        .then((response) => {
          this.$message({
            type: 'success',
            message: 'Evidence uploaded successfully'
          })
          this.invoice = response.invoice
          this.loading = false
        })
        .catch((this.loading = false))
      return true
    },
    approveInvoice(invoice, action) {
      this.$confirm(`This will ${action} invoice ${invoice.invoice_no}. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.approvalLoading = true
          const form = this.approvalForm
          form.action = action
          const approveInvoiceResource = new Resource('vdd/approve-invoice')
          approveInvoiceResource
            .update(invoice.id, form)
            .then((response) => {
              this.$message({ message: 'Action Successful', type: 'success' })
              this.invoice = response.invoice
              this.approvalLoading = false
            })
            .catch((this.approvalLoading = false))
        })
        .catch()
    },
    makePayment(invoice) {
      this.$confirm(
        `This will attest that you have actually made payment for invoice ${invoice.invoice_no}. Continue?`,
        'Warning',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          const fetchStaffResource = new Resource('vdd/invoices/make-payment')
          fetchStaffResource
            .update(invoice.id)
            .then((response) => {
              this.invoice = response.invoice
              this.$message({
                type: 'success',
                message: 'Payment Confirmed Successfully'
              })
              this.fetchInvoices()
              this.loading = false
            })
            .catch((this.loading = false))
        })
        .catch()
    },
    inWords(n, decimal = false) {
      const num2word = n.toString()
      const num2wordArray = num2word.split('.')
      const wholeNo = num2wordArray[0]
      const decNo = num2wordArray[1]
      let string = wholeNo
      let start
      let end
      let chunk
      let ints
      let i
      let word
      const and = 'and'

      /* Remove spaces and commas */
      string = string.replace(/[, ]/g, '')

      /* Is number zero? */
      if (parseInt(string) === 0) {
        return 'zero'
      }

      /* Array of units as words */
      const units = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen'
      ]

      /* Array of tens as words */
      const tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety'
      ]

      /* Array of scales as words */
      const scales = [
        '',
        'thousand',
        'million,',
        'billion,',
        'trillion,',
        'quadrillion,',
        'quintillion',
        'sextillion',
        'septillion',
        'octillion',
        'nonillion',
        'decillion',
        'undecillion',
        'duodecillion',
        'tredecillion',
        'quatttuor-decillion',
        'quindecillion',
        'sexdecillion',
        'septen-decillion',
        'octodecillion',
        'novemdecillion',
        'vigintillion',
        'centillion'
      ]

      /* Split user argument into 3 digit chunks from right to left */
      start = string.length
      const chunks = []
      while (start > 0) {
        end = start
        chunks.push(string.slice((start = Math.max(0, start - 3)), end))
      }

      /* Check if function has enough scale words to be able to stringify the user argument */
      const chunksLen = chunks.length
      if (chunksLen > scales.length) {
        return ''
      }

      /* Stringify each integer in each chunk */
      const words = []

      for (i = 0; i < chunksLen; i++) {
        chunk = parseInt(chunks[i])

        if (chunk) {
          /* Split chunk into array of individual integers */
          ints = chunks[i].split('').reverse().map(parseFloat)

          /* If tens integer is 1, i.e. 10, then add 10 to units integer */
          if (ints[1] === 1) {
            ints[0] += 10
          }

          /* Add scale word if chunk is not zero and array item exists */

          if ((word = scales[i])) {
            words.push(word)
          }

          /* Add unit word if array item exists */

          if ((word = units[ints[0]])) {
            words.push(word)
          }

          /* Add tens word if array item exists */

          if ((word = tens[ints[1]])) {
            words.push(word)
          }

          /* Add 'and' string after units or tens integer if: */
          if (ints[0] || ints[1]) {
            /* Chunk has a hundreds integer or chunk is the first of multiple chunks */

            if (ints[2] || (!i && chunksLen)) {
              words.push(and)
            }
          }

          /* Add hundreds word if array item exists */

          if ((word = units[ints[2]])) {
            words.push(`${word} hundred`)
          }
        }
      }
      let decimalWords = ''
      let currencyFraction = 'NAIRA'
      if (decimal) {
        currencyFraction = 'KOBO'
      }
      const wholeNumWords = `${words.reverse().join(' ')} ${currencyFraction}`
      if (decNo !== undefined && decNo !== null && decNo !== '') {
        decimalWords = this.inWords(parseInt(decNo), true)
      }
      return `${wholeNumWords + decimalWords} ONLY`
    }
  }
}
</script>
