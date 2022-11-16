<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="saveBooks"
			@delete="onDelete"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="books"
		>
			<DxGroupItem :col-count="2" :caption="$t('labels.generalInformation')">
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
					data-field="bookType"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="bookTypeOptions"
				>
					<DxLabel :text="$t('labels.bookType')" />
					<DxRequiredRule :message="$t('notifications.required.bookType')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="number"
					data-type="number"
					editor-type="dxNumberBox"
					:editor-options="numberBoxOptions"
				>
					<DxLabel :text="$t('labels.number')" />
					<DxRequiredRule :message="$t('notifications.required.number')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="branchId"
					data-type="number"
					template="organizationSelectBox"
				>
					<DxLabel :text="$t('labels.branch')" />
					<DxRequiredRule :message="$t('notifications.required.branch')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="status"
					data-type="number"
					editor-type="dxSelectBox"
					:editor-options="statusOptions"
					:col-span="2"
				>
					<DxLabel :text="$t('labels.status')" />
					<DxRequiredRule :message="$t('notifications.required.status')" />
				</DxSimpleItem>
			</DxGroupItem>
			<template #organizationSelectBox>
				<OrganizationSelectBox
					:value="books.branchId"
					@valueChanged="branchChanged"
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
import DxTagBox from "devextreme-vue/tag-box";
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import OrganizationSelectBox from "~/components/administration/organization/organization-select-box/index.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";

import { BookTypes } from "~/infrastructure/data-sources/BookTypes";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { IBooks } from "~/infrastructure/interfaces/IBooks";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxButtonItem,
		DxTagBox,
		DxTextArea,
		BaseToolbar,
		OrganizationSelectBox
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
		let books: IBooks = this.data;
		return {
			books
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["Book"];
			return PermissionControler.fullAccess(permission);
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		numberBoxOptions() {
			return new NumberBoxProperties();
		},
		bookTypeOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: BookTypes(this)
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		}
	},
	methods: {
		branchChanged(value) {
			this.books.branchId = value;
		},
		saveBooks() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.put(
						`${this.$dataApi.books}/${this.books.id}`,
						this.books
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
						this.$axios.delete(`${this.$dataApi.books}/${this.books.id}`),
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

