import { TransferType as TransferTypeGuid } from '../../enums/agency/transferType';
import { BaseDataSource } from '../baseDataSource';
import * as imageSource from '~/static/icons/agency/transfer-type';
export class TransferType extends BaseDataSource {
  constructor(ctx) {
    let entityName = "agency.transferType"
    super(ctx, TransferTypeGuid, entityName, imageSource)
  }
}