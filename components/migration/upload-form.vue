<template>
  <div>
    <OrganizationSelectBox
      :value="organizationId"
      @valueChanged="changeOrganizationId"
    />
    <DxFileUploader
      ref="uploader"
      :accept="accept"
      upload-mode="useButtons"
      name="files"
      :value.sync="files"
      :multiple="true"
      :upload-url="url"
      :upload-headers="uploaderHeaders"
      :upload-custom-data="uploaderCustomData"
      :disabled="organizationId === null"
      @uploaded="uploadedFile"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DxFileUploader } from "devextreme-vue/file-uploader";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";

export default Vue.extend({
  components: {
    DxFileUploader,
    OrganizationSelectBox
  },
  data() {
    return {
      organizationId: null,
      files: [],
      accept: ".xls, .xlsx"
    };
  },
  computed: {
    url() {
      return `${process.env.SERVER_URL}${this.$dataApi.dataMigration.uploadMigration}`;
    },
    uploaderHeaders() {
      return {
        Authorization: "Bearer " + this.$store.getters["oidc/oidcAccessToken"]
      };
    },
    uploaderCustomData() {
      return {
        OrganizationId: this.organizationId
      };
    }
  },
  methods: {
    changeOrganizationId(data) {
      this.organizationId = data;
    },
    uploadedFile(e) {
      this.$refs["uploader"].instance.removeFile(e.file);
      let uploadedFile = JSON.parse(e.request.response);
      this.$store.commit("file-manager/ADD_UPLOADED_FILE", uploadedFile);
    }
  }
});
</script>
