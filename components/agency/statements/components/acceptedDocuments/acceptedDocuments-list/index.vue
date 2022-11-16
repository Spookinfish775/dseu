<template>
  <div id="acceptedDocument-list">
    <DxToolbar v-if="!readOnly" id="acceptedDocuments-list-toolbar">
      <DxItem
        :options="createButtonOptions"
        location="after"
        widget="dxButton"
      />
    </DxToolbar>
    <DxList
      height="30vh"
      :data-source="dataSource"
      :allow-item-deleting="!readOnly"
      :read-only="readOnly"
      :use-native-scrolling="true"
      :menu-items="menuItems"
      menu-mode="context"
    >
      <template #item="{ data,index }">
        <div class="items-wrapper">
          <div class="item-wrapper" @dblclick="showApplicantData(data)">
            <component
              :data="data"
              :is="`${OfficialDocumentType[data.officialDocumentType]}ListItem`"
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
                  deleteItem(index);
                }
              "
            />
          </div>
        </div>
      </template>
    </DxList>
    <BasePopup ref="basePopup" width="70vw" height="70vh" position="top">
      <div style="margin: 0 0 20px 0">
        <AcceptedDocumentsCard
          :data="currentAcceptedDocument"
          :readOnly="readOnly"
          @successedSaved="successedSavedAcceptedDocuments"
        />
      </div>
    </BasePopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxList from "devextreme-vue/list";
import DxButton from "devextreme-vue/button";

import BasePopup from "~/components/page/popup.vue";
import AcceptedDocumentsCard from "~/components/agency/statements/components/acceptedDocuments/acceptedDocuments-card.vue";
import OfficialDocumentListItem from "./officialDocument-list-item.vue";
import DealListItem from "./deal-list-item.vue";
import { OfficialDocumentType } from "~/infrastructure/enums/agency/OfficialDocumentType";

import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export default Vue.extend({
  components: {
    DxList,
    DxToolbar,
    DxItem,
    BasePopup,
    DxButton,
    AcceptedDocumentsCard,
    OfficialDocumentListItem,
    DealListItem
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
      OfficialDocumentType,
      currentAcceptedDocument: null
    };
  },
  computed: {
    menuItems() {
      return [
        {
          text: this.$t("labels.info"),
          action: e => this.showApplicantData(e.itemData)
        }
      ];
    },
    canUpdate() {
      let permission: number = this.$store.getters["user/claims"][
        "OfficialDocument"
      ];
      return PermissionControler.canUpdate(permission);
    },
    canCreate() {
      let permission: number = this.$store.getters["user/claims"][
        "OfficialDocument"
      ];
      return PermissionControler.canCreate(permission);
    },
    createButtonOptions() {
      return {
        icon: "plus",
        type: "normal",
        visible: this.canCreate,
        useSubmitBehavior: true,
        hint: this.$t("buttons.create"),
        onClick: () => {
          this.$refs["basePopup"].open();
        }
      };
    }
  },
  watch: {
    dataSource(value) {
      this.$emit("valueChanged", value);
    }
  },
  methods: {
    deleteItem(index) {
      this.$delete(this.dataSource, index);
    },
    showApplicantData(itemData) {
      this.currentAcceptedDocument = itemData;
      this.$refs["basePopup"].open();
    },
    successedSavedAcceptedDocuments(acceptedDocument) {
      console.log(acceptedDocument);

      let result = this.dataSource.some((e, index) => {
        if (
          e.number === acceptedDocument.number &&
          e.issueDataTime === acceptedDocument.issueDataTime &&
          e.issuer === acceptedDocument.issuer &&
          e.officialDocumentNameId === acceptedDocument.officialDocumentNameId
        ) {
          this.dataSource.splice(index, 1);
          this.dataSource.push(acceptedDocument);
          return true;
        }
      });
      if (!result) this.dataSource.push(acceptedDocument);
      setTimeout(() => {
        this.$refs["basePopup"].close();
      }, 100);
    }
  }
});
</script>

<style lang="scss">
#acceptedDocument-list {
  .items-wrapper {
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
        // background: darken($color: $base-bg, $amount: 10);
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
#acceptedDocuments-list-toolbar {
  margin: 0 0 10px 0;
}
</style>
