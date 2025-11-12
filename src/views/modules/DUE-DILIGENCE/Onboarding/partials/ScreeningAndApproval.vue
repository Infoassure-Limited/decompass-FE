<template>
  <el-card>
    <div>
      <el-row>
        <el-col :md="16">
          <h3> Vendors Screening/Approval </h3>
        </el-col>
        <el-col :md="8">
          <el-select
            v-if="showVendorDetails"
            v-model="selectedVendor"
            v-loading="loading"
            filterable
            style="width: 100%"
            value-key="id"
            placeholder="Select Vendor"
            @change="setVendor()"
          >
            <el-option
              v-for="(vendor, index) in vendors"
              :key="index"
              :label="vendor.name"
              :value="vendor"
            />
          </el-select>
        </el-col>
      </el-row>
      <hr />
      <div v-if="showVendorDetails">
        <el-alert :closable="false">
          <h4>Details for {{ selectedVendor.name }}</h4>
        </el-alert>
        <el-row :gutter="10">
          <el-col :md="16">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td colspan="2" align="center">
                    <h3>GENERAL INFORMATION</h3>
                  </td>
                </tr>
                <tr>
                  <td><strong>Company Name</strong></td>
                  <td>{{ selectedVendor.name }}</td>
                </tr>
                <tr>
                  <td><strong>Business Type</strong></td>
                  <td>{{ selectedVendor.business_type }}</td>
                </tr>
                <tr>
                  <td><strong>Category</strong></td>
                  <td>
                    {{
                      selectedVendor.category_id !== null
                        ? selectedVendor.category.name
                        : 'Not Set'
                    }}<br />
                    <small v-if="selectedVendor.category_id !== null"
                      ><em>{{ selectedVendor.category.description }}</em></small
                    >
                  </td>
                </tr>
                <tr>
                  <td><strong>Company Registration Number</strong></td>
                  <td>{{ selectedVendor.reg_no }}</td>
                </tr>
                <tr>
                  <td><strong>Country of Incorporation</strong></td>
                  <td>{{ selectedVendor.country_of_incorporation }}</td>
                </tr>
                <tr>
                  <td><strong>Company Website</strong></td>
                  <td>{{ selectedVendor.website }}</td>
                </tr>
                <tr>
                  <td><strong>Number of years in business</strong></td>
                  <td>{{ selectedVendor.years_in_business }}</td>
                </tr>
                <tr>
                  <td><strong>Primary Contact Name</strong></td>
                  <td>{{ selectedVendor.contact_name }}</td>
                </tr>
                <tr>
                  <td><strong>Primary Contact Email</strong></td>
                  <td>{{ selectedVendor.contact_email }}</td>
                </tr>
                <tr>
                  <td><strong>Primary Contact Phone</strong></td>
                  <td>{{ selectedVendor.contact_phone }}</td>
                </tr>
                <tr>
                  <td><strong>Contact Address</strong></td>
                  <td>{{ selectedVendor.contact_address }}</td>
                </tr>
                <tr>
                  <td colspan="2" align="center">
                    <h3>Pre Screening Information</h3>
                  </td>
                </tr>
                <tr>
                  <td
                    ><strong
                      >Does company process, store, or transmit our organization's or customers'
                      sensitive information?</strong
                    ></td
                  >
                  <td>{{ selectedVendor.stores_sentivite_information === 1 ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                  <td
                    ><strong
                      >Does organization require direct access to our critical systems to perform
                      its services?</strong
                    ></td
                  >
                  <td>{{ selectedVendor.has_access_to_critical_systems === 1 ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                  <td
                    ><strong
                      >Would a disruption in organzation's services cause significant delays or
                      downtime in our business operations?</strong
                    ></td
                  >
                  <td>{{
                    selectedVendor.has_impact_on_business_operations === 1 ? 'Yes' : 'No'
                  }}</td>
                </tr>
                <!--BUSINESS INFO-->
                <tr>
                  <td colspan="2" align="center">
                    <h3>BUSINESS INFORMATION</h3>
                  </td>
                </tr>
                <template
                  v-if="
                    selectedVendor.stores_sentivite_information === 0 &&
                    selectedVendor.has_access_to_critical_systems === 0 &&
                    selectedVendor.has_impact_on_business_operations === 0
                  "
                >
                  <tr>
                    <td><strong>Products/Services Offered</strong></td>
                    <td>{{ selectedVendor.service_description }}</td>
                  </tr>
                  <tr>
                    <td
                      ><strong
                        >Has organization worked with similar organizations before</strong
                      ></td
                    >
                    <td>
                      {{ selectedVendor.work_with_similar_organization === 1 ? 'Yes' : 'No' }}
                      <div v-if="selectedVendor.work_with_similar_organization === 1"
                        ><br />
                        <em>
                          <small
                            ><strong>Provided References:</strong> <br />
                            {{
                              selectedVendor.references_to_working_with_similar_organizations
                            }}</small
                          >
                        </em>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Posesses Business Insurance</strong></td>
                    <td>
                      {{ selectedVendor.have_business_insurance === 1 ? 'Yes' : 'No' }}<br /><br />

                      <em
                        ><small v-if="selectedVendor.have_business_insurance === 1"
                          >View the list of uploaded documents for the Business Insurance</small
                        ></em
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Business License</strong></td>
                    <td>
                      <em>View the list of uploaded documents for the Business License</em>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Banking Details for Payment Processing</strong></td>
                    <td>
                      <p>
                        <strong>Bank Name: </strong>{{ selectedVendor.bank_detail.bank_name }}
                      </p>
                      <p>
                        <strong>Account Name: </strong>{{ selectedVendor.bank_detail.account_name }}
                      </p>
                      <p>
                        <strong>Account Number: </strong>{{ selectedVendor.bank_detail.account_no }}
                      </p>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="2" align="center"> Business & Operational Details </td>
                  </tr>
                  <tr>
                    <td><strong>List of major clients or industry recognitions</strong></td>
                    <td>{{ selectedVendor.list_of_clients_or_industry_recognitions }}</td>
                  </tr>
                  <tr>
                    <td><strong>Does Company subcontract any services?</strong></td>
                    <td>
                      {{ selectedVendor.does_subcontract_services === 1 ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                  <tr v-if="selectedVendor.does_subcontract_services === 1">
                    <td><strong>Details of services subcontracted</strong></td>
                    <td>
                      {{ selectedVendor.list_of_services_subcontracted }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center"> Regulatory & Compliance Information </td>
                  </tr>
                  <tr>
                    <td><strong>Upload of Industry Certifications</strong></td>
                    <td>
                      <em
                        >View the list of uploaded documents for applicable industry
                        certifications</em
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Has past regulatory compliance violation?</strong></td>
                    <td>
                      {{
                        selectedVendor.past_regulatory_compliance_violations === 1 ? 'Yes' : 'No'
                      }}
                    </td>
                  </tr>
                  <tr v-if="selectedVendor.past_regulatory_compliance_violations === 1">
                    <td><strong>Details of past regulatory compliance violations</strong></td>
                    <td>
                      {{ selectedVendor.details_of_compliance_violations }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Has an internal compliance team or officer?</strong></td>
                    <td>
                      {{ selectedVendor.internal_compliance_team_or_officer === 1 ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center"> Security & Risk Management </td>
                  </tr>
                  <tr>
                    <td><strong>Does organization have a formal cybersecurity policy?</strong></td>
                    <td>
                      {{ selectedVendor.have_formal_cybersecurity_policy === 1 ? 'Yes' : 'No' }}
                      <div v-if="selectedVendor.have_formal_cybersecurity_policy === 1"
                        ><br />
                        <em>Check for uploaded Cybersecurity Policy</em>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      ><strong
                        >Has the organization experienced a data breach in the past 3 years?</strong
                      ></td
                    >
                    <td>
                      {{ selectedVendor.have_recent_data_breach === 1 ? 'Yes' : 'No' }}
                      <div v-if="selectedVendor.have_formal_cybersecurity_policy === 1"
                        ><br />
                        <em>Check for uploaded Cybersecurity Policy</em>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedVendor.have_recent_data_breach === 1">
                    <td><strong>Explanation of the resolution process</strong></td>
                    <td>
                      {{ selectedVendor.data_breach_resolution_process }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      ><strong
                        >How organization ensure data protection and confidentiality</strong
                      ></td
                    >
                    <td>
                      {{ selectedVendor.ensure_data_protection_and_confidentiality }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      ><strong
                        >Does organization conduct background checks on employees?</strong
                      ></td
                    >
                    <td>
                      {{ selectedVendor.does_background_checks_on_employees === 1 ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center"> Financial & Legal Information </td>
                  </tr>
                  <tr>
                    <td><strong>Tax Identification Number</strong></td>
                    <td>
                      {{ selectedVendor.company_tax_identification_no }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Posesses Business Insurance</strong></td>
                    <td>
                      {{ selectedVendor.have_business_insurance === 1 ? 'Yes' : 'No' }}<br /><br />

                      <em
                        ><small v-if="selectedVendor.have_business_insurance === 1"
                          >View the list of uploaded documents for the Business Insurance</small
                        ></em
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Ongoing legal disputes</strong></td>
                    <td>
                      {{ selectedVendor.ongoing_legal_dispute === 1 ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                  <tr v-if="selectedVendor.ongoing_legal_dispute === 1">
                    <td><strong>Details of the dispute</strong></td>
                    <td>
                      {{ selectedVendor.legal_dispute_details }}
                    </td>
                  </tr>
                  <tr v-if="selectedVendor.bank_detail !== null">
                    <td><strong>Banking Details for Payment Processing</strong></td>
                    <td>
                      <p>
                        <strong>Bank Name: </strong>{{ selectedVendor.bank_detail.bank_name }}
                      </p>
                      <p>
                        <strong>Account Name: </strong>{{ selectedVendor.bank_detail.account_name }}
                      </p>
                      <p>
                        <strong>Account Number: </strong>{{ selectedVendor.bank_detail.account_no }}
                      </p>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </el-col>
          <el-col :md="8">
            <div :style="`background: ${setBgColor()}; padding: 10px`">
              <div>
                <div>
                  <strong>Inherent Risk Rating</strong>
                  <div
                    v-if="selectedVendor.inherent_risk_rating === 3"
                    style="
                      background: #fadfdf;
                      padding: 10px;
                      border: 2px dashed #cccccc;
                      margin-bottom: 30px;
                    "
                  >
                    <img src="/images/project-icons/high-impact-level.png" width="100" />
                    <strong>HIGH</strong>
                  </div>
                  <div
                    v-if="selectedVendor.inherent_risk_rating === 2"
                    style="
                      background: #faf4df;
                      padding: 10px;
                      border: 2px dashed #cccccc;
                      margin-bottom: 30px;
                    "
                  >
                    <img src="/images/project-icons/medium-impact-level.png" width="100" />
                    <strong>MEDIUM</strong>
                  </div>
                  <div
                    v-if="selectedVendor.inherent_risk_rating === 1"
                    style="
                      background: #e0fadf;
                      padding: 10px;
                      border: 2px dashed #cccccc;
                      margin-bottom: 30px;
                    "
                  >
                    <img src="/images/project-icons/low-impact-level.png" width="100" />
                    <strong>LOW</strong>
                  </div>
                </div>
                <div>
                  <span>Categorize {{ selectedVendor.name }} using the dropdown</span>
                  <el-select
                    v-model="selectedVendor.category"
                    v-loading="loading"
                    filterable
                    style="width: 100%"
                    value-key="id"
                    placeholder="Select Category"
                    @change="setVendorCategory"
                  >
                    <el-option
                      v-for="(category, index) in categories"
                      :key="index"
                      :label="category.name"
                      :value="category"
                    >
                      <span style="float: left">{{ category.name }}</span>
                      <!-- <span
                        style="float: right; color: #8492a6; font-size: 11px; margin-left: 10px"
                        >{{ category.description }}</span
                      > -->
                    </el-option>
                  </el-select>
                  <span>
                    <el-button type="text" @click="isCreateCategorySidebarActive = true">
                      <icon icon="tabler:plus" /> Click to create more categories
                    </el-button>
                  </span>
                  <hr />
                </div>
                <div v-if="selectedVendor.category_id !== null">
                  <div style="padding: 10px; border: 2px dashed #cccccc; margin-bottom: 30px">
                    <strong>First Review</strong>
                    <div v-if="selectedVendor.first_approval !== null">
                      <div v-if="selectedVendor.first_approval.action === 'Pending'">
                        <el-button
                          v-if="checkPermission(['approve-vendor-onboarding'])"
                          :loading="approvalLoading"
                          type="success"
                          @click="approveApplication('Approve', 'first_approval')"
                        >
                          Approve
                        </el-button>
                        <el-popover
                          v-if="checkPermission(['approve-vendor-onboarding'])"
                          placement="right"
                          width="500"
                          trigger="click"
                        >
                          <div
                            style="
                              background: #000000;
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
                              :disabled="approvalForm.details === ''"
                              @click="approveApplication('Reject', 'first_approval')"
                            >
                              OK
                            </el-button>
                          </div>
                          <template v-slot:reference>
                            <el-button type="danger" style="margin-left: 10px"> Reject </el-button>
                          </template>
                        </el-popover>
                      </div>
                      <div v-if="selectedVendor.first_approval.action === 'Reject'">
                        <img src="/images/rejected.png" width="100" />
                        <p>
                          <strong>Reason:</strong> {{ selectedVendor.first_approval.details }}
                        </p>
                        <el-button
                          v-if="checkPermission(['approve-vendor-onboarding'])"
                          :loading="approvalLoading"
                          type="success"
                          @click="approveApplication('Approve', 'first_approval')"
                        >
                          Approve
                        </el-button>
                      </div>
                      <div v-if="selectedVendor.first_approval.action === 'Approve'">
                        <img src="/images/approved.png" width="100" />
                      </div>
                    </div>
                    <div v-else>
                      <el-button
                        v-if="checkPermission(['approve-vendor-onboarding'])"
                        :loading="approvalLoading"
                        type="success"
                        @click="approveApplication('Approve', 'first_approval')"
                      >
                        Approve
                      </el-button>
                      <el-popover
                        v-if="checkPermission(['approve-vendor-onboarding'])"
                        placement="right"
                        width="500"
                        trigger="click"
                      >
                        <div
                          style="
                            background: #000000;
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
                            @click="approveApplication('Reject', 'first_approval')"
                          >
                            OK
                          </el-button>
                        </div>
                        <template v-slot:reference>
                          <el-button type="danger" style="margin-left: 10px"> Reject </el-button>
                        </template>
                      </el-popover>
                    </div>
                  </div>
                  <div
                    v-if="selectedVendor.first_approval !== null"
                    style="padding: 10px; border: 2px dashed #cccccc; margin-bottom: 30px"
                  >
                    <strong>Final Review/Approval</strong>
                    <div v-if="selectedVendor.second_approval !== null">
                      <div v-if="selectedVendor.second_approval.action === 'Pending'">
                        <el-button
                          v-if="checkPermission(['confirm-vendor-onboarding'])"
                          :loading="approvalLoading"
                          type="success"
                          @click="approveApplication('Approve', 'second_approval')"
                        >
                          Approve
                        </el-button>
                        <el-popover
                          v-if="checkPermission(['confirm-vendor-onboarding'])"
                          placement="right"
                          width="500"
                          trigger="click"
                        >
                          <div
                            style="
                              background: #000000;
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
                              @click="approveApplication('Reject', 'second_approval')"
                            >
                              OK
                            </el-button>
                          </div>
                          <template v-slot:reference>
                            <el-button type="danger" style="margin-left: 10px"> Reject </el-button>
                          </template>
                        </el-popover>
                      </div>
                      <div v-if="selectedVendor.second_approval.action === 'Reject'">
                        <img src="/images/rejected.png" width="100" />
                        <p>
                          <strong>Reason:</strong> {{ selectedVendor.second_approval.details }}
                        </p>
                        <el-button
                          v-if="checkPermission(['confirm-vendor-onboarding'])"
                          :loading="approvalLoading"
                          type="success"
                          @click="approveApplication('Approve', 'second_approval')"
                        >
                          Approve
                        </el-button>
                      </div>
                      <div v-if="selectedVendor.second_approval.action === 'Approve'">
                        <img src="/images/approved.png" width="100" />
                        <p></p>
                        <el-popover
                          v-if="checkPermission(['confirm-vendor-onboarding'])"
                          placement="right"
                          width="500"
                          trigger="click"
                        >
                          <div
                            style="
                              background: #000000;
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
                              @click="approveApplication('Reject', 'second_approval')"
                            >
                              OK
                            </el-button>
                          </div>
                          <template v-slot:reference>
                            <el-button type="danger" style="margin-left: 10px"> Reject </el-button>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                    <div v-else>
                      <el-button
                        v-if="checkPermission(['confirm-vendor-onboarding'])"
                        :loading="approvalLoading"
                        type="success"
                        @click="approveApplication('Approve', 'second_approval')"
                      >
                        Approve
                      </el-button>
                      <el-popover
                        v-if="checkPermission(['confirm-vendor-onboarding'])"
                        placement="right"
                        width="500"
                        trigger="click"
                      >
                        <div
                          style="
                            background: #000000;
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
                            @click="approveApplication('Reject', 'second_approval')"
                          >
                            OK
                          </el-button>
                        </div>
                        <template v-slot:reference>
                          <el-button type="danger" style="margin-left: 10px"> Reject </el-button>
                        </template>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="selectedVendor.document_uploads.length > 0"
                style="height: 750px; overflow: auto; padding: 10px; margin-bottom: 30px"
              >
                <h4>Uploaded Documents</h4>
                <el-row>
                  <el-col
                    v-for="(document, document_index) in selectedVendor.document_uploads"
                    :key="document_index"
                    :md="24"
                  >
                    <div style="cursor: pointer; border: solid 1px #cccccc; padding: 10px">
                      <span @click="viewDocument(baseServerUrl + 'storage/' + document.link)">
                        <img
                          :src="`/images/${document.link.split('.')[1]}.png`"
                          alt="Image"
                          width="20"
                        />

                        <small style="font-weight: 900; padding: 10px">{{ document.title }}</small>
                      </span>
                      <span class="pull-right">
                        <el-tooltip content="Download">
                          <a :href="baseServerUrl + 'storage/' + document.link" target="_blank"
                            ><feather-icon size="20" icon="DownloadIcon" />
                          </a>
                        </el-tooltip>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- <onboarding-form
          :vendor-id="selectedVendor.id"
        /> -->
      </div>
      <div v-else>
        <div align="center">
          <p><strong>Pick a vendor to continue</strong></p>
          <el-select
            v-model="selectedVendor"
            v-loading="loading"
            filterable
            style="width: 30%"
            value-key="id"
            placeholder="Make Selection"
            @change="setVendor()"
          >
            <el-option
              v-for="(vendor, index) in vendors"
              :key="index"
              :label="vendor.name"
              :value="vendor"
            />
          </el-select>
        </div>
      </div>
    </div>
    <el-dialog
      title="Create Category"
      v-if="isCreateCategorySidebarActive"
      v-model="isCreateCategorySidebarActive"
    >
      <AddCategory @save="fetchVendorCategories" />
    </el-dialog>
    <el-dialog
      v-model="showModal"
      title="View Uploaded Document"
      size="lg"
      destroy-on-close
      hide-footer
    >
      <iframe class="doc" :src="selectedDocument" width="600" height="500"></iframe>
    </el-dialog>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import AddCategory from './AddCategory.vue'
// import OnboardingForm from '@/views/modules/DUE-DILIGENCE/vendor/partials/Onboarding.vue'
// import EditVendorUser from './EditVendorUser.vue'
import Resource from '@/api/resource'
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'

export default {
  components: { AddCategory },
  data() {
    return {
      isCreateCategorySidebarActive: false,
      downloadLoading: false,
      showVendorDetails: false,
      vendors: [],
      loading: false,
      selectedVendor: null,
      selectedVendorUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
        all: true
      },
      total: 0,
      approvalForm: {
        details: '',
        action: ''
      },
      approvalLoading: false,
      showModal: false,
      categories: [],
      categoryLoading: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.fetchVendorCategories()
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    checkRole,
    setBgColor() {
      const root = document.documentElement // Get the root element (<html>)
      // root.style.setProperty('--el-color-primary', '#ff0000')
      const primaryBgColor = root.style.getPropertyValue('--el-color-primary')
      return `${changeOpacityOfHexaColorCode(primaryBgColor, 0.05)}`
    },
    viewDocument(document) {
      this.selectedDocument = document
      this.showModal = true
    },
    fetchVendorCategories() {
      const fetchCategoryResource = new Resource('vdd/fetch-vendor-categories')
      fetchCategoryResource
        .list()
        .then((response) => {
          this.categories = response.categories
        })
        .catch()
    },
    fetchVendors() {
      this.loading = true
      const fetchVendorResource = new Resource('vdd/fetch-vendors')
      fetchVendorResource.list(this.query).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    },
    setVendor() {
      // console.log(props)

      this.showVendorDetails = false
      setTimeout(() => {
        this.showVendorDetails = true
      }, 100)
    },
    setVendorCategory(category) {
      this.$confirm(
        `This action will categorize ${this.selectedVendor.name} under ${category.slug}. Continue?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          this.categoryLoading = true
          const categorizeVendorResource = new Resource('vdd/categorize-vendor')
          categorizeVendorResource
            .update(this.selectedVendor.id, { category_id: category.id })
            .then((response) => {
              this.selectedVendor = response.vendor
              this.$notify({ message: 'Action Successful', type: 'success' })
              this.categoryLoading = false
            })
            .catch((this.categoryLoading = false))
        })
        .catch()
    },
    approveApplication(action, field) {
      this.$confirm(`This will ${action} this vendor's application. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.approvalLoading = true
          const form = this.approvalForm
          form.action = action
          form.field = field
          const fetchStaffResource = new Resource('vdd/approve-vendor')
          fetchStaffResource
            .update(this.selectedVendor.id, form)
            .then((response) => {
              this.selectedVendor = response.vendor
              this.$notify({ message: 'Action Successful', type: 'success' })
              this.approvalLoading = false
            })
            .catch((this.approvalLoading = false))
        })
        .catch()
    },
    editThisVendorUser(row) {
      this.selectedVendorUser = row
      this.showEditForm = true
      this.editVendorUser = true
    }
    // handleDownload(tableTitle, vendorsList) {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then((excel) => {
    //     const multiHeader = [[tableTitle, '', '', '', '', '', '']]
    //     const tHeader = [
    //       // 'STUDENTSHIP STATUS',
    //       'STAFF ID',
    //       'SURNAME',
    //       'OTHER NAMES',
    //       'EMAIL',
    //       'PHONE',
    //       'GENDER'
    //     ]
    //     const filterVal = [
    //       // 'studentship_status',
    //       'user.username',
    //       'user.last_name',
    //       'user.first_name',
    //       'user.email',
    //       'user.phone1',
    //       'user.gender'
    //     ]
    //     const list = vendorsList
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       multiHeader,
    //       header: tHeader,
    //       data,
    //       filename: tableTitle,
    //       autoWidth: true,
    //       bookType: 'csv'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map((v) =>
    //     filterVal.map((j) => {
    //       if (j === 'user.username') {
    //         return v.user.username
    //       }
    //       if (j === 'user.last_name') {
    //         return v.user.last_name
    //       }
    //       if (j === 'user.first_name') {
    //         return v.user.first_name
    //       }
    //       if (j === 'user.email') {
    //         return v.user.email
    //       }
    //       if (j === 'user.phone1') {
    //         return v.user.phone1
    //       }
    //       if (j === 'user.gender') {
    //         return v.user.gender
    //       }

    //       return v[j]
    //     })
    //   )
    // }
  }
}
</script>
