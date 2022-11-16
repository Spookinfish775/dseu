<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="saveTerritorialUnit"
			@delete="deleteTerritorialUnit"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="territorialUnit"
			:col-count="2"
			@field-data-changed="testUnit"
		>
			<DxGroupItem :caption="$t('labels.generalInformation')">
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
					data-field="typeName"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.typeName')" />
					<DxRequiredRule :message="$t('notifications.required.typeName')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="fullAddress"
					data-type="string"
					editor-type="dxTextArea"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('labels.address')" />
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
					<DxLabel :text="$t('labels.parent')" />
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
					:readOnly="!canUpdate || readOnly"
					@valueChanged="regionChanged"
				/>
			</template>
			<template #districtSelectBox>
				<DistrictSelectBox
					:value="territorialUnit.districtId"
					:regionId="territorialUnit.regionId"
					:readOnly="hasDisctrict || !canUpdate || readOnly"
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
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RegionSelectBox from "~/components/administration/region/region-select-box.vue";
import DistrictSelectBox from "~/components/administration/district/district-select-box.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";
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
		let formDataChanged: Boolean;
		let territorialUnit: ITerritorialUnit = this.data;
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
		textBoxOptions() {
			return new TextBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		hasDisctrict() {
			return this.territorialUnit.regionId === null;
		},
		numberBoxOptions() {
			return new NumberBoxProperties({
				readOnly: true
			});
		},
		districtOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.district,
				readOnly: this.territorialUnit.regionId === null,
				filter: ["regionId", "=", this.territorialUnit.regionId],
				onValueChanged: () => {
					this.territorialUnit.parentId = null;
				}
			});
		},
		parentOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.territorialUnit,
				readOnly: this.territorialUnit.districtId === null,
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
		}
	},
	methods: {
		testUnit(e){  
      this.formDataChanged = true;
    },
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
			if (result.isValid && this.formDataChanged == true) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.territorialUnit}/${this.territorialUnit.id}`,
						this.territorialUnit
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
		deleteTerritorialUnit() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(
							`${this.$dataApi.territorialUnit}/${this.territorialUnit.id}`
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

