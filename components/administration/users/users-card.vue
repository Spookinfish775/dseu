<template>
	<div>
		<BaseToolbar
			v-if="!readOnly"
			:canSave="canUpdate"
			:canDelete="fullAccess"
			@save="saveUser"
			@delete="deleteUser"
		/>
		<DxForm
			ref="form"
			label-location="top"
			:read-only="readOnly"
			:form-data.sync="user"
			:col-count="2"
		>
			<DxGroupItem :caption="$t('labels.personalInformation')">
				<DxSimpleItem
					data-field="login"
					data-type="string"
					editor-type="dxTextBox"
					:editor-options="loginOptions"
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
					data-field="dateOfDismissal"
					data-type="date"
					editor-type="dxDateBox"
					:editor-options="dateOfDismissalOptions"
				>
					<DxLabel :text="$t('labels.dateOfDismissal')" />
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

				<DxGroupItem :col-count="3">
					<DxButtonItem
						:button-options="resetPasswordOptions"
						horizontal-alignment="left"
					/>
					<DxButtonItem
						:button-options="userLockOptions"
						horizontal-alignment="left"
					/>
				</DxGroupItem>
			</DxGroupItem>
			<template #rolesSelectBox>
				<RolesSelectBox
					:value="user.roleId"
					:readOnly="!canUpdate || !fullAccess"
					@valueChanged="roleChanged"
				/>
			</template>
		</DxForm>
		<UserBlock ref="userBlock" :userId="user.id" />
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
import { confirm } from "devextreme/ui/dialog";

import BaseToolbar from "~/components/page/base-toolbar.vue";
import RolesSelectBox from "~/components/administration/roles/roles-select-box.vue";
import UserBlock from "./user-block.vue";

import { SelectBoxPropertiesWithLocalData } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithLocalData";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { IUser } from "~/infrastructure/interfaces/administration/IUser";
import { Statuses } from "~/infrastructure/data-sources/Statuses";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxForm,
		DxGroupItem,
		DxSimpleItem,
		DxLabel,
		DxRequiredRule,
		DxEmailRule,
		DxAsyncRule,
		DxButtonItem,
		DxTextArea,
		BaseToolbar,
		RolesSelectBox,
		UserBlock
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
		let user: IUser = this.data;
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
		loginOptions() {
			return new TextBoxProperties({
				readOnly: true
			});
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
		dateOfDismissalOptions() {
			return new DateBoxProperties({
				disabled: this.user.dateOfAppointment === null ? true : false,
				min: this.user.dateOfAppointment
			});
		},
		statusOptions() {
			return new SelectBoxPropertiesWithLocalData({
				dataSource: Statuses(this)
			});
		},
		resetPasswordOptions() {
			return {
				icon: "pulldown",
				text: this.$t("labels.resetPassword"),
				onClick: () => {
					const result = confirm(
						this.$t("notifications.confirm.areYouSure"),
						this.$t("notifications.confirm.index")
					);
					result.then(dialogResult => {
						if (dialogResult) {
							this.$awn.asyncBlock(
								this.$axios.post(`${this.$dataApi.user}/ResetPassword`, {
									userId: this.user.id
								}),
								e => {
									this.$awn.success();
								},
								e => {
									this.$awn.alert();
								}
							);
						}
					});
				}
			};
		},
		userLockOptions() {
			return {
				text: this.$t("labels.userLock"),
				onClick: () => {
					this.$refs.userBlock.open();
				}
			};
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
					this.$axios.put(`${this.$dataApi.user}/${this.user.id}`, this.user),
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
		deleteUser() {
			const result = confirm(
				this.$t("notifications.confirm.areYouSure"),
				this.$t("notifications.confirm.index")
			);
			result.then(dialogResult => {
				if (dialogResult) {
					this.$awn.asyncBlock(
						this.$axios.delete(`${this.$dataApi.user}/${this.user.id}`),
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

<style lang="scss">
.substitutional-workplace {
	margin: 19px 0 0 0;
	display: flex;
	justify-content: flex-end;
}
</style>
