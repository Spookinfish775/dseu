import Vue from "vue"
import { BookType } from "~/infrastructure/enums/BookType";


function BookTypes(context: Vue) {
    return [
        { id: BookType.RegistrationStatementBook, name: context.$t("bookType.registrationStatementBook") },
        { id: BookType.RegistrationServiceBook, name: context.$t("bookType.registrationServiceBook") },
    ];
}


export { BookTypes }