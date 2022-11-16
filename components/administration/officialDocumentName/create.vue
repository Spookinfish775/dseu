<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="formData"
			:col-count="2"
		>
			<DxSimpleItem
				data-field="name"
				data-type="string"
				editor-type="dxTextBox"
				:editor-options="textBoxOptions"
			>
				<DxLabel :text="$t('labels.name')" />
				<DxRequiredRule :message="$t('notifications.required.name')" />
			</DxSimpleItem>

			<DxSimpleItem
				data-field="status"
				data-type="number"
				editor-type="dxSelectBox"
				:editor-options="statusOptions"
			>
				<DxLabel :text="$t('labels.status')" />
				<DxRequiredRule :message="$t('notifications.required.status')" />
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
	DxRequiredRule
} from "devextreme-vue/form";
import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { OfficialDocumentName } from "~/infrastructure/classes/administration/OfficialDocumentName";
import { IOfficialDocumentName } from "~/infrastructure/interfaces/administration/IOfficialDocumentName";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule
	},
	data() {
		let formData: IOfficialDocumentName = new OfficialDocumentName();
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"OfficialDocumentName"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"OfficialDocumentName"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"OfficialDocumentName"
			];
			return PermissionControler.fullAccess(permission);
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		}
	},
	methods: {
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.officialDocumentName, this.formData),
					e => {
						this.$awn.success();
						this.$emit("successedSaved", e.data);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		}
	}
});
</script>