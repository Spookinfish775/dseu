<template>
	<div id="letterSenderOrganization-list-item">
		<i />
		<div>
			<p>
				<b>{{ $t("labels.name") }}:</b>
				{{ data.name }}
			</p>
			<p>
				<b>{{ $t("labels.legalAddress") }}:</b>
				{{ data.legalAddress }}
			</p>
			<p>
				<b>{{ $t("labels.postAddress") }}:</b>
				{{ data.postAddress }}
			</p>
			<p>
				<b>{{ $t("labels.phones") }}:</b>
				{{ data.phones }}
			</p>
			<p>
				<b>{{ $t("labels.webSite") }}:</b>
				{{ data.webSite }}
			</p>
			<p>
				<b>{{ $t("labels.nonresident") }}:</b>
				{{ $t(`labels.${data.nonresident}`) }}
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
			required: true
		}
	}
});
</script>

<style lang="scss">
#letterSenderOrganization-list-item {
	display: flex;
	align-items: center;
	i {
		width: 30px;
		height: 30px;
		margin: 0 10px 0 0;
		background: url("/icons/applicantType/letterSenderOrganization.svg") center
			no-repeat;
		background-size: cover;
	}
}
</style>