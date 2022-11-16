<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="formData"
			:col-count="2"
			:read-only="readOnly"
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
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
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
	props: {
		data: {
			type: Object,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		let formData: IOfficialDocumentName = this.data;
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
					this.$axios.put(
						`${this.$dataApi.officialDocumentName}/${this.formData.id}`,
						this.formData
					),
					e => {
						this.$awn.success();
						this.$emit("successedSaved", e.data);
					},
					e => {
						this.$awn.alert();
					}
				);
			}
		},
		onDelete() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.officialDocumentName}/${this.formData.id}`
						),
						e => {
							this.$awn.success();
							this.$emit("successedDeleted");
						},
						e => {
							this.$awn.alert();
						}
					);
				}
			});
		}
	}
});
</script>