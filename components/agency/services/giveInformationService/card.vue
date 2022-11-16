<template>
	<div class="card-wrapper">
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			:canPrint="true"
			:canDownload="true"
			@save="onSave"
			@delete="onDelete"
			@print="onPrint"
			@download="onDownload"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="formData"
			:read-only="readOnly"
		>
			<DxGroupItem :caption="$t('labels.generalInformation')" :col-count="2">
				<DxSimpleItem
					data-field="giveInformationStatementId"
					data-type="number"
					template="statementSelectBox"
				>
					<DxLabel :text="$t('labels.giveInformationStatement')" />
					<DxRequiredRule />
				</DxSimpleItem>
        <DxSimpleItem
          data-field="extractIndex"
          data-type="string"
          editor-type="dxTextBox"
          :editor-options="textBoxOptions"
        >
          <DxLabel :text="$t('labels.giveInformationServiceExtractIndex')" />
        </DxSimpleItem>
				<DxSimpleItem
					data-field="blankId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="blankOptions"
				>
					<DxLabel :text="$t('labels.blank')" />
				</DxSimpleItem>
        <DxSimpleItem
					data-field="userId"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="userOptions"
				>
					<DxLabel :text="$t('labels.executor')" />
				</DxSimpleItem>
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
					:editor-options="executionTimeOptions"
				>
					<DxLabel :text="$t('labels.systemDate')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #statementSelectBox>
				<StatementsSelectBox
					:value="formData.giveInformationStatementId"
					:filter="[
						'statementType',
						'=',
						StatementType.GiveInformationStatement
					]"
					:readOnly="readOnly || giveInformationStatementId != null"
					@valueChanged="value => (formData.giveInformationStatementId = value)"
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
import DxTextArea from "devextreme-vue/text-area";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import StatementsSelectBox from "~/components/agency/statements/components/statements-select-box/index.vue";
import DocumentEditorPopup from "~/components/documentEditor/popup.vue";

import { StatementType } from "~/infrastructure/enums/StatementType";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { IGiveInformationService } from "~/infrastructure/interfaces/agency/services/IGiveInformationService";
import { blankState } from "~/infrastructure/enums/agency/blankState";
import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";

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
		DxTextArea,
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
		},
		giveInformationStatementId: {
			type: Number,
			default: null
		}
	},
	data() {
		let formData: IGiveInformationService = this.data;

		return {
			formData,
			StatementType,
			documentEditorData: null,
			documentEditorVisible: false
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"GiveInformationService"
			];
			return PermissionControler.fullAccess(permission);
		},
    textBoxOptions(){
      return new TextBoxProperties();
    },
		blankOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.blank,
				filter: ["blankState", "=", blankState.Empty],
				displayExpr: "number"
			});
		},
		enteredServiceDateOptions() {
			return new DateBoxProperties({
				dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
				type: "datetime",
				applyValueMode: "useButtons"
			});
		},
		executionTimeOptions() {
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
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.services.giveInformationService}/${this.formData.id}`,
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
							`${this.$dataApi.services.giveInformationService}/${this.formData.id}`
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
		onPrint() {
			if (this.documentEditorData === null) {
				this.$awn.asyncBlock(
					this.$axios.get(
						`${this.$dataApi.getHtml.giveInformationService}/${this.formData.id}`
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
		},
		onDownload() {
			DocumentLoader.load(this, {
				loadUrl: `${this.$dataApi.download.giveInformationService}/${this.formData.id}`,
				name: `${this.$t("navigation.agency.giveInformationServiceTitle")} № ${
					this.formData.index
				}.docx`
			});
		}
	},
	created() {
		if (this.giveInformationStatementId != null)
			this.formData.giveInformationStatementId = this.giveInformationStatementId;
	}
});
</script>
