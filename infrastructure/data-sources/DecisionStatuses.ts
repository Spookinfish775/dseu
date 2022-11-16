import Vue from "vue"
import { DecisionStatus } from "~/infrastructure/enums/DecisionStatus";



function DecisionStatuses(context: Vue) {
    return [
        { id: DecisionStatus.Review, name: context.$t("decisionStatus.review") },
        { id: DecisionStatus.Reject, name: context.$t("decisionStatus.reject") },
        { id: DecisionStatus.Denied, name: context.$t("decisionStatus.denied") },
        { id: DecisionStatus.Suspend, name: context.$t("decisionStatus.suspend") },
        { id: DecisionStatus.Renew, name: context.$t("decisionStatus.renew") },
        { id: DecisionStatus.Done, name: context.$t("decisionStatus.done") },
    ];
}


export { DecisionStatuses }