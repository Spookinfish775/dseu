<template>
	<div class="card-wrapper">
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxSimpleItem
				data-field="officialDocuments"
				template="officialDocumentsList"
			>
				<DxLabel :text="$t('labels.officialDocuments')" />
			</DxSimpleItem>
			<template #encumbranceLetterSelectBox>
				<EncumbranceLetterSelectBox
					:value="formData.encumbranceLetterId"
					@valueChanged="val => (formData.encumbranceLetterId = val)"
				/>
			</template>
			<template #officialDocumentsList>
				<AcceptedDocumentsList @valueChanged="officialDocumentsChanged" />
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
	DxEmailRule,
	DxAsyncRule,
	DxPatternRule,
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import ApplicantsDataGrid from "~/components/agency/statements/components/applicants/applicants-data-grid.vue";
import AcceptedDocumentsDataGrid from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-data-grid.vue";
import AcceptedDocumentsList from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-list/index.vue";
import EncumbranceLetterSelectBox from "~/components/agency/services/encumbranceLetter/select-box/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { EncumbranceRelease } from "~/infrastructure/classes/agency/services/EncumbranceRelease";
import { IEncumbranceRelease } from "~/infrastructure/interfaces/agency/services/IEncumbranceRelease";
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
		DxTextArea,
		BaseToolbar,
		ApplicantsDataGrid,
		AcceptedDocumentsDataGrid,
		AcceptedDocumentsList,
		EncumbranceLetterSelectBox
	},
	props: {
		encumbranceLetterId: {
			type: Number,
			default: null
		}
	},
	data() {
		let formData: IEncumbranceRelease = new EncumbranceRelease({
			encumbranceLetterId: this.encumbranceLetterId
		});
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"EncumbranceRelease"
			];
			return PermissionControler.fullAccess(permission);
		},
		encumbranceLetterOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.encumbranceLetter,
				filter: ["isReleased", "=", false],
				displayExpr: "id"
			});
		}
	},
	methods: {
		officialDocumentsChanged(data) {
			this.formData.officialDocuments = data;
		},
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.encumbranceRelease, this.formData),
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