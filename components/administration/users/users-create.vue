<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="saveUser" />
		<DxForm
			ref="form"
			label-location="top"
			:form-data.sync="user"
			:col-count="2"
		>
			<DxGroupItem :caption="$t('labels.personalInformation')">
				<DxSimpleItem
					data-field="login"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.login')" />
					<DxRequiredRule :message="$t('notifications.required.login')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="firstName"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.firstName')" />
					<DxRequiredRule :message="$t('notifications.required.firstName')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="lastName"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.lastName')" />
					<DxRequiredRule :message="$t('notifications.required.lastName')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="middleName"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.middleName')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="dateOfBirth"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateOfBirthOptions"
				>
					<DxLabel :text="$t('labels.dateOfBirth')" />
					<DxRequiredRule :message="$t('notifications.required.dateOfBirth')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="note"
					data-type="string"
					editor-type="dxTextArea"
					:editor-options="textAreaOptions"
				>
					<DxLabel :text="$t('labels.note')" />
				</DxSimpleItem>
			</DxGroupItem>
			<DxGroupItem :caption="$t('labels.officialInformation')">
				<DxSimpleItem
					data-field="roleId"
					data-type="number"
					template="rolesSelectBox"
				>
					<DxLabel :text="$t('labels.role')" />
					<DxRequiredRule :message="$t('notifications.required.role')" />
				</DxSimpleItem>
				<DxSimpleItem
					data-field="phone"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="textBoxOptions"
				>
					<DxLabel :text="$t('labels.phone')" />
					<DxRequiredRule :message="$t('notifications.required.phone')" />
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
					data-field="dateOfAppointment"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateOfAppointmentOptions"
				>
					<DxLabel :text="$t('labels.dateOfAppointment')" />
					<DxRequiredRule
						:message="$t('notifications.required.dateOfAppointment')"
					/>
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
			<template #rolesSelectBox>
				<RolesSelectBox :value="user.roleId" @valueChanged="roleChanged" />
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RolesSelectBox from "~/components/administration/roles/roles-select-box.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { User } from "~/infrastructure/classes/administration/User";
import { IUser } from "~/infrastructure/interfaces/administration/IUser";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		BaseToolbar,
		RolesSelectBox,
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
	data() {
		let user: IUser = new User();
		return {
			user
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"]["User"];
			return PermissionControler.fullAccess(permission);
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		dateOfBirthOptions() {
			return new DateBoxProperties();
		},
		dateOfAppointmentOptions() {
			return new DateBoxProperties({
				onValueChanged: () => {
					this.user.dateOfDismissal = null;
				}
			});
		},
		roleOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.role,
				filter: ["name", "<>", "Administrator"]
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		}
	},
	methods: {
		roleChanged(data) {
			this.user.roleId = data;
		},
		saveUser() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.user, this.user),
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