<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveDistrict" />
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="district"
			:col-count="2"
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
import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
import { District } from "~/infrastructure/classes/administration/District";
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
		regionId: {
			type: Number,
			default: null,
			required: true
		}
	},
	data() {
		let district: IDistrict = new District({
			regionId: this.regionId
		});
		return {
			district
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
		saveDistrict() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.district, this.district),
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