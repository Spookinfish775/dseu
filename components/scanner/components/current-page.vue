<template>
	<div class="d-flex rotate-0">
		<img
			v-if="data"
			:class="{ ['rotate-' + data.rotate]: data.rotate }"
			class="current-page"
			:src="'data:image/png;base64,' + data.data"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	computed: {
		data() {
			return this.$store.getters["scanner/currentPage"];
		}
	}
});
</script>

<style lang="scss">
.current-page {
	justify-self: center;
	display: block;
	width: 450px;
	align-self: center;
	max-height: 650px;
}
.rotate-0 {
	transform: rotateZ(0);
}

.rotate-270 {
	transform: rotateZ(270deg);
}
.rotate-90 {
	transform: rotateZ(90deg);
}
.rotate-180 {
	transform: rotateZ(180deg);
}
</style>