import { LocalStorage } from "quasar";
import { i18n } from 'boot/i18n';

export default class Language {
    getMessages(lang){
        return i18n.messages[lang];
    }
}