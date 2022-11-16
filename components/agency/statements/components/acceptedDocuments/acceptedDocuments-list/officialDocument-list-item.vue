<template>
	<div id="officialDocument-list-item">
		<i />
		<div>
			<p>
				<b>{{ $t("labels.name") }}:</b>
				{{ name }}
			</p>
			<p>
				<b>{{ $t("labels.number") }}:</b>
				{{ data.number }}
			</p>
			<p>
				<b>{{ $t("labels.issueDataTime") }}:</b>
				{{ fomateDate(data.issueDataTime) }}
			</p>
			<p>
				<b>{{ $t("labels.issuer") }}:</b>
				{{ data.issuer }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import moment from "moment";
export default Vue.extend({
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			name: ""
		};
	},
	methods: {
		fomateDate(value) {
			moment.locale(this.$i18n.locale);
			return moment(value).format("LL");
		}
	},
	async created() {
		try {
			let { data } = await this.$axios.get(
				`${this.$dataApi.officialDocumentName}/${this.data.officialDocumentNameId}`
			);
			this.name = data.name;
		} catch (error) {
			console.log(error);
		}
	}
});
</script>

<style lang="scss">
#officialDocument-list-item {
	display: flex;
	align-items: center;
	position: relative;
	i {
		width: 30px;
		height: 30px;
		margin: 0 10px 0 0;
		background: url("/icons/officialDocumentType/officialDocument.svg") center
			no-repeat;
		background-size: cover;
	}
}
</style>