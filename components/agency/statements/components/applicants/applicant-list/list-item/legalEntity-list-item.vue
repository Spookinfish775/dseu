<template>
	<div id="legalEntity-list-item">
		<i />
		<div>
			<p>
				<b>{{ $t("labels.name") }}:</b>
				{{ data.name }}
			</p>
			<p>
				<b>{{ $t("labels.tin") }}:</b>
				{{ data.tin }}
			</p>
			<p>
				<b>{{ $t("labels.address") }}:</b>
				{{ data.address }}
			</p>
			<p>
				<b>{{ $t("labels.isRepresentative") }}:</b>
				{{ applicantStatusName }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import { RepresentativeTypes } from "~/infrastructure/data-sources/RepresentativeTypes";

export default Vue.extend({
	props: {
		data: {
			type: Object,
			required: true
		},
		applicantStatement: {
			type: Object,
			required: true
		}
	},
  computed: {
    applicantStatusName() {
      return RepresentativeTypes(this).find(
        (element) =>
          element.id === this.applicantStatement.statementApplicantStatus
      ).name;
    },
  },
});
</script>

<style lang="scss">
#legalEntity-list-item {
	display: flex;
	align-items: center;
	i {
		width: 30px;
		height: 30px;
		margin: 0 10px 0 0;
		background: url("/icons/applicantType/legalEntity.svg") center no-repeat;
		background-size: cover;
	}
}
</style>