<template>
	<div>
		<BaseToolbar
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="onSave"
			@delete="onDelete"
		/>
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxSimpleItem
				data-field="letterSenderOrganizationTypeId"
				data-type="number"
				editor-type="dxSelectBox"
				:editor-options="letterSenderOrganizationTypeOptions"
			>
				<DxLabel :text="$t('labels.letterSenderOrganizationType')" />
				<DxRequiredRule
					:message="$t('notifications.required.letterSenderOrganizationType')"
				/>
			</DxSimpleItem>
			<DxGroupItem :col-count="2" :caption="$t('labels.info')">
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
					data-field="legalAddress"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.legalAddress')" />					
				</DxSimpleItem>
				<DxSimpleItem
					data-field="postAddress"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.postAddress')" />					
				</DxSimpleItem>
				<DxSimpleItem
					data-field="phones"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.phones')" />					
				</DxSimpleItem>
				<DxSimpleItem
					data-field="email"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.email')" />				
					<DxEmailRule />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="webSite"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.webSite')" />					
				</DxSimpleItem>
				<DxSimpleItem
					data-field="nonresident"
					data-type="boolean"
					editor-type="dxCheckBox"
					:col-span="2"
				>
					<DxLabel location="left" :text="$t('labels.nonresident')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="note"
					data-type="string"
					editor-type="dxTextArea"
					:col-span="2"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('labels.note')" />
				</DxSimpleItem>
			</DxGroupItem>
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
	DxEmailRule
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { ILetterSenderOrganization } from "~/infrastructure/interfaces/administration/ILetterSenderOrganization";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxTextArea,
		BaseToolbar
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		let formData: ILetterSenderOrganization = this.data;
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"LetterSenderOrganization"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"LetterSenderOrganization"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"LetterSenderOrganization"
			];
			return PermissionControler.fullAccess(permission);
		},
		letterSenderOrganizationTypeOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.letterSenderOrganizationType
			});
		},
		citizenshipOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.citizenship
			});
		},
		identityDocumentTypeOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.identityDocumentType
			});
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		dateBoxOptions() {
			return new DateBoxProperties();
		}
	},
	methods: {
		representativeDocumentsChanged(data) {
			this.formData.representativeDocuments = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.letterSenderOrganization}/${this.formData.id}`,
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
							`${this.$dataApi.letterSenderOrganization}/${this.formData.id}`
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