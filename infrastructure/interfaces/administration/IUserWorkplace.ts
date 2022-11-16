import { IEmploymentWorkplaceOrder } from "./IEmploymentWorkplaceOrder";

export interface IUserWorkplace {
  isMainWorkPlace: boolean
  userId: string
  organizationId: number
  jobTitleId: number
  employmentWorkplaceOrder: IEmploymentWorkplaceOrder
}
