<template>
	<div>
		<BasePopup 
    ref="basePopup" 
    :width="'80%'" 
    :height="'80vh'"
    :title="$t('labels.encumbranceRelease')"
    >
			<Card
				v-if="release"
				:data="release"
				@successedSaved="close"
				@successedDeleted="close"
			/>
			<Create
				v-else
				:encumbranceLetterId="encumbranceLetterId"
				@successedSaved="close"
			/>
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import BasePopup from "~/components/page/popup.vue";
import Card from "./card.vue";
import Create from "./create.vue";

export default Vue.extend({
	components: {
		BasePopup,
		Card,
		Create
	},
	props: {
		currentRow: {
			type: Object,
			default: null
		}
	},
	computed: {
		release() {
			return this.currentRow?.release;
		},
		encumbranceLetterId() {
			return this.currentRow?.id;
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