<template>
	<div class="card-wrapper">
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canDownload="true"
			:canPrint="true"
			@save="onSave"
			@download="onDownload"
			@print="onPrint"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="formData"
			:read-only="readOnly"
		>
			<DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
				<DxGroupItem>
					<DxSimpleItem
						data-field="registrationStatementId"
						data-type="number"
						template="statementSelectBox"
					>
						<DxLabel :text="$t('labels.registrationStatement')" />
						<DxRequiredRule
							:message="$t('notifications.required.registrationStatement')"
						/>
					</DxSimpleItem>
					<DxSimpleItem
						data-field="refusalType"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="refusalTypeOptions"
					>
						<DxLabel :text="$t('labels.refusalType')" />
						<DxRequiredRule
							:message="$t('notifications.required.refusalType')"
						/>
					</DxSimpleItem>
				</DxGroupItem>

				<DxGroupItem>
					<DxSimpleItem
						data-field="refusalLaws"
						data-type="array"
						editor-type="dxTagBox"
						:editor-options="refusalLawOptions"
					>
						<DxLabel :text="$t('labels.refusalLaws')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="refusalReasons"
						data-type="array"
						editor-type="dxTagBox"
						:editor-options="refusalReasonsOptions"
					>
						<DxLabel :text="$t('labels.refusalReasons')" />
					</DxSimpleItem>
				</DxGroupItem>
				<DxGroupItem :col-span="2" :col-count="2">
					<DxSimpleItem
						data-field="enteredServiceDate"
						data-type="datetime"
						editor-type="dxDateBox"
						:editor-options="enteredServiceDateOptions"
					>
						<DxRequiredRule />
						<DxLabel :text="$t('labels.enteredServiceDate')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="systemServiceDate"
						data-type="date"
						editor-type="dxDateBox"
						:editor-options="dateBoxOptions"
					>
						<DxLabel :text="$t('labels.systemDate')" />
					</DxSimpleItem>
					<DxSimpleItem
						data-field="userId"
						data-type="number"
						editor-type="dxSelectBox"
						:editor-options="userOptions"
					>
						<DxLabel :text="$t('labels.executor')" />
					</DxSimpleItem>
				</DxGroupItem>

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
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.registrationStatementId"
					:filter="['statementType', '=', StatementType.RegistrationStatement]"
					@valueChanged="registrationStatementChanged"
				/>
			</template>
		</DxForm>
		<DocumentEditorPopup
			v-model="documentEditorVisible"
			:data="documentEditorData"
		/>
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
import "devextreme-vue/text-area";
import "devextreme-vue/tag-box";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TagBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/TagBox/TagBoxPropertiesWithDataSource";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { IRefusalService } from "~/infrastructure/interfaces/agency/services/IRefusalService";
import { RefusalTypes } from "~/infrastructure/data-sources/agency/RefusalTypes";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxPatternRule,
		DxAsyncRule,
		DxButtonItem,
		BaseToolbar,
		StatementsSelectBox,
		DocumentEditorPopup
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
		let formData: IRefusalService = this.data;

		return {
			formData,
			StatementType,
			documentEditorVisible: false,
			documentEditorData: null
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"RefusalService"
			];
			return PermissionControler.fullAccess(permission);
		},
		refusalTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: RefusalTypes(this)
			});
		},
		refusalLawOptions() {
			return new TagBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.refusalLaw
			});
		},
		refusalReasonsOptions() {
			return new TagBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.refusalReason
			});
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		enteredServiceDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
			});
		},
		dateBoxOptions() {
			return new DateBoxProperties({
				readOnly: true
			});
		},
		userOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.user,
				displayExpr: "fullName",
				readOnly: true
			});
		}
	},
	methods: {
		registrationStatementChanged(value) {
			this.formData.registrationStatementId = value;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.services.refusalService}/${this.formData.id}`,
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
							`${this.$dataApi.services.refusalService}/${this.formData.id}`
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
		},
		onDownload() {
			DocumentLoader.load(this, {
				loadUrl: `${this.$dataApi.download.refusalService}/${this.formData.id}`,
				name: `${this.$t("navigation.agency.refusalServiceTitle")} № ${
					this.formData.id
				}.docx`
			});
		},
		onPrint() {
			if (this.documentEditorData === null) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.getHtml.refusalService}/${this.formData.id}`
					),
					e => {
						this.$awn.success();
						this.documentEditorData = e.data;
						this.documentEditorVisible = true;
					},
					e => {
						this.$awn.alert();
					}
				);
			} else {
				this.documentEditorVisible = true;
			}
		}
	}
});
</script>