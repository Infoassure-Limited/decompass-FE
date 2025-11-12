<template>
  <div class="app-container">
    <div>
      <div class="box">
        <div class="box-body">
          <el-form ref="form" v-loading="loadForm" :model="form" label-width="120px">
            <el-row :gutter="5" class="padded">
              <el-col :xs="24" :sm="12" :md="12">
                <label for>Select File (.pdf extension only)</label>
                <input class="form-control" type="file" @change="onImageChange" />
              </el-col>
              <el-col :xs="24" :sm="12" :md="12">
                <label for>Invoice Number in the file</label>
                <el-input
                  v-model="form.invoice_no"
                  placeholder="Enter invoice number"
                  class="span"
                  :disabled="form.uploadedInvoice === null"
                />
              </el-col>
            </el-row>
            <el-row :gutter="5" class="padded">
              <el-col :xs="24" :sm="12" :md="12">
                <label for>Total payable amount in the file</label>
                <el-input
                  v-model="form.amount"
                  type="number"
                  outline
                  :disabled="form.uploadedInvoice === null"
                >
                  <template v-slot:prepend>
                    {{ currency }}
                  </template>
                </el-input>
                <strong style="color: green">
                  {{ currency }}{{ Number(form.amount).toLocaleString() }}
                </strong>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12">
                <label for>Invoice Due Date</label>
                <el-date-picker
                  v-model="form.due_date"
                  type="date"
                  placeholder="Invoice Due Date"
                  style="width: 100%"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  :disabled="form.uploadedInvoice === null"
                />
              </el-col>
            </el-row>
            <el-row :gutter="2" class="padded">
              <el-col :xs="24" :sm="24" :md="24">
                <div align="right">
                  <div>
                    <el-button type="success" @click="submitNewInvoice">
                      <i class="el-icon-plus"></i>
                      Submit Invoice
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Resource from '@/api/resource'

export default {
  // name: 'CreateInvoice',
  props: {
    vendorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate()) // one year from now
          return date > d
        }
      },
      currency: '₦',
      upload_type: 'normal',
      // customers: [],
      // customer_types: [],
      items_in_stock_dialog: false,
      dialogFormVisible: false,
      userCreating: false,
      loadPreview: false,
      fill_fields_error: false,
      show_product_list: false,
      loadForm: false,
      disable_submit: false,
      can_submit: false,
      form: {
        invoice_no: '',
        due_date: '',
        amount: 0,
        uploadedInvoice: null
      },
      empty_form: {
        invoice_no: '',
        due_date: '',
        amount: 0,
        uploadedInvoice: null
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    moment,
    checkPermission,
    checkRole,
    onImageChange(e) {
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf') {
        this.$alert('Only .pdf file format is acceptable.')
        return false
      }

      this.form.uploadedInvoice = e.target.files[0]
      return true
    },
    submitNewInvoice() {
      const formData = new FormData()
      formData.append('invoice_no', this.form.invoice_no)
      formData.append('due_date', this.form.due_date)
      formData.append('amount', this.form.amount)
      formData.append('file_uploaded', this.form.uploadedInvoice)
      formData.append('vendor_id', this.vendorId)
      const { form } = app
      const checkEmptyFields =
        this.form.due_date === '' || this.form.invoice_no === '' || this.form.amount === 0
      if (!checkEmptyFields) {
        this.loadForm = true
        form.vendor_id = this.vendorId
        this.disable_submit = true
        const createInvoice = new Resource('vdd/invoices/upload-invoice')
        createInvoice
          .vStore(formData)
          .then(() => {
            this.$emit('saved')
            this.$message({
              message: 'Invoice Created Successfully!!!',
              type: 'success'
            })
            this.form = this.empty_form

            this.disable_submit = false
            this.loadForm = false
          })
          .catch((error) => {
            this.loadForm = false
            console.log(error.message)
          })
      } else {
        this.$alert('Please fill the form fields completely')
      }
    },
    calculateTotal(index) {
      // Get total amount for this item without tax
      if (index !== null) {
        const { quantity } = this.invoice_items[index]
        const unitRate = this.invoice_items[index].rate
        this.invoice_items[index].amount = parseFloat(quantity * unitRate).toFixed(2) // + parseFloat(tax);
      }

      // we now calculate the running total of items invoiceed for with tax //////////
      // let total_tax = 0;
      let subtotal = 0

      for (let count = 0; count < this.invoice_items.length; count++) {
        // const tax_rate = this.invoice_items[count].tax;
        // const quantity = this.invoice_items[count].quantity;
        // const unit_rate = this.invoice_items[count].rate;
        // total_tax += parseFloat(tax_rate * quantity * unit_rate);
        subtotal += parseFloat(this.invoice_items[count].amount)
      }
      // this.form.tax = total_tax.toFixed(2);
      this.form.subtotal = subtotal.toFixed(2)
      //   this.form.discount = parseFloat(
      //     (this.discount_rate / 100) * subtotal,
      //   ).toFixed(2)
      // subtract discount
      this.form.amount = parseFloat(subtotal - this.form.discount).toFixed(2)
    },
    previewInvoice() {
      this.$alert(this.form)
    }
  }
}
</script>
