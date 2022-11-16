import Vue from "vue"
import { ArchiveStatus } from "~/infrastructure/enums/ArchiveStatus";


function ArchiveStatuses(context: Vue) {
  return [
    { id: ArchiveStatus.NotArchived, name: context.$t("archiveStatus.notArchived") },
    { id: ArchiveStatus.InArchive, name: context.$t("archiveStatus.inArchive") },
    { id: ArchiveStatus.TemporaryTaken, name: context.$t("archiveStatus.temporaryTaken") },
  ];
}


export { ArchiveStatuses }