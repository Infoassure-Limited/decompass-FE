<template>
  <div style="overflow: auto">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> REF </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> DEPARTMENT/UNIT </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> NAME AND CONTACT DETAILS OF CONTROLLER </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> NAME AND CONTACT DETAILS OF JOINT CONTROLLER </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px">
              NAME AND CONTACT DETAILS OF CONTROLLER'S REPRESENTATIVE
            </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> NAME AND CONTACT DETAILS OF DATA PROTECTION OFFICER </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> PURPOSES OF THE PROCESSING </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> CATEGORIES OF DATA SUBJECTS </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> CATEGORIES OF PERSONAL DATA </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> CATEGORIES OF RECIPIENTS DATA IS DISCLOSED TO </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 100px"> INTERNATIONAL TRANSFER DESTINATION </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> TIME LIMITS FOR ERASURE </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> TECHNICAL AND ORGANISATIONAL SECURITY MEASURES APPLIED </div>
          </th>
          <th
            data-fill-color="666666"
            data-b-a-s="thin"
            data-f-color="ffffff"
            style="font-size: 14px"
            data-f-sz="12"
          >
            <div style="width: 250px"> COMMENTS </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in tableData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ report.business_unit }}</td>
          <td
            >{{ report.controller_name }}
            -
            <small>{{ report.controller_contact_details }}</small>
          </td>
          <td
            >{{ report.joint_controller_name }}
            -
            <small>{{ report.joint_controller_contact_details }}</small>
          </td>
          <td
            >{{ report.controller_rep_name }}
            -
            <small>{{ report.controller_rep_contact_details }}</small>
          </td>
          <td
            >{{ report.dpo_name }}
            -
            <small>{{ report.dpo_details }}</small>
          </td>
          <td>
            {{ report.processing_purpose }}
          </td>
          <td>
            {{ report.data_subject_categories }}
          </td>
          <td>
            {{ report.personal_data_categories }}
          </td>
          <td>
            {{ report.data_recipients_categories }}
          </td>
          <td>
            {{ report.international_transfer_destination }}
          </td>
          <td>
            {{ report.erasure_time_limit }}
          </td>
          <td>
            {{ report.security_measures_applied }}
          </td>
          <td>
            {{ report.comments }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      required: true
    }
  }
}
</script>
