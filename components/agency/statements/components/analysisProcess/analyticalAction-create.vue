<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
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
				data-field="description"
				data-type="string"
				editor-type="dxTextArea"
				:editor-options="textAreaOptions"
			>
				<DxLabel :text="$t('labels.description')" />
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { AnalysisAction } from "~/infrastructure/classes/agency/analysisProcess/AnalysisAction";
import { IAnalysisAction } from "~/infrastructure/interfaces/agency/analysisProcess/IAnalysisAction";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { Status } from "~/infrastructure/enums/Status";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxAsyncRule,
		DxButtonItem,
		DxTextArea
	},
	props: {
		analysisProcessId: {
			type: Number,
			required: true
		}
	},
	data() {
		let formData: IAnalysisAction = new AnalysisAction({
			name: "",
			description: "",
			analysisProcessId: this.analysisProcessId,
			status: Status.Active
		});
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"AnalyticalAction"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"AnalyticalAction"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"AnalyticalAction"
			];
			return PermissionControler.fullAccess(permission);
		},
		textAreaOptions() {
			return new TextAreaProperties();
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
					this.$axios.post(this.$dataApi.analyticalAction, this.formData),
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