<template>
	<div>
		<BaseToolbar
			:canSave="true"
			:canDelete="formData.id !== null"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm ref="form" :form-data.sync="formData" :read-only="readOnly">
			<DxSimpleItem
				data-field="whoTook"
				data-type="string"
				editor-type="dxTextBox"
				:editor-options="textBoxOptions"
			>
				<DxRequiredRule />
				<DxLabel :text="$t('labels.whoTook')" location="top" />
			</DxSimpleItem>
			<DxSimpleItem
				data-field="whenTook"
				data-type="date"
				editor-type="dxDateBox"
				:editor-options="dateBoxOptions"
			>
				<DxLabel :text="$t('labels.whenTook')" location="top" />
			</DxSimpleItem>
		</DxForm>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxForm, {
	DxGroupItem,
	DxSimpleItem,
	DxLabel,
	DxRequiredRule,
	DxEmailRule,
	DxAsyncRule,
	DxPatternRule,
	DxButtonItem
} from "devextreme-vue/form";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { CertificateReceiver } from "~/infrastructure/classes/CertificateReceiver";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxAsyncRule,
		DxPatternRule,
		DxButtonItem,
		BaseToolbar
	},
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		registrationServiceId: {
			type: Number,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		const formData = new CertificateReceiver(this.data);
		return {
			formData
		};
	},
	computed: {
		dateBoxOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
			});
		},
		textBoxOptions() {
			return new TextBoxProperties();
		}
	},
	methods: {
		onSave() {
			this.$emit("certificateReceiverSaved", {
				...this.formData,
				registrationServiceId: this.registrationServiceId
			});
		},
		onDelete() {
			this.$emit("certificateReceiverDeleted", this.formData.id);
		}
	}
});
</script>
