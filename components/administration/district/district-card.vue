<template>
	<div>
		<BaseToolbar
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
			@field-data-changed="testDistrict"
		>
			<DxSimpleItem
				data-field="regionId"
				data-type="number"
				editor-type="dxSelectBox"
				:editor-options="regionOptions"
			>
				<DxLabel :text="$t('labels.region')" />
				<DxRequiredRule />
			</DxSimpleItem>

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
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { IDistrict } from "~/infrastructure/interfaces/administration/IDistrict";
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
		}
	},
	data() {
		let formDataChanged: Boolean;
		let formData: IDistrict = this.data;
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["District"];
			return PermissionControler.fullAccess(permission);
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		numberBoxOptions() {
			return new NumberBoxProperties();
		},
		regionOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.region,
				readOnly: true
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		}
	},
	methods: {
		testDistrict(e){  
      this.formDataChanged = true;
    },
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid && this.formDataChanged == true) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.district}/${this.formData.id}`,
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
			this.formDataChanged = false;
		},
		onDelete() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(`${this.$dataApi.district}/${this.formData.id}`),
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