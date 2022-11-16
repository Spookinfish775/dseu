<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveTerritorialUnit" />
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="territorialUnit"
			:col-count="2"
		>
			<DxGroupItem :caption="$t('labels.generalInformation')">
				<DxSimpleItem
					data-field="name"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('territorialUnit.name')" />
					<DxRequiredRule :message="$t('notifications.required.name')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="typeName"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('territorialUnit.typeName')" />
					<DxRequiredRule :message="$t('notifications.required.typeName')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="fullAddress"
					data-type="string"
					editor-type="dxTextArea"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('territorialUnit.fullAddress')" />
					<DxRequiredRule :message="$t('notifications.required.address')" />
				</DxSimpleItem>
			</DxGroupItem>
			<DxGroupItem :caption="$t('labels.location')">
				<DxSimpleItem
					data-field="regionId"
					data-type="number"
					template="regionSelectBox"
				>
					<DxLabel :text="$t('labels.region')" />
					<DxRequiredRule :message="$t('notifications.required.region')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="districtId"
					data-type="number"
					template="districtSelectBox"
				>
					<DxLabel :text="$t('labels.district')" />
					<DxRequiredRule :message="$t('notifications.required.district')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="parentId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="parentOptions"
				>
					<DxLabel :text="$t('territorialUnit.parent')" />
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
			</DxGroupItem>
			<template #regionSelectBox>
				<RegionSelectBox
					:value="territorialUnit.regionId"
					:readOnly="hasRegion"
					@valueChanged="regionChanged"
				/>
			</template>
			<template #districtSelectBox>
				<DistrictSelectBox
					:value="territorialUnit.districtId"
					:readOnly="hasDisctrict"
					:regionId="territorialUnit.regionId"
					@valueChanged="districtChanged"
				/>
			</template>
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RegionSelectBox from "~/components/administration/region/region-select-box.vue";
import DistrictSelectBox from "~/components/administration/district/district-select-box.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { TerritorialUnit } from "~/infrastructure/classes/TerritorialUnit";
import { ITerritorialUnit } from "~/infrastructure/interfaces/ITerritorialUnit";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		RegionSelectBox,
		DistrictSelectBox,
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxButtonItem,
		DxTextArea
	},
	props: {
		options: {
			type: Object
		}
	},
	data() {
		let territorialUnit: ITerritorialUnit = new TerritorialUnit(this.options);
		return {
			territorialUnit
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"TerritorialUnit"
			];
			return PermissionControler.fullAccess(permission);
		},
		hasRegion() {
			return this.options?.regionId ? true : false;
		},
		hasDisctrict() {
			return this.territorialUnit.regionId === null || this.options?.districtId
				? true
				: false;
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		parentOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.territorialUnit,
				readOnly:
					this.territorialUnit.districtId === null || this.options?.parentId
						? true
						: false,
				filter: ["districtId", "=", this.territorialUnit.districtId]
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		},
		districtId() {
			return this.territorialUnit.districtId;
		},
		parentId() {
			return this.territorialUnit.parentId;
		},
		name() {
			return this.territorialUnit.name;
		},
		typeName() {
			return this.territorialUnit.typeName;
		}
	},
	watch: {
		districtId() {
			this.getFullAddress();
		},
		parentId() {
			this.getFullAddress();
		},
		name() {
			this.getFullAddress();
		},
		typeName() {
			this.getFullAddress();
		}
	},
	methods: {
		regionChanged(data) {
			this.territorialUnit.districtId = null;
			this.territorialUnit.regionId = data;
		},
		districtChanged(data) {
			this.territorialUnit.parentId = null;
			this.territorialUnit.districtId = data;
		},
		async getFullAddress() {
			if (this.districtId !== null) {
				let { data } = await this.$axios.get(
					this.$dataApi.stringParser.territorialUnit,
					{
						params: {
							districtId: this.districtId,
							name: `${this.name} ${this.typeName}`,
							parentId: this.parentId
						}
					}
				);
				this.territorialUnit.fullAddress = data;
			}
		},
		saveTerritorialUnit() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.territorialUnit, this.territorialUnit),
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

