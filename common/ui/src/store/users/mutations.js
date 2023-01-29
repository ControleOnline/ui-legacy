export function setUser(state, { user }) {
  state.user = user;
}

export function setProfileProvider(state, { ProfileProvider }) {
  state.profile_provider = ProfileProvider;
}

export function setAssessments(state, { assessments }) {
  state.assessments = assessments;
}

export function setNotifications(state, { notifications }) {
  state.notifications = notifications;
}

export function setReadNotification(state, { index }) {
  state.notifications[index].read = true;
}

export function setOptionsAct(state, { optionsAct }) {
  state.options_act = optionsAct;
}

export function setOptionsLang(state, { optionsLang }) {
  state.options_lang = optionsLang;
}

export function setOptionsBloodType(state, { optionsBloodType }) {
  state.options_blood_type = optionsBloodType;
}

export function setOptionsChecksIllnesses(state, { optionsChecksIllnesses }) {
  state.checks_illnesses = optionsChecksIllnesses;
}
