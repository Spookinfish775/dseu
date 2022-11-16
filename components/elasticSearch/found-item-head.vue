<template>
	<div class="found-item-head">
		<p>
			<span> {{ $t("labels.number") }} : {{ data.registrationServiceNumber }} </span>
		</p>
		<p>
			<span>
				{{ $t("labels.realEstate") }} : {{ data.realEstate.address }}
			</span>
		</p>
		<p v-for="(applicant, index) in data.applicants" :key="index">
			<span> {{ $t("labels.applicant") }} : {{ applicant.fullName }} </span>
		</p>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		data: {
			type: Object,
			required: true
		}
	}
});
</script>