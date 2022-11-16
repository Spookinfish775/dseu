import { IAnalysisAction } from '~/infrastructure/interfaces/agency/analysisProcess/IAnalysisAction';
import { Status } from "~/infrastructure/enums/Status"


export class AnalysisAction implements IAnalysisAction {
  name: string
  status: number
  description: string
  analysisProcessId: number
  constructor(payload?: IAnalysisAction) {
    this.name = payload?.name || ""
    this.status = payload?.status || Status.Active
    this.description = payload?.description || ""
    this.analysisProcessId = payload?.analysisProcessId || null
  }
}