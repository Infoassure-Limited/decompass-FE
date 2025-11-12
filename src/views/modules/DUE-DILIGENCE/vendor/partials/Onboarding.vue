<!-- eslint-disable vue/valid-v-slot -->
<template>
  <el-card v-loading="loading">
    <div v-if="vendor.second_approval !== ''" title="Review & Approval">
      <div>
        <div v-if="vendor.second_approval !== ''" align="right">
          <div v-if="vendor.second_approval.action === 'Reject'">
            <img src="/images/rejected.png" width="100" />
            <p> <strong>Reason:</strong> {{ vendor.second_approval.details }} </p>
          </div>
          <div v-if="vendor.second_approval.action === 'Approve'">
            <img src="/images/approved.png" width="100" />
          </div>
        </div>
      </div>
    </div>
    <v-stepper
      editable
      :items="[
        'General Information',
        'Pre Screening Information',
        'Business Information',
        `${
          vendor.second_approval.action === 'Approve'
            ? 'Review & Approval'
            : 'Declaration/Acknowledgment'
        }`
      ]"
    >
      <template v-slot:item.1>
        <el-row :gutter="20">
          <el-col :md="12">
            <v-text-field
              density="compact"
              variant="outlined"
              id="v-name"
              v-model="form.name"
              label="Company Name"
              :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              density="compact"
              variant="outlined"
              id="v-company_email"
              v-model="form.company_email"
              label="Company Email"
              :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              density="compact"
              variant="outlined"
              id="v-company_phone"
              v-model="form.company_phone"
              label="Company phone"
              :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
            />
          </el-col>
          <el-col :md="12">
            <el-form-group label="Company Registration Number" label-for="v-reg_no">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-reg_no"
                v-model="form.reg_no"
                label="Company Registration Number"
                placeholder="RC1234567"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <el-form-group label="Business Type" label-for="v-business_type">
              <label>Business Type</label>
              <el-select
                v-model="form.business_type"
                filterable
                style="width: 100%"
                :disabled="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                <el-option
                  v-for="(business_type, index) in business_types"
                  :key="index"
                  :label="business_type"
                  :value="business_type"
                />
              </el-select>
              <div v-if="form.business_type === 'Others'">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model="form.other_business_type"
                  label="Please specify other business type"
                  :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                />
              </div>
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <el-form-group label="Country of Incorporation" label-for="v-country">
              <label>Country of Incorporation</label>
              <el-select
                v-model="form.country_of_incorporation"
                filterable
                style="width: 100%"
                :disabled="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                <el-option
                  v-for="(country, c_index) in countries"
                  :key="c_index"
                  :label="country.country_name"
                  :value="country.country_name"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col :md="24">
            <v-textarea
              density="compact"
              variant="outlined"
              v-model="form.service_description"
              :label="`Briefly describe the products/services ${form.name} offers`"
              placeholder="Example: Payroll services, Transaction processing, Software maintenance, Professional services, Legal services e.t.c"
              :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              rows="2"
            />
          </el-col>
          <el-col :md="12">
            <el-form-group label="Company Website" label-for="v-website">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-website"
                v-model="form.website"
                label="Company Website"
                placeholder="www.example.com"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <label>Number of years in business</label><br />
            <el-input-number
              type="number"
              v-model="form.years_in_business"
              :min="1"
              placeholder="5"
              :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              style="width: 50%"
            />
          </el-col>
          <el-col :md="12">
            <el-form-group label="Primary Contact Name" label-for="v-contact_name">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-contact_name"
                v-model="form.contact_name"
                label="Primary Contact Name"
                placeholder="John Doe"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <el-form-group label="Primary Contact Email" label-for="v-email">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-email"
                v-model="form.contact_email"
                type="email"
                label="Primary Contact Email"
                placeholder="john.doe@email.com"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <el-form-group label="Primary Contact Phone" label-for="v-phone">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-phone"
                v-model="form.contact_phone"
                label="Enter primary contact phone"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
          <el-col :md="12">
            <el-form-group label="Contact Address" label-for="v-address">
              <v-text-field
                density="compact"
                variant="outlined"
                id="v-address"
                v-model="form.contact_address"
                type="textarea"
                label="Contact Address"
                :rows="2"
                style="width: 100%"
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              />
            </el-form-group>
          </el-col>
        </el-row>
      </template>

      <template v-slot:item.2>
        <el-row :gutter="20">
          <el-col cols="6" class="mb-2">
            <p class="mb-2">
              Does <strong>{{ form.name }}</strong> process, store, or transmit our organization's
              or customers' sensitive information?
            </p>
            <div>
              <el-radio
                v-model="form.stores_sentivite_information"
                :label="0"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                No
              </el-radio>
              <el-radio
                v-model="form.stores_sentivite_information"
                :label="1"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                Yes
              </el-radio>
            </div>
          </el-col>
          <el-col cols="6" class="mb-2">
            <p class="mb-2">
              Does <strong>{{ form.name }}</strong> require direct access to
              <strong>{{ form.client.name }}'s</strong> critical systems to perform its services?
            </p>
            <div>
              <el-radio
                v-model="form.has_access_to_critical_systems"
                :label="0"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                No
              </el-radio>
              <el-radio
                v-model="form.has_access_to_critical_systems"
                :label="1"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                Yes
              </el-radio>
            </div>
          </el-col>
          <el-col cols="6" class="mb-2">
            <p class="mb-2">
              Would a disruption in <strong>{{ form.name }}'s</strong> services cause significant
              delays or downtime in <strong>{{ form.client.name }}'s</strong>
              business operations?
            </p>
            <div>
              <el-radio
                v-model="form.has_impact_on_business_operations"
                :label="0"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                No
              </el-radio>
              <el-radio
                v-model="form.has_impact_on_business_operations"
                :label="1"
                border
                :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
              >
                Yes
              </el-radio>
            </div>
          </el-col>
        </el-row>
      </template>

      <template v-slot:item.3>
        <el-row :gutter="20">
          <el-col :md="16">
            <!--Lesser Info-->
            <el-row
              :gutter="20"
              v-if="
                form.stores_sentivite_information === 0 &&
                form.has_access_to_critical_systems === 0 &&
                form.has_impact_on_business_operations === 0
              "
            >
              <el-col md="12">
                <label for="v-work_with_similar_organization">
                  Has <strong>{{ form.name }}</strong> worked with similar organizations before?
                </label>
                <div>
                  <el-radio
                    v-model="form.work_with_similar_organization"
                    :label="0"
                    border
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  >
                    No
                  </el-radio>
                  <el-radio
                    v-model="form.work_with_similar_organization"
                    :label="1"
                    border
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  >
                    Yes
                  </el-radio>
                </div>
                <div v-if="form.work_with_similar_organization === 1">
                  <label for="">Kindly Provide References (Names of the organizations)</label>
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    v-model="form.references_to_working_with_similar_organizations"
                    type="textarea"
                    label="Type Here..."
                    maxlength="300"
                    rows="3"
                    show-word-limit
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  />
                </div>
              </el-col>
              <el-col md="12">
                <label for="have_business_insurance"
                  >Does <strong>{{ form.name }}</strong> have valid business insurance?</label
                >
                <div>
                  <el-radio
                    v-model="form.have_business_insurance"
                    :label="0"
                    border
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  >
                    No
                  </el-radio>
                  <el-radio
                    v-model="form.have_business_insurance"
                    :label="1"
                    border
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  >
                    Yes
                  </el-radio>
                </div>
                <div v-if="form.have_business_insurance === 1">
                  <div v-if="!fileUploaded('Business Insurance Certificate') && !isAdmin">
                    <label for="">Kindly Upload Certificate</label>
                    <input
                      v-if="!fileUploaded('Business Insurance Certificate') && !isAdmin"
                      class="form-control"
                      type="file"
                      @change="onImageChange($event, 'Business Insurance Certificate')"
                    />
                  </div>
                  <div v-else>
                    <el-alert type="success" :closable="false"
                      >Check the uploaded Business Insurance Certificate</el-alert
                    >
                  </div>
                </div>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Upload your Business License"
                  label-for="v-business_license_link"
                >
                  <label for="">Upload your Business License</label>
                  <input
                    v-if="!fileUploaded('Business License Certificate') && !isAdmin"
                    class="form-control"
                    type="file"
                    @change="onImageChange($event, 'Business License Certificate')"
                  />
                  <div v-else> Check for the already uploaded Business License Certificate </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Company Tax Identification Number"
                  label-for="v-company_tax_identification_no"
                >
                  <label for="">Company Tax Identification Number</label>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    v-model="form.company_tax_identification_no"
                    label="Type TIN here..."
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  />
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Banking Details for Payment Processing"
                  label-for="v-bank_details"
                >
                  <label for="">Banking Details for Payment Processing</label>
                  <table class="table">
                    <tbody>
                      <tr>
                        <td> Bank Name </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.bank_name"
                            :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td> Account Name </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.account_name"
                            :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td> Account Number </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.account_no"
                            type="number"
                            :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-form-group>
              </el-col>
            </el-row>
            <!--Lesser Info-->
            <!--More Info-->
            <el-row :gutter="20" v-else>
              <el-col cols="12" class="mb-2">
                <h3 class="mb-2"> Business & Operational Details </h3>
              </el-col>
              <el-col md="12">
                <el-form-group
                  :label="`List any major clients or industry recognitions ${form.name} has received`"
                  label-for="v-service_description"
                >
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    v-model="form.list_of_clients_or_industry_recognitions"
                    type="textarea"
                    :label="`List any major clients or industry recognitions ${form.name} has received`"
                    placeholder="Type here..."
                    maxlength="500"
                    rows="4"
                    show-word-limit
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  />
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Does your company subcontract any services?"
                  label-for="v-work_with_similar_organization"
                >
                  <label
                    >Does <strong>{{ form.name }}</strong> subcontract any services?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.does_subcontract_services"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.does_subcontract_services"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.does_subcontract_services === 1">
                    <br />
                    <label for="">Kindly specify the services</label>
                    <p></p>
                    <v-textarea
                      density="compact"
                      variant="outlined"
                      v-model="form.list_of_services_subcontracted"
                      type="textarea"
                      label="Specify the services your company subcontract"
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    />
                  </div>
                </el-form-group>
              </el-col>
              <el-col cols="12" class="mb-2">
                <h3 class="mb-2"> Regulatory & Compliance Information </h3>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Upload Applicable Industry Certifications"
                  label-for="v-industry_certs"
                >
                  <label>Upload Applicable Industry Certifications</label>
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Certifications Title</th>
                        <th>Upload Proof</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, upload_index) in certifications_to_upload"
                        :key="upload_index"
                      >
                        <td>
                          <small>You can type relevant certification title not listed</small>
                          <el-select
                            v-model="item.title"
                            filterable
                            allow-create
                            label="Select Or type to create new"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="(certs, cert_index) in industry_certifications"
                              :key="cert_index"
                              :value="certs"
                              :label="certs"
                            />
                          </el-select>
                        </td>
                        <td>
                          <input
                            v-if="!fileUploaded(item.title) && !isAdmin"
                            class="form-control"
                            type="file"
                            @change="onImageChange($event, item.title)"
                          />
                          <div v-else>
                            Check for the already uploaded {{ item.title }} certificate
                          </div>
                        </td>
                        <td>
                          <span>
                            <el-button-group>
                              <el-button
                                v-if="certifications_to_upload.length > 1"
                                size="mini"
                                type="danger"
                                @click="removeLine(upload_index)"
                              >
                                <icon icon="tabler:trash" />
                              </el-button>
                              <el-button
                                v-if="certifications_to_upload.length - 1 === upload_index"
                                size="mini"
                                type="success"
                                @click="addLine(upload_index)"
                              >
                                <icon icon="tabler:plus" />
                              </el-button>
                            </el-button-group>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Does your organization have any past regulatory compliance violations?"
                  label-for="v-past_regulatory_compliance_violations"
                >
                  <label>
                    Does <strong>{{ form.name }}</strong> have any past regulatory compliance
                    violations?
                  </label>
                  <div>
                    <el-radio
                      v-model="form.past_regulatory_compliance_violations"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.past_regulatory_compliance_violations"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.past_regulatory_compliance_violations === 1">
                    <p></p>
                    <v-textarea
                      density="compact"
                      variant="outlined"
                      v-model="form.details_of_compliance_violations"
                      type="textarea"
                      label="Kindly provide the details of the violations"
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    />
                  </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Does your organization have an internal compliance team or officer?"
                  label-for="v-past_regulatory_compliance_violations"
                >
                  <label for=""
                    >Does <strong>{{ form.name }}</strong> have an internal compliance team or
                    officer?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.internal_compliance_team_or_officer"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.internal_compliance_team_or_officer"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                </el-form-group>
              </el-col>
              <el-col cols="12" class="mb-2">
                <h3 class="mb-2"> Security & Risk Management </h3>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Do you have a formal cybersecurity policy?"
                  label-for="v-have_formal_cybersecurity_policy"
                >
                  <label for=""
                    >Does <strong>{{ form.name }}</strong> have a formal cybersecurity
                    policy?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.have_formal_cybersecurity_policy"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_formal_cybersecurity_policy"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_formal_cybersecurity_policy === 1">
                    <div v-if="!fileUploaded('Cybersecurity Policy') && !isAdmin">
                      <label for="">Kindly Upload</label>
                      <input
                        class="form-control"
                        type="file"
                        @change="onImageChange($event, 'Cybersecurity Policy')"
                      />
                    </div>
                    <div v-else>
                      <el-alert type="success" :closable="false"
                        >Check the uploaded Cybersecurity Policy</el-alert
                      >
                    </div>
                  </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Has your company experienced a data breach in the past 3 years?"
                  label-for="v-have_recent_data_breach"
                >
                  <label
                    >Has <strong>{{ form.name }}</strong> experienced a data breach in the past 3
                    years?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.have_recent_data_breach"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_recent_data_breach"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_recent_data_breach === 1">
                    <p></p>
                    <v-textarea
                      density="compact"
                      variant="outlined"
                      v-model="form.data_breach_resolution_process"
                      type="textarea"
                      label="Kindly explain the resolution process"
                      maxlength="500"
                      rows="4"
                      show-word-limit
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    />
                  </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="How do you ensure data protection and confidentiality?"
                  label-for="v-ensure_data_protection_and_confidentiality"
                >
                  <v-textarea
                    density="compact"
                    variant="outlined"
                    v-model="form.ensure_data_protection_and_confidentiality"
                    type="textarea"
                    :label="`How do you ensure data protection and confidentiality?`"
                    maxlength="500"
                    rows="4"
                    show-word-limit
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  />
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Do you conduct background checks on employees?"
                  label-for="v-have_formal_cybersecurity_policy"
                >
                  <label
                    >Does <strong>{{ form.name }}</strong> conduct background checks on
                    employees?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.does_background_checks_on_employees"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.does_background_checks_on_employees"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                </el-form-group>
              </el-col>
              <el-col cols="12" class="mb-2">
                <h3 class="mb-2"> Financial & Legal Information </h3>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Company Tax Identification Number"
                  label-for="v-company_tax_identification_no"
                >
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    v-model="form.company_tax_identification_no"
                    label="Type TIN here..."
                    :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                  />
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Do you have valid business insurance?"
                  label-for="v-have_business_insurance"
                >
                  <label
                    >Does <strong>{{ form.name }}</strong> have valid business insurance?</label
                  >
                  <div>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_business_insurance === 1">
                    <div v-if="!fileUploaded('Business Insurance Certificate') && !isAdmin">
                      <label for="">Kindly Upload Certificate</label>
                      <input
                        v-if="!fileUploaded('Business Insurance Certificate') && !isAdmin"
                        class="form-control"
                        type="file"
                        @change="onImageChange($event, 'Business Insurance Certificate')"
                      />
                    </div>
                    <div v-else>
                      <el-alert type="success" :closable="false"
                        >Check for the already uploaded Business Insurance Certificate</el-alert
                      >
                    </div>
                  </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Are there any ongoing legal disputes?"
                  label-for="v-ongoing_legal_dispute"
                >
                  <label>Are there any ongoing legal disputes?</label>
                  <div>
                    <el-radio
                      v-model="form.ongoing_legal_dispute"
                      :label="0"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.ongoing_legal_dispute"
                      :label="1"
                      border
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.ongoing_legal_dispute === 1">
                    <p></p>
                    <v-textarea
                      density="compact"
                      variant="outlined"
                      v-model="form.legal_dispute_details"
                      type="textarea"
                      label="Kindly give details of the dispute"
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                    />
                  </div>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Banking Details for Payment Processing"
                  label-for="v-bank_details"
                >
                  <strong for="">Kindly provide your banking details for payment processing</strong>
                  <table class="table table-striped">
                    <tbody>
                      <tr>
                        <td> Bank Name </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.bank_name"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td> Account Name </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.account_name"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td> Account Number </td>
                        <td>
                          <v-text-field
                            density="compact"
                            variant="outlined"
                            v-model="bank_details.account_no"
                            type="number"
                            :readonly="isAdmin || vendor.second_approval.action === 'Approve'"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-form-group>
              </el-col>
            </el-row>
            <!--More Info-->
          </el-col>
          <el-col :md="8">
            <div
              v-if="form.document_uploads.length > 0"
              v-loading="loadDelete"
              style="
                height: 600px;
                overflow: auto;
                background: #f0f0f0;
                padding: 10px;
                border-radius: 8px;
              "
            >
              <h4>Uploaded Documents & Evidences</h4>
              <el-row :gutter="20">
                <el-col
                  v-for="(document, document_index) in form.document_uploads"
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
                          ><icon size="20" icon="tabler:download" />
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Delete">
                        <span @click="deleteUploadedDocument(document.id)"
                          ><icon size="20" color="red" icon="tabler:trash"
                        /></span>
                      </el-tooltip>
                    </span>
                  </div>
                  <!-- <div style="text-align: center; cursor: pointer">
                    <img
                      :src="`/images/${document.link.split('.')[1]}.png`"
                      alt="Image"
                      width="80"
                      @click="viewDocument(baseServerUrl+'storage/'+document.link)"
                    ><br>

                    <small style="font-weight: 900">{{ document.title }}</small>
                    <p>
                      <el-tooltip content="Download">
                        <a
                          :href="baseServerUrl+'storage/'+document.link"
                          target="_blank"
                        ><icon
                          size="30"
                          icon="DownloadIcon"
                        />
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Delete">
                        <span @click="deleteUploadedDocument(document.id)"><icon
                          size="30"
                          color="red"
                          icon="TrashIcon"
                        /></span>
                      </el-tooltip>
                    </p>
                  </div> -->
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-slot:item.4>
        <el-row :gutter="20">
          <el-col cols="12" class="mb-2">
            <div v-if="vendor.second_approval.action === 'Approve'" style="text-align: center">
              <img src="/images/approved.png" width="100" />
              <h1>CONGRATULATIONS</h1>
            </div>
            <div v-else>
              <h3 class="mb-0">
                <em
                  >By clicking Submit, I confirm that the information provided is accurate and
                  complete</em
                >&nbsp;
                <el-button
                  v-if="!isAdmin && vendor.second_approval.action !== 'Approve'"
                  type="primary"
                  @click="formSubmitted"
                >
                  Submit
                </el-button>
              </h3>
            </div>
          </el-col>
        </el-row>
      </template>
    </v-stepper>
    <el-dialog
      v-if="showModal"
      v-model="showModal"
      title="Create New Invoice"
      centered
      size="lg"
      hide-footer
    >
      <iframe class="doc" :src="selectedDocument" width="600" height="500"></iframe>
    </el-dialog>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false
    },
    vendorId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      showModal: false,
      vendor: {
        id: '',
        client_id: '',
        admin_user_id: '',
        name: '',
        business_type: '',
        other_business_type: '',
        contact_name: '',
        company_email: '',
        company_phone: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        reg_no: '',
        country_of_incorporation: '',
        website: '',
        years_in_business: 1,
        stores_sentivite_information: 0,
        has_access_to_critical_systems: 0,
        has_impact_on_business_operations: 0,
        service_description: '',
        work_with_similar_organization: 1,
        references_to_working_with_similar_organizations: '',
        have_business_insurance: 1,
        business_insurance_file_link: '',
        business_license_link: '',
        list_of_clients_or_industry_recognitions: '',
        does_subcontract_services: 0,
        list_of_services_subcontracted: '',
        industry_certifications: '',
        past_regulatory_compliance_violations: 0,
        details_of_compliance_violations: '',
        internal_compliance_team_or_officer: 0,
        have_formal_cybersecurity_policy: 0,
        cyber_security_policy_link: '',
        have_recent_data_breach: 0,
        data_breach_resolution_process: '',
        ensure_data_protection_and_confidentiality: '',
        does_background_checks_on_employees: 1,
        company_tax_identification_no: '',
        ongoing_legal_dispute: 0,
        legal_dispute_details: '',
        document_uploads: [],
        first_approval: {
          action: '',
          details: ''
        },
        second_approval: {
          action: '',
          details: ''
        }
      },
      form: {
        id: '',
        client_id: '',
        admin_user_id: '',
        name: '',
        business_type: '',
        other_business_type: '',
        contact_name: '',
        company_email: '',
        company_phone: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        reg_no: '',
        country_of_incorporation: '',
        website: '',
        years_in_business: 1,
        stores_sentivite_information: 0,
        has_access_to_critical_systems: 0,
        has_impact_on_business_operations: 0,
        service_description: '',
        work_with_similar_organization: 1,
        references_to_working_with_similar_organizations: '',
        have_business_insurance: 1,
        business_insurance_file_link: '',
        business_license_link: '',
        list_of_clients_or_industry_recognitions: '',
        does_subcontract_services: 0,
        list_of_services_subcontracted: '',
        industry_certifications: '',
        past_regulatory_compliance_violations: 0,
        details_of_compliance_violations: '',
        internal_compliance_team_or_officer: 0,
        have_formal_cybersecurity_policy: 0,
        cyber_security_policy_link: '',
        have_recent_data_breach: 0,
        data_breach_resolution_process: '',
        ensure_data_protection_and_confidentiality: '',
        does_background_checks_on_employees: 1,
        company_tax_identification_no: '',
        ongoing_legal_dispute: 0,
        legal_dispute_details: '',
        document_uploads: []
      },
      business_types: [],
      countries: [],
      uploadableFiles: [],
      certifications_to_upload: [],
      industry_certifications: ['ISO 27001', 'SOC 2', 'GDPR', 'PCI-DSS'],
      bank_details: {
        bank_name: '',
        account_no: '',
        account_name: ''
      },
      loadDelete: false,
      loading: false,
      fill_fields_error: false,
      selectedDocument: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.fetchVendor()
    this.addLine()
  },
  methods: {
    viewDocument(document) {
      this.selectedDocument = document
      this.showModal = true
    },
    rowIsEmpty() {
      this.fill_fields_error = false
      const checkEmptyLines = this.certifications_to_upload.filter((detail) => detail.title === '')
      if (checkEmptyLines.length >= 1) {
        this.fill_fields_error = true
        // this.invoice_items[index].seleted_category = true;
        return true
      }
      return false
    },
    addLine() {
      if (this.rowIsEmpty() && this.certifications_to_upload.length > 0) {
        this.$alert('Fill all empty fields')
        return false
      }
      this.certifications_to_upload.push({
        title: ''
      })
      return true
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.certifications_to_upload.splice(detailId, 1)
      }
    },
    fileUploaded(certs) {
      const uploadedFiles = this.vendor.document_uploads
      const isUploaded = uploadedFiles.some((file) => file.title === certs)
      return isUploaded
    },
    fetchVendor() {
      this.loading = true
      const fetchVendorResource = new Resource('vdd/show-vendor')
      fetchVendorResource.vGet(this.vendorId).then((response) => {
        this.vendor = response.vendor
        if (this.vendor.second_approval === '') {
          this.vendor.second_approval = {
            action: '',
            details: ''
          }
        }
        this.industry_certifications = response.industry_certifications
        this.form = response.vendor
        this.business_types = response.business_types
        this.countries = response.countries
        this.bank_details = response.vendor.bank_detail
          ? response.vendor.bank_detail
          : {
              bank_name: '',
              account_no: '',
              account_name: ''
            }
        this.loading = false
      })
    },
    onImageChange(e, title) {
      console.log(e.target.files[0])
      const fileType = e.target.files[0].type
      // if (fileType !== 'application/pdf' && fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
      //   this.$alert('Acceptable file formats are .pdf, .docx, .jpg and .png')
      //   return false
      // }
      if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
        this.$alert('Acceptable file formats are .pdf, .jpg and .png')
        return false
      }
      this.uploadableFiles.push({ title, file: e.target.files[0] })
      return true
    },
    formSubmitted() {
      const formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('name', this.form.name)
      formData.append('business_type', this.form.business_type)
      formData.append('contact_name', this.form.contact_name)
      formData.append('contact_email', this.form.contact_email)
      formData.append('contact_phone', this.form.contact_phone)
      formData.append('contact_address', this.form.contact_address)
      formData.append('reg_no', this.form.reg_no)
      formData.append('country_of_incorporation', this.form.country_of_incorporation)
      formData.append('website', this.form.website)
      formData.append('years_in_business', this.form.years_in_business)
      formData.append('stores_sentivite_information', this.form.stores_sentivite_information)
      formData.append('has_access_to_critical_systems', this.form.has_access_to_critical_systems)
      formData.append(
        'has_impact_on_business_operations',
        this.form.has_impact_on_business_operations
      )
      formData.append('service_description', this.form.service_description)
      formData.append('work_with_similar_organization', this.form.work_with_similar_organization)
      formData.append(
        'references_to_working_with_similar_organizations',
        this.form.references_to_working_with_similar_organizations
      )
      formData.append('have_business_insurance', this.form.have_business_insurance)
      formData.append('bank_name', this.bank_details.bank_name)
      formData.append('account_no', this.bank_details.account_no)
      formData.append('account_name', this.bank_details.account_name)
      formData.append(
        'list_of_clients_or_industry_recognitions',
        this.form.list_of_clients_or_industry_recognitions
      )
      formData.append('does_subcontract_services', this.form.does_subcontract_services)
      formData.append('list_of_services_subcontracted', this.form.list_of_services_subcontracted)
      formData.append('industry_certifications', this.form.industry_certifications)
      formData.append(
        'past_regulatory_compliance_violations',
        this.form.past_regulatory_compliance_violations
      )
      formData.append(
        'details_of_compliance_violations',
        this.form.details_of_compliance_violations
      )
      formData.append(
        'internal_compliance_team_or_officer',
        this.form.internal_compliance_team_or_officer
      )
      formData.append(
        'have_formal_cybersecurity_policy',
        this.form.have_formal_cybersecurity_policy
      )
      formData.append('have_recent_data_breach', this.form.have_recent_data_breach)
      formData.append('data_breach_resolution_process', this.form.data_breach_resolution_process)
      formData.append(
        'ensure_data_protection_and_confidentiality',
        this.form.ensure_data_protection_and_confidentiality
      )
      formData.append(
        'does_background_checks_on_employees',
        this.form.does_background_checks_on_employees
      )
      formData.append('company_tax_identification_no', this.form.company_tax_identification_no)
      formData.append('ongoing_legal_dispute', this.form.ongoing_legal_dispute)
      formData.append('legal_dispute_details', this.form.legal_dispute_details)
      this.uploadableFiles.forEach((element) => {
        formData.append('uploadable_files[]', element.file)
        formData.append('uploadable_files_titles[]', element.title)
      })
      this.loading = true
      const updateVendorResource = new Resource('vdd/update-vendor')
      updateVendorResource
        .vStore(formData)
        .then(() => {
          this.$message('Submitted Successfully')
          this.fetchVendor()
          this.loading = false
          // console.log(response)
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.message)
        })
      // console.log(formData)
    },
    deleteUploadedDocument(documentId) {
      if (
        window.confirm('Are you sure you want to delete this document? This cannot be recovered')
      ) {
        this.loadDelete = true
        const destroyEvidenceResource = new Resource('vdd/delete-uploaded-document')
        destroyEvidenceResource
          .vDestroy(documentId)
          .then(() => {
            this.fetchVendor(false)
            this.$message('Document Deleted')
            this.loadDelete = false
          })
          .catch((e) => {
            this.loadDelete = false
            this.$message(e.response.message)
          })
      }
    }
  }
}
</script>
