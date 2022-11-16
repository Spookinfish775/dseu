import Vue from "vue"
import { Status } from "~/infrastructure/enums/Status";
import { ArchiveStatus } from '../enums/Status';


function Statuses(context: Vue) {
    return [
        { id: Status.Active, name: context.$t("status.active") },
        { id: Status.Closed, name: context.$t("status.closed") }
    ];
}

function ArchiveStatuses(context: Vue) {
    return [
        { id: ArchiveStatus.NotArchived, name: context.$t("status.notArchived") },
        { id: ArchiveStatus.InArchive, name: context.$t("status.inArchive") },
        { id: ArchiveStatus.TemporaryTaken, name: context.$t("status.temporaryTaken") }
    ];
}

export { Statuses, ArchiveStatuses }