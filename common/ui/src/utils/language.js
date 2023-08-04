import messages from "boot/i18n";

export default class Language {
  getMessages(lang) {
    return messages[lang];
  }
}
