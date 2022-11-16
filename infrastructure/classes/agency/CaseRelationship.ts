import { ICaseRelationship } from '~/infrastructure/interfaces/agency/ICaseRelationship';

export class CaseRelationship implements ICaseRelationship {
  caseParentId: number
  caseChildId: number
  constructor(payload?: ICaseRelationship) {
    this.caseParentId = this.caseParentId || null
    this.caseChildId = this.caseChildId || null
  }
}