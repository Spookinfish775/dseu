<template>
	<div id="applicant-list">
		<DxToolbar v-if="!readOnly" id="applicants-list-toolbar">
			<DxItem
				:options="applicantSelectBoxOptions"
				location="before"
				widget="dxSelectBox"
			/>
			<DxItem
				:options="specialApplicantListButtonOptions"
				location="after"
				widget="dxButton"
			/>
			<DxItem :options="listButtonOptions" location="after" widget="dxButton" />
			<DxItem
				:options="createButtonOptions"
				location="after"
				widget="dxButton"
			/>
		</DxToolbar>
		<div class="items-wrapper">
			<div
				@dblclick="() => showApplicantData(data)"
				v-for="data in applicants"
				class="item-wrapper"
				:key="data.id"
			>
				<component
					style="flex-grow: 1"
					:is="ApplicantType[data.applicantType]"
					:data="data"
					:applicantStatement="findApplicantStatement(data)"
				/>
				<DxButton
					text="Statusy"
					type="success"
					styling-mode="contained"
					:visible="!readOnly"
					@click="openRepresentativeDocumentForm(data)"
				/>
				<DxTextBox
					v-if="manipulateWithPartOfRigth(data)"
					:key="data.id"
					width="120"
					:placeholder="$t('labels.partOfRight')"
					:read-only="readOnly"
					:hover-state-enabled="false"
					value-change-event="input"
					:value="partOfRight(data)"
					@valueChanged="e => partOfRightsChanged(e, data)"
					@dblclick.stop="() => {}"
				/>
				<DxButton
					class="item-wrapper__delete"
					icon="trash"
					:hint="$t('buttons.delete')"
					type="danger"
					styling-mode="contained"
					:visible="!readOnly"
					@dblclick.stop="() => {}"
					@click="
						e => {
							deleteItem(data.id);
						}
					"
				/>
				<BasePopup
					:ref="`representativeDocument-${data.id}`"
					width="70vw"
					height="90vh"
				>
					<RepresentativeDocument
						:data="representativeDocument(data)"
						@representativeSaved="representativeSaved"
					/>
				</BasePopup>
			</div>
		</div>
		<BasePopup ref="listPopup" width="70vw" height="90vh" position="top">
			<ApplicantViewDataGreed
				:filter="applicantFilter"
				@valueSelected="successedSavedApplicant"
			/>
		</BasePopup>

		<BasePopup ref="applicantPopup" width="70vw" height="90vh" position="top">
			<ApplicantCard
				v-if="isCard"
				:data="currentApplicant"
				:readOnly="readOnly"
				@successedSaved="successedSavedApplicant"
			/>
			<ApplicantCreate v-else @successedSaved="successedSavedApplicant" />
		</BasePopup>

		<BasePopup
			ref="specialApplicantViewDataGrid"
			width="70vw"
			height="90vh"
			position="top"
		>
			<SpecialApplicantViewDataGrid />
		</BasePopup>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxList from "devextreme-vue/list";
import DxTextBox from "devextreme-vue/text-box";
import { DxScrollView } from "devextreme-vue/scroll-view";
import DxCheckBox from "devextreme-vue/check-box";
import DxButton from "devextreme-vue/button";

import BasePopup from "~/components/page/popup.vue";
import ApplicantCreate from "~/components/agency/statements/components/applicants/applicant-create.vue";
import ApplicantCard from "~/components/agency/statements/components/applicants/applicant-card.vue";
import SpecialApplicantViewDataGrid from "~/components/agency/specialApplicant/view-grid.vue";
import Individual from "./list-item/individual-list-item.vue";
import LegalEntity from "./list-item/legalEntity-list-item.vue";
import LetterSenderOrganization from "./list-item/letterSenderOrganization-list-item.vue";
import ApplicantViewDataGreed from "~/components/agency/statements/components/applicants/applicant-list/applicants-view-data-grid.vue";
import RepresentativeDocument from "~/components/agency/statements/components/applicants/representativeDocuments/index.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { RepresentativeType } from "~/infrastructure/enums/RepresentativeType";
import { ApplicantType } from "~/infrastructure/enums/ApplicantType";

export default Vue.extend({
	components: {
		DxList,
		DxTextBox,
		DxToolbar,
		DxItem,
		DxScrollView,
		DxCheckBox,
		ApplicantCreate,
		ApplicantCard,
		ApplicantViewDataGreed,
		Individual,
		LegalEntity,
		LetterSenderOrganization,
		DxButton,
		BasePopup,
		SpecialApplicantViewDataGrid,
		RepresentativeDocument
	},
	props: {
		data: {
			type: Array,
			default: () => []
		},
		applicantStatements: {
			type: Array,
			default: () => []
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			applicants: this.data,
			applicantspartOfRights: this.applicantStatements,
			isCard: false,
			currentApplicant: null,
			ApplicantType,
			searchApplicant: null,
			applicantFilter: null,
			representativeDocumentFormVisible: false,
			representativeDocumentRef: null,
			representativeDocumentStatus: null
		};
	},
	computed: {
		applicantSelectBoxOptions() {
			return {
				...new SelectBoxPropertiesWithDataSource(this, {
					loadUrl: this.$dataApi.applicant,
					openOnFieldClick: false,
					showDropDownButton: false,
					searchExpr: "informationForSearch",
					displayExpr: "informationForSearch",
					onItemClick: e => {
						this.successedSavedApplicant(e.itemData);
						e.component.reset();
					}
				}),
				width: "500px"
			};
		},
		specialApplicantListButtonOptions() {
			return {
				icon: "/icons/navigation/specialApplicant.svg",
				type: "normal",
				useSubmitBehavior: true,
				onClick: () => {
					this.$refs.specialApplicantViewDataGrid.open();
				}
			};
		},
		listButtonOptions() {
			return {
				icon: "bulletlist",
				type: "normal",
				useSubmitBehavior: true,
				onClick: () => {
					this.applicantFilter = [
						"applicantType",
						"<>",
						ApplicantType.LetterSenderOrganization
					];
					this.$refs["listPopup"].open();
				}
			};
		},
		createButtonOptions() {
			return {
				icon: "plus",
				type: "normal",
				useSubmitBehavior: true,
				hint: this.$t("buttons.create"),
				onClick: () => {
					this.isCard = false;
					this.$refs["applicantPopup"].open();
				}
			};
		}
	},
	watch: {
		applicants() {
			this.$emit("valueChanged", this.applicants);
		}
	},
	methods: {
		manipulateWithPartOfRigth(data) {
			let st = this.applicantStatements.find(
				element => data.id === element.applicantId
			);
			return st.statementApplicantStatus === RepresentativeType.Owner;
		},
		partOfRightVisible(data) {
			this.applicantStatements.forEach(element => {
				if (data.id === element.applicantId) {
					if (element.statementApplicantStatus === 1) {
					}
				}
			});
		},
		findApplicantStatement(applicant) {
			return this.applicantStatements.find(
				element => element.applicantId === applicant.id
			);
		},
		representativeSaved(val) {
			this.representativeDocumentRef.close();
			this.$emit("representativeSaved", {
				...val,
				currentApplicant: this.currentApplicant
			});
		},
		representativeDocument(data) {
			let separated: any = {};
			this.applicantStatements.find(element => {
				if (element.applicantId == data.id) {
					separated.representativeType = element.statementApplicantStatus;
					separated.representativeDocuments = element.representativeDocuments;
				}
			});
			return separated;
		},
		partOfRight(data) {
			return this.applicantStatements.find(element => {
				if (element.applicantId == data.id) return element;
			})?.part;
		},
		showApplicantData(data) {
			this.isCard = true;
			this.currentApplicant = data;
			this.$refs["applicantPopup"].open();
		},
		partOfRightsChanged(e, data) {
			let { value } = e;
			let { id } = data;
			this.applicantStatements.forEach(element => {
				if (element.applicantId === id) {
					element.part = value;
				}
			});
		},
		deleteItem(id) {
			const index = this.data.findIndex(el => el.id === id);
			const applicantStatementsIndex = this.applicantStatements.findIndex(
				el => el.applicantId === id
			);
			this.$delete(this.applicantStatements, applicantStatementsIndex);
			this.$delete(this.applicants, index);
		},
		successedSavedApplicant(applicant) {
			let result = this.applicants.some((e, index) => {
				if (e.id === applicant.id) {
					this.applicants.splice(index, 1);
					this.applicants.push(applicant);
					return true;
				}
				if (
					applicant.applicantType === ApplicantType.LetterSenderOrganization
				) {
					this.applicants.splice(index, 1);
					this.applicants.push(applicant);
					return true;
				}
			});
			if (!result) this.applicants.push(applicant);
			setTimeout(() => {
				this.$refs["listPopup"].close();
				this.$refs["applicantPopup"].close();
			}, 100);
		},
		openRepresentativeDocumentForm(data) {
			this.currentApplicant = data;
			this.representativeDocumentRef = this.$refs[
				"representativeDocument-" + data.id
			][0];
			this.representativeDocumentRef.open();
		}
	}
});
</script>

<style lang="scss">
#applicant-list {
	#applicants-list-toolbar {
		margin: 0 0 10px 0;
	}
	.items-wrapper {
		height: 300px;
		overflow-y: scroll;
		overflow-x: hidden;
		.item-wrapper {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin: 8px 0;
			padding: 8px;
			border-radius: $base-border-radius;
			transition: 0.3s;
			&:hover {
				background: darken($color: $base-bg, $amount: 10);
				.item-wrapper__delete {
					width: auto;
					visibility: visible;
				}
			}
			&__delete {
				width: 0;
				visibility: hidden;
			}
		}
	}
}
</style>