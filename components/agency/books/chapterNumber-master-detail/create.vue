<template>
	<div>
		<BaseToolbar :canSave="canCreate" @save="onSave" />
		<DxForm ref="form" label-location="top" :form-data.sync="formData">
			<DxSimpleItem
				data-field="bookChapterId"
				data-type="number"
				editor-type="dxSelectBox"
				:editor-options="bookChapterOptions"
			>
				<DxLabel :text="$t('labels.bookChapter')" />
				<DxRequiredRule />
			</DxSimpleItem>
			<DxSimpleItem
				data-field="numberFrom"
				data-type="number"
				editor-type="dxNumberBox"
				:editor-options="numberBoxOptions"
			>
				<DxLabel :text="$t('labels.numberFrom')" />
				<DxRequiredRule />
			</DxSimpleItem>
			<DxSimpleItem
				data-field="numberTo"
				data-type="number"
				editor-type="dxNumberBox"
				:editor-options="numberBoxOptions"
			>
				<DxLabel :text="$t('labels.numberTo')" />
				<DxRequiredRule />
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
	DxButtonItem
} from "devextreme-vue/form";
import DxTextArea from "devextreme-vue/text-area";
import DxTagBox from "devextreme-vue/tag-box";

import BaseToolbar from "~/components/page/base-toolbar.vue";

import { SelectBoxPropertiesWithDataSource } from "~/infrastructure/components-properties/SelectBox/SelectBoxPropertiesWithDataSource";
import { NumberBoxProperties } from "~/infrastructure/components-properties/NumberBoxProperties";

import { ChapterNumber } from "~/infrastructure/classes/ChapterNumber";
import { IChapterNumber } from "~/infrastructure/interfaces/IChapterNumber";
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
		BaseToolbar
	},
	props: {
		bookChapterId: {
			type: Number,
			required: true
		}
	},
	data() {
		let formData: IChapterNumber = new ChapterNumber({
			bookChapterId: this.bookChapterId,
			numberFrom: null,
			numberTo: null
		});
		return {
			formData
		};
	},
	computed: {
		canCreate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.canCreate(permission);
		},
		canUpdate() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.canUpdate(permission);
		},
		fullAccess() {
			let permission: number = this.$store.getters["user/claims"][
				"ChapterNumber"
			];
			return PermissionControler.fullAccess(permission);
		},
		numberBoxOptions() {
			return new NumberBoxProperties();
		},
		bookChapterOptions() {
			return new SelectBoxPropertiesWithDataSource(this, {
				loadUrl: this.$dataApi.bookChapters,
				disabled: true
			});
		}
	},
	methods: {
		onSave() {
			let result = this.$refs["form"].instance.validate();
			if (result.isValid) {
				this.$awn.asyncBlock(
					this.$axios.post(this.$dataApi.chapterNumber, this.formData),
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

