<template>
  <div>
    <div>
      <p>
        <b>{{ $t("labels.fullName") }}:</b>
        {{ data.firstName }}
        {{ data.lastName }}
        {{ data.middleName }}
      </p>
      <p>
        <b>{{ $t("labels.placeOfBirth") }}:</b>
        {{ data.placeOfBirth }}
      </p>
      <p>
        <b>{{ $t("migration.dataGrid.uploadedApplicant.birthday") }}:</b>
        {{ data.birthday }}
      </p>
      <p>
        <b>{{ $t("migration.dataGrid.uploadedApplicant.placeOfBirth") }}:</b>
        {{ data.placeOfBirth }}
      </p>
      <p>
        <b
          >{{
            $t("migration.dataGrid.uploadedApplicant.identityDocumentTypeName")
          }}:</b
        >
        {{ data.identityDocumentTypeName }}
      </p>
      <p>
        <b
          >{{
            $t("migration.dataGrid.uploadedApplicant.identityDocumentNumber")
          }}:</b
        >
        {{ data.identityDocumentNumber }}
      </p>
      <p>
        <b
          >{{
            $t(
              "migration.dataGrid.uploadedApplicant.identityDocumentIssueDate"
            )
          }}:</b
        >
        {{ data.identityDocumentIssueDate }}
      </p>
      <p>
        <b
          >{{
            $t("migration.dataGrid.uploadedApplicant.identityDocumentIssuedBy")
          }}:</b
        >
        {{ data.identityDocumentIssuedBy }}
      </p>
      <p>
        <b>{{ $t("migration.dataGrid.uploadedApplicant.citizenshipName") }}:</b>
        {{ data.citizenshipName }}
      </p>
      <p>
        <b>{{ $t("migration.dataGrid.uploadedApplicant.registration") }}:</b>
        {{ data.registration }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
});
</script>

