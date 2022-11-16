import { IUserWorkplace } from '~/infrastructure/interfaces/administration/IUserWorkplace';
import { IEmploymentWorkplaceOrder } from '~/infrastructure/interfaces/administration/IEmploymentWorkplaceOrder';
import { EmploymentWorkplaceOrder } from './EmploymentWorkplaceOrder';

export class UserWorkplace implements IUserWorkplace {
  isMainWorkPlace: boolean
  userId: string
  organizationId: number
  jobTitleId: number
  employmentWorkplaceOrder: IEmploymentWorkplaceOrder
  constructor(payload?: IUserWorkplace) {
    this.isMainWorkPlace = payload?.isMainWorkPlace || true
    this.userId = payload?.userId || ""
    this.organizationId = payload?.organizationId || null
    this.jobTitleId = payload?.jobTitleId || null
    this.employmentWorkplaceOrder = payload?.employmentWorkplaceOrder || new EmploymentWorkplaceOrder()
  }
}