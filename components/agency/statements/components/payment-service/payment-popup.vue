<template>
	<BasePopup ref="basePopup" width="70%" height="80vh" position="top">
		<PaymentForm :document="document" />
	</BasePopup>
</template>

<script lang="ts">
import Vue from "vue";

import BasePopup from "~/components/page/popup.vue";
import PaymentForm from "./payment-form.vue";

export default Vue.extend({
	components: {
		BasePopup,
		PaymentForm
	},
	props: {
		document: {
			type: Object,
			required: true
		}
	},
	methods: {
		open() {
			this.$refs["basePopup"].open();
		},
		close() {
			this.$refs["basePopup"].close();
		}
	}
});
</script>