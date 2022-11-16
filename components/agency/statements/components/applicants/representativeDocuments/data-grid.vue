<template>
	<div>
		<DxDataGrid
			height="60vh"
			:data-source="dataSource"
			:show-borders="true"
			:hoverStateEnabled="true"
			:errorRowEnabled="false"
			:remote-operations="true"
			:allow-column-reordering="true"
			:allow-column-resizing="true"
			:column-auto-width="true"
			:load-panel="{
				enabled: true,
				indicatorSrc: require('~/static/icons/loading.gif')
			}"
			@saved="onSaved"
		>
			<DxScrolling mode="virtual" />
			<DxEditing
				:allow-adding="!readOnly"
				:allow-updating="!readOnly"
				:allow-deleting="!readOnly"
				:useIcons="true"
				mode="form"
			/>

			<DxColumn
				data-field="officialDocumentNameId"
				data-type="number"
				:caption="$t('labels.name')"
				edit-cell-template="officialDocumentNameEditor"
				:set-cell-value="
					(rowData, value, currentRowData) =>
						setCellValue(
							rowData,
							value,
							'officialDocumentNameId',
							currentRowData
						)
				"
			>
				<DxLookup
					value-expr="id"
					display-expr="name"
					:data-source="officialDocumentNameDataSource"
				/>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="number"
				data-type="string"
				:caption="$t('labels.number')"
				:set-cell-value="
					(rowData, value, currentRowData) =>
						setCellValue(rowData, value, 'number', currentRowData)
				"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="issueDataTime"
				data-type="date"
				:caption="$t('labels.issueDataTime')"
				:set-cell-value="
					(rowData, value, currentRowData) =>
						setCellValue(rowData, value, 'issueDataTime', currentRowData)
				"
			>
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="expiredDate"
				data-type="date"
				:caption="$t('labels.endDate')"
				:set-cell-value="
					(rowData, value, currentRowData) =>
						setCellValue(rowData, value, 'expiredDate', currentRowData)
				"
			/>
			<DxColumn
				data-field="issuer"
				data-type="string"
				:caption="$t('labels.issuer')"
				edit-cell-template="issuerEditor"
				:set-cell-value="
					(rowData, value, currentRowData) =>
						setCellValue(rowData, value, 'issuer', currentRowData)
				"
			>
				<DxFormItem :col-span="2" />
				<DxRequiredRule />
			</DxColumn>
			<DxColumn
				data-field="description"
				data-type="string"
				:caption="$t('labels.description')"
			>
				<DxFormItem
					:col-span="2"
					:editor-options="textAreaOptions"
					editor-type="dxTextArea"
				/>
			</DxColumn>
			<DxColumn
				data-field="fullInformation"
				data-type="string"
				:caption="$t('labels.fullInformation')"
			>
				<DxFormItem
					:col-span="2"
					:editor-options="fullInformationOptions"
					editor-type="dxTextArea"
				/>
			</DxColumn>

			<template #officialDocumentNameEditor="{ data: cellInfo }">
				<OfficialDocumentName
					:readOnly="readOnly"
					:value="cellInfo.value"
					@valueChanged="value => onValueChanged(value, cellInfo)"
				/>
			</template>
			<template #issuerEditor="{ data: cellInfo }">
				<DxAutocomplete
					:data-source="issuerDataSource"
					:value.sync="cellInfo.value"
					value-expr="name"
					value-change-event="focusout"
					@valueChanged="({ value }) => onValueChanged(value, cellInfo)"
				/>
			</template>
		</DxDataGrid>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";

import {
	DxDataGrid,
	DxColumn,
	DxEditing,
	DxFormItem,
	DxScrolling,
	DxRequiredRule,
	DxLookup
} from "devextreme-vue/data-grid";
import "devextreme-vue/text-area";
import { DxAutocomplete } from "devextreme-vue/autocomplete";
import DxTextBox from "devextreme-vue/text-box";
import DxDateBox from "devextreme-vue/date-box";

import OfficialDocumentName from "~/components/administration/officialDocumentName/select-box.vue";
import { DateBoxProperties } from "~/infrastructure/components-properties/DateBoxProperties";
import { TextAreaProperties } from "~/infrastructure/components-properties/TextAreaProperties";
import { TextBoxProperties } from "~/infrastructure/components-properties/TextBoxProperties";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
	components: {
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxFormItem,
		DxScrolling,
		DxRequiredRule,
		DxLookup,
		DxTextBox,
		DxDateBox,
		DxAutocomplete,
		OfficialDocumentName
	},
	props: {
		data: {
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
			dataSource: this.data,
			officialDocumentNameDataSource: this.$dxStore({
				key: "id",
				loadUrl: this.$dataApi.officialDocumentName
			}),
			issuerDataSource: this.$dxStore({
				loadUrl: this.$dataApi.letterSenderOrganization,
				key: "name"
			})
		};
	},
	computed: {
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationOfStatement"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"RegistrationOfStatement"
			];
			return PermissionControler.fullAccess(permission);
		},
		dateBoxOptions() {
			return new DateBoxProperties();
		},
		textAreaOptions() {
			return new TextAreaProperties();
		},
		textBoxOptions() {
			return new TextBoxProperties();
		},
		fullInformationOptions() {
			return new TextAreaProperties({
				readOnly: true
			});
		}
	},
	methods: {
		async setCellValue(rowData, value, rowName, currentRowData) {
			rowData[rowName] = value;
			rowData.fullInformation = await this.getFullInformation({
				...currentRowData,
				...rowData
			});
		},
		onValueChanged(value, cellInfo) {
			cellInfo.setValue(value);
			cellInfo.component.updateDimensions();
		},
		async getFullInformation(rowData) {
			try {
				moment.locale('en');
				let { data } = await this.$axios.get(
					this.$dataApi.stringParser.officialDocument,
					{
						params: {
							officialDocumentNameId: rowData?.officialDocumentNameId,
							number: rowData?.number,
							issueDataTime: moment(rowData?.issueDataTime).format("L").replaceAll("/", "."),
							expiredDate: moment(rowData?.expiredDate).format("L").replaceAll("/", "."),
							issuer: rowData?.issuer
						}
					}
				);
				return data;
			} catch (error) {
				console.error(error);
				return "";
			}
		},
		onSaved() {
			this.dataSource.forEach(data => {
				delete data["__KEY__"];
			});
			this.$emit("valueChanged", this.dataSource);
		}
	}
});
</script>