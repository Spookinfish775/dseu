<template>
	<div class="qr-code-wrapper">
		<div class="document-wrapper" v-html="currentData"></div>
	</div>
</template>

<script>
import { dataApi } from "~/static/dataApi";
export default {
	layout: "qr-code-layout",
	async asyncData({ $axios, route }) {
		const { data } = await $axios.get(`${dataApi.qrCodeDocument}`, {
			params: {
				DocumentId: route.query.DocumentId,
				DocumentType: route.query.DocumentType
			}
		});
		return {
			currentData: data
		};
	}
};
</script>

<style lang="scss">
.qr-code-wrapper {
	width: 60%;
	min-height: 1300px;
	margin-bottom: 1%;
	display: flex;
	flex-direction: column;
	align-items: center;
	.document-wrapper {
		size: 7in 9.25in;
		margin: 27mm 16mm 27mm 16mm;
		padding: 27mm 16mm 27mm 16mm;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
		-webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
		-moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
		p {
			line-height: 30px;
		}
	}
}
</style>
