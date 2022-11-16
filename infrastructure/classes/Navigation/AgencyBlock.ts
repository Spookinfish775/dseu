import { IClaim } from "~/infrastructure/interfaces/IClaim";
import { IBaseNavigation } from "~/infrastructure/interfaces/navigation/IBaseNavigation";
import { BaseNavigation } from "~/infrastructure/classes/navigation/BaseNavigation";
import { PermissionControler } from "~/infrastructure/classes/PermissionControler";

export class AgencyBlock implements IBaseNavigation {
  name: string;
  path: string;
  title: string;
  description?: string;
  icon?: string;
  visible: boolean = true;
  items: IBaseNavigation[];
  constructor() {
    this.name = "agency";
    this.path = "/agency";
    this.title = "navigation.agency.title";
    this.description = "navigation.agency.description";
    this.icon = "agencyIcon.svg";
    this.items = [];
  }
  generateItemsByClaims(filteredClaims: IClaim) {

    if (filteredClaims.hasOwnProperty("Statement")) {
      let statements = new BaseNavigation({ name: "agency.statements", path: `${this.path}/statements`, title: "navigation.agency.statementsTitle", description: "navigation.agency.statementsDescription", icon: "statementsIcon.svg", visible: true })
      if (
        PermissionControler.canCreate(filteredClaims["RegistrationStatement"]) ||
        PermissionControler.canCreate(filteredClaims["SuspendStatement"]) ||
        PermissionControler.canCreate(filteredClaims["ChangeStatement"]) ||
        PermissionControler.canCreate(filteredClaims["GiveInformationStatement"]) ||
        PermissionControler.canCreate(filteredClaims["LegalAidStatement"]) ||
        PermissionControler.canCreate(filteredClaims["ConfirmationStatement"])
      ) {
        let createStatements = new BaseNavigation({ name: "agency.createStatements", path: `${this.path}/statements/create`, title: "navigation.agency.createStatementsTitle", visible: true })
        if (PermissionControler.canCreate(filteredClaims["RegistrationStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createRegistrationStatement", path: `${this.path}/statements/registrationStatement/create`, title: "navigation.agency.registrationStatementTitle", description: "navigation.agency.registrationStatementDescription", icon: "registrationStatementIcon.svg", visible: true }))
        }
        if (PermissionControler.canCreate(filteredClaims["SuspendStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createSuspendStatement", path: `${this.path}/statements/suspendStatement/create`, title: "navigation.agency.suspendStatementTitle", description: "navigation.agency.suspendStatementDescription", icon: "suspendStatementIcon.svg", visible: true }))
        }
        if (PermissionControler.canCreate(filteredClaims["ChangeStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createChangeStatement", path: `${this.path}/statements/changeStatement/create`, title: "navigation.agency.changeStatementTitle", description: "navigation.agency.changeStatementDescription", icon: "changeStatementIcon.svg", visible: true }))
        }
        if (PermissionControler.canCreate(filteredClaims["GiveInformationStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createGiveInformationStatement", path: `${this.path}/statements/giveInformationStatement/create`, title: "navigation.agency.giveInformationStatementTitle", description: "navigation.agency.giveInformationStatementDescription", icon: "giveInformationStatementIcon.svg", visible: true }))
        }
        if (PermissionControler.canCreate(filteredClaims["LegalAidStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createLegalAidStatement", path: `${this.path}/statements/legalAidStatement/create`, title: "navigation.agency.legalAidStatementTitle", description: "navigation.agency.legalAidStatementDescription", icon: "legalAidStatementIcon.svg", visible: true }))
        }
        if (PermissionControler.canCreate(filteredClaims["ConfirmationStatement"])) {
          createStatements.addItem(new BaseNavigation({ name: "agency.createConfirmationStatement", path: `${this.path}/statements/confirmationStatement/create`, title: "navigation.agency.confirmationStatementTitle", description: "navigation.agency.confirmationStatementDescription", icon: "confirmationStatementIcon.svg", visible: true }))
        }
        statements.addItem(createStatements)
      }
      this.items.push(statements)
    }

    if (filteredClaims.hasOwnProperty("Service")) {
      let services = new BaseNavigation({ name: "agency.services", path: `${this.path}/services`, title: "navigation.agency.servicesTitle", description: "navigation.agency.servicesDescription", icon: "servicesIcon.svg", visible: true });
      //TODO возможно придётся оставить
      if (
        filteredClaims.hasOwnProperty("RegistrationService") ||
        filteredClaims.hasOwnProperty("SuspendService") ||
        filteredClaims.hasOwnProperty("ChangeService") ||
        filteredClaims.hasOwnProperty("GiveInformationService") ||
        filteredClaims.hasOwnProperty("LegalAidService") ||
        filteredClaims.hasOwnProperty("ConfirmationService")
      ) {
        let createServices = new BaseNavigation({ name: "agency.createServices", path: `${this.path}/services/create`, title: "navigation.agency.createServicesTitle", visible: false })
        if (filteredClaims.hasOwnProperty("RegistrationService")) {
          let registrationService = new BaseNavigation({ name: "agency.registrationService", path: `${this.path}/services/registrationService`, title: "navigation.agency.registrationServiceTitle", description: "navigation.agency.registrationServiceDescription", icon: "registrationStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["RegistrationService"])) {
            registrationService.addItem(new BaseNavigation({ name: "agency.createRegistrationService", path: `${this.path}/services/registrationService/create`, title: "navigation.agency.createRegistrationServiceTitle", visible: true }))
          }
          createServices.addItem(registrationService);
        }
        if (filteredClaims.hasOwnProperty("SuspendService")) {
          let suspendService = new BaseNavigation({ name: "agency.suspendService", path: `${this.path}/services/suspendService`, title: "navigation.agency.suspendServiceTitle", description: "navigation.agency.suspendServiceDescription", icon: "suspendStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["SuspendService"])) {
            suspendService.addItem(new BaseNavigation({ name: "agency.createSuspendService", path: `${this.path}/services/suspendService/create`, title: "navigation.agency.createSuspendServiceTitle", visible: true }))
          }
          createServices.addItem(suspendService);
        }
        if (filteredClaims.hasOwnProperty("ChangeService")) {
          let changeService = new BaseNavigation({ name: "agency.changeService", path: `${this.path}/services/changeService`, title: "navigation.agency.changeServiceTitle", description: "navigation.agency.changeServiceDescription", icon: "changeStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["ChangeService"])) {
            changeService.addItem(new BaseNavigation({ name: "agency.createChangeService", path: `${this.path}/services/changeService/create`, title: "navigation.agency.createChangeServiceTitle", visible: true }))
          }
          createServices.addItem(changeService);
        }
        if (filteredClaims.hasOwnProperty("GiveInformationService")) {
          let giveInformationService = new BaseNavigation({ name: "agency.giveInformationService", path: `${this.path}/services/giveInformationService`, title: "navigation.agency.giveInformationServiceTitle", description: "navigation.agency.giveInformationServiceDescription", icon: "giveInformationStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["GiveInformationService"])) {
            giveInformationService.addItem(new BaseNavigation({ name: "agency.createGiveInformationService", path: `${this.path}/services/giveInformationService/create`, title: "navigation.agency.createGiveInformationServiceTitle", visible: true }))
          }
          createServices.addItem(giveInformationService);
        }
        if (filteredClaims.hasOwnProperty("LegalAidService")) {
          let legalAidService = new BaseNavigation({ name: "agency.legalAidService", path: `${this.path}/services/legalAidService`, title: "navigation.agency.legalAidServiceTitle", description: "navigation.agency.legalAidServiceDescription", icon: "legalAidStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["LegalAidService"])) {
            legalAidService.addItem(new BaseNavigation({ name: "agency.createLegalAidService", path: `${this.path}/services/legalAidService/create`, title: "navigation.agency.createLegalAidServiceTitle", visible: true }))
          }
          createServices.addItem(legalAidService);
        }
        if (filteredClaims.hasOwnProperty("ConfirmationService")) {
          let confirmationService = new BaseNavigation({ name: "agency.confirmationService", path: `${this.path}/services/confirmationService`, title: "navigation.agency.confirmationServiceTitle", description: "navigation.agency.confirmationServiceDescription", icon: "confirmationStatementIcon.svg", visible: true })
          if (PermissionControler.canCreate(filteredClaims["ConfirmationService"])) {
            confirmationService.addItem(new BaseNavigation({ name: "agency.createConfirmationService", path: `${this.path}/services/confirmationService/create`, title: "navigation.agency.createConfirmationServiceTitle", visible: true }))
          }
          createServices.addItem(confirmationService);
        }
        services.addItem(createServices);
      }
      if (filteredClaims.hasOwnProperty("RegistrationService")) {
        let registrationService = new BaseNavigation({ name: "agency.registrationService", path: `${this.path}/services/registrationService`, title: "navigation.agency.registrationServiceTitle", description: "navigation.agency.registrationServiceDescription", icon: "registrationStatementIcon.svg", visible: true })
        if (PermissionControler.canCreate(filteredClaims["RegistrationService"])) {
          registrationService.addItem(new BaseNavigation({ name: "agency.createRegistrationService", path: `${this.path}/services/registrationService/create`, title: "navigation.agency.createRegistrationServiceTitle", visible: true }))
        }
        services.addItem(registrationService);
      }
      if (filteredClaims.hasOwnProperty("RefusalService")) {
        let refusalService = new BaseNavigation({ name: "agency.refusalService", path: `${this.path}/services/refusalService`, title: "navigation.agency.refusalServiceTitle", description: "navigation.agency.refusalServiceDescription", icon: "emty.png", visible: true })
        if (PermissionControler.canCreate(filteredClaims["RefusalService"])) {
          refusalService.addItem(new BaseNavigation({ name: "agency.createRefusalService", path: `${this.path}/services/refusalService/create`, title: "navigation.agency.createRefusalServiceTitle", visible: true }))
        }
        services.addItem(refusalService);
      }
      this.items.push(services);
    }

    if (filteredClaims.hasOwnProperty("EncumbranceLetter")) {
      let encumbranceLetter = new BaseNavigation({ name: "agency.encumbranceLetter", path: `${this.path}/services/encumbranceLetter`, title: "navigation.agency.encumbranceLetterTitle", description: "navigation.agency.encumbranceLetterDescription", icon: "encumbranceLetterIcon.svg", visible: true })
      if (PermissionControler.canCreate(filteredClaims["EncumbranceLetter"])) {
        encumbranceLetter.addItem(new BaseNavigation({ name: "agency.createEncumbranceLetter", path: `${this.path}/services/encumbranceLetter/create`, title: "navigation.agency.createEncumbranceLetterTitle", visible: false }))
      }
      this.items.push(encumbranceLetter);
    }

    if (filteredClaims.hasOwnProperty("Blank")) {
      let blank = new BaseNavigation({ name: "agency.blank", path: `${this.path}/blank`, title: "navigation.agency.blankTitle", description: "navigation.agency.blankDescription", icon: "blankIcon.svg", visible: true });
      if (filteredClaims.hasOwnProperty("BlankTransfer")) {
        blank.addItem(new BaseNavigation({ name: "agency.blankTransfer", path: `${this.path}/blank/transfer`, title: "navigation.agency.blankTransferTitle", visible: true }));
      }
      if (filteredClaims.hasOwnProperty("BlankDestroy")) {
        blank.addItem(new BaseNavigation({ name: "agency.destroyedAct", path: `${this.path}/blank/destroyed-act`, title: "navigation.agency.destroyedAct", visible: true }));
      }
      this.items.push(blank);
    }

    if (filteredClaims.hasOwnProperty("Book")) {
      let books = new BaseNavigation({ name: "agency.books", path: `${this.path}/books`, title: "navigation.agency.booksTitle", description: "navigation.agency.booksDescription", icon: "booksIcon.svg", visible: true });
      if (PermissionControler.canCreate(filteredClaims["Book"])) {
        books.addItem(new BaseNavigation({ name: "agency.createBooks", path: `${this.path}/books/create`, title: "navigation.agency.createBooksTitle", visible: true }));
      }
      if (filteredClaims.hasOwnProperty("UserBook")) {
        books.addItem(new BaseNavigation({ name: "agency.userBooks", path: `${this.path}/books/userBooks`, title: "navigation.agency.userBooksTitle", description: "navigation.agency.userBooksDescription", visible: true }));
      }
      this.items.push(books);
    }

    if (
      filteredClaims.hasOwnProperty("Payment") ||
      filteredClaims.hasOwnProperty("Prepayment")
    ) {
      let paymentServices = new BaseNavigation({ name: "agency.paymentServices", path: `${this.path}/paymentServices`, title: "navigation.agency.paymentServicesTitle", description: "navigation.agency.paymentServicesDescription", icon: "paymentServicesIcon.svg", visible: true });
      if (filteredClaims.hasOwnProperty("Prepayment")) {
        let prepayment = new BaseNavigation({ name: "agency.prepayment", path: `${this.path}/paymentServices/prepayment`, title: "navigation.agency.prepaymentTitle", description: "navigation.agency.prepaymentDescription", icon: "preparPaymentIcon.svg", visible: true })
        if (PermissionControler.canCreate(filteredClaims["Prepayment"])) {
          prepayment.addItem(new BaseNavigation({ name: "agency.createPrepayment", path: `${this.path}/paymentServices/prepayment/create`, title: "navigation.agency.createPrepaymentTitle", visible: true }));
        }
        paymentServices.addItem(prepayment);
      }
      if (filteredClaims.hasOwnProperty("Payment")) {
        let payment = new BaseNavigation({ name: "agency.payment", path: `${this.path}/paymentServices/payment`, title: "navigation.agency.paymentTitle", description: "navigation.agency.paymentDescription", icon: "paymentIcon.svg", visible: true })
        if (PermissionControler.canCreate(filteredClaims["Payment"])) {
          payment.addItem(new BaseNavigation({ name: "agency.createPayment", path: `${this.path}/paymentServices/payment/create`, title: "navigation.agency.createPaymentTitle", visible: true }));
        }
        paymentServices.addItem(payment);
      }
      this.items.push(paymentServices);
    }


    if (filteredClaims.hasOwnProperty("Notification")) {
      let notification = new BaseNavigation({ name: "agency.notification", path: `${this.path}/notification`, title: "navigation.agency.notificationTitle", description: "navigation.agency.notificationDescription", icon: "notificationIcon.svg", visible: true });
      if (PermissionControler.canCreate(filteredClaims["Notification"])) {
        notification.addItem(new BaseNavigation({ name: "agency.createNotification", path: `${this.path}/notification/create`, title: "navigation.agency.createNotificationTitle", visible: true }));
      }
      this.items.push(notification);
    }
    // if (filteredClaims.hasOwnProperty("CaseRelationship")) {
    //   let caseRelationship = new BaseNavigation({ name: "agency.caseRelationship", path: `${this.path}/caseRelationship`, title: "navigation.agency.caseRelationshipTitle", description: "navigation.agency.caseRelationshipDescription", icon: "caseRelationshipIcon.svg", visible: true });
    //   if (PermissionControler.canCreate(filteredClaims["CaseRelationship"])) {
    //     caseRelationship.addItem(new BaseNavigation({ name: "agency.createСaseRelationship", path: `${this.path}/caseRelationship/create`, title: "navigation.agency.createСaseRelationshipTitle", visible: true }));
    //   }
    //   this.items.push(caseRelationship);
    // }

    if (filteredClaims.hasOwnProperty("SpecialApplicant")) {
      let specialApplicant = new BaseNavigation({ name: "agency.specialApplicant", path: `${this.path}/specialApplicant`, title: "navigation.agency.specialApplicantTitle", description: "navigation.agency.specialApplicantDescription", icon: "specialApplicant.svg", visible: true });
      if (PermissionControler.canCreate(filteredClaims["SpecialApplicant"])) {
        specialApplicant.addItem(new BaseNavigation({ name: "agency.createSpecialApplicant", path: `${this.path}/specialApplicant/create`, title: "navigation.agency.createSpecialApplicantTitle", visible: true }));
        this.items.push(specialApplicant)
      }
    }

    if (filteredClaims.hasOwnProperty("Stamp")) {
      let stamps = new BaseNavigation({ name: "agency.stamps", path: `${this.path}/stamps`, title: "navigation.agency.stampsTitle", description: "navigation.agency.stampsDescription", icon: "stampIcon.svg", visible: true })
      stamps.addItem(new BaseNavigation({ name: "agency.createStamp", path: `${this.path}/stamps/create`, title: "navigation.agency.createStampTitle", visible: true }))
      this.items.push(stamps)
    }
  }
}