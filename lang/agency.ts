import { LocaleMessageObject } from 'vue-i18n/types'

const messages: LocaleMessageObject = {
  createBlanks: "Şahadatnama blanklarny goşmak",
  sendBlanks: "Şahadatnama blanklaryny ugratmak",
  createDestroyedActTitle:"Ýok etmek delilnamasyny döretmek",
  blankStates: {
    Empty: "Boş",
    Damaged: "Zaýalanan",
    Defected: "Zeper ýeten",
    Given: "Berilen",
    Exchange: "Öwezligi doldurylan",

  },
  transferType: {
    Incoming: "Gelýän",
    Outgoing: "Çykýan"
  },
  alert: {
    chooseAcceptingBlanks: "Kabul edilýän blanklary saýlaň",
    chooseOutgoingBlanks: "Ugradylan blanklary saýlaň",
    chooseEmptyBlanks: "Boş we ýok edilmedik blanklary saýlaň"
  },
  confirm: {
    deleteSelectedBlanks: "Saýlanan Blanklary pozmak",
    acceptedSelectedBlanks: "Saýlanan Blanklary kabul etmek",
    deleteBlank: "Blanky pozmak",
    acceptBlank: "Blanky kabul etmek",
  },
  buttons: {
    createAct:"Yok etmek delilnamasy döretmek"
  }
}
export default messages;
