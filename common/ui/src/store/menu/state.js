export default function () {
  return {
    buttons_profile_menu: [
      {
        label: 'edit_profile',
        to: 'edit-profile',
        icon: 'o_edit',
      },
      {
        label: 'personal_data',
        to: 'personal-data',
        icon: 'o_person',
      },
      {
        label: 'change_password',
        to: 'change-password',
        icon: 'o_lock',
      },
      {
        label: 'your_guides',
        to: 'your-guides',
        icon: 'o_local_activity',
      },
      {
        label: 'reviews',
        to: 'reviews',
        icon: 'star',
      },
      {
        label: 'bank_data',
        to: 'categories',
        icon: 'o_payments',
      },
      {
        label: 'send_feedback',
        to: 'categories',
        icon: 'o_message',
      },
      {
        label: 'terms_policies',
        to: 'categories',
        icon: 'subject',
      },
      {
        label: 'logout',
        to: 'login',
        icon: 'logout',
      },
    ],
    buttons_reviews_menu: [
      {
        label: 'reviews_received',
        to: 'categories',
        icon: 'star',
      },
      {
        label: 'assessments_carried',
        to: 'categories',
        icon: 'star',
      },
    ],
    buttons_your_guides: [
      {
        label: 'add_guide',
        to: 'add-guide',
        icon: 'o_note_add',
      },
      {
        label: 'view_edit_guide',
        to: 'view-edit-guide',
        icon: 'collections_bookmark',
      },
      {
        label: 'reserve_management',
        to: 'reserve-management',
        icon: 'o_calendar_month',
      },
    ],
    buttons_your_guides_customers: [
      {
        label: 'upcoming_itineraries',
        to: 'next-guides',
        icon: 'o_local_activity',
      },
      {
        label: 'concluded_guides',
        to: 'concluded-guides',
        icon: 'o_history',
      },
      {
        label: 'your_favorites',
        to: 'your-favorites',
        icon: 'o_favorite_border',
      },
    ],
    states: [
      {
        label: 'Acre',
        value: 'AC',
      },
      {
        label: 'Alagoas',
        value: 'AL',
      },
      {
        label: 'Amapá',
        value: 'AP',
      },
      {
        label: 'Amazonas',
        value: 'AM',
      },
      {
        label: 'Bahia',
        value: 'BA',
      },
      {
        label: 'Ceará',
        value: 'CE',
      },
      {
        label: 'Distrito Federal',
        value: 'DF',
      },
      {
        label: 'Espírito Santo',
        value: 'ES',
      },
      {
        label: 'Goiás',
        value: 'GO',
      },
      {
        label: 'Maranhão MA',
        value: 'MA',
      },
      {
        label: 'Mato Grosso',
        value: 'MT',
      },
      {
        label: 'Mato Grosso do Sul',
        value: 'MS',
      },
      {
        label: 'Minas Gerais',
        value: 'MG',
      },
      {
        label: 'Pará',
        value: 'PA',
      },
      {
        label: 'Paraíba',
        value: 'PB',
      },
      {
        label: 'Paraná',
        value: 'PR',
      },
      {
        label: 'Pernambuco',
        value: 'PE',
      },
      {
        label: 'Piauí',
        value: 'PI',
      },
      {
        label: 'Rio de Janeiro',
        value: 'RJ',
      },
      {
        label: 'Rio Grande do Norte',
        value: 'RN',
      },
      {
        label: 'Rio Grande do Sul',
        value: 'RS',
      },
      {
        label: 'Rondônia',
        value: 'RO',
      },
      {
        label: 'Roraima',
        value: 'RR',
      },
      {
        label: 'Santa Catarina',
        value: 'SC',
      },
      {
        label: 'São Paulo',
        value: 'SP',
      },
      {
        label: 'Sergipe',
        value: 'SE',
      },
      {
        label: 'Tocantins',
        value: 'TO',
      },
    ],
    selectedLanguage: {
      en: {
        label: 'English',
        value: 'en',
        iconImage: 'united-states',
      },
      es: {
        label: 'Spanish',
        value: 'es',
        iconImage: 'spain',
      },
      pt: {
        label: 'Português',
        value: 'pt',
        iconImage: 'brazil',
      },
    },
    langOptions: [
      {
        label: 'Português',
        value: 'pt',
        iconImage: 'brazil',
      },
      {
        label: 'English',
        value: 'en',
        iconImage: 'united-states',
      },
      {
        label: 'Spanish',
        value: 'es',
        iconImage: 'spain',
      },
    ],
    buttons_footer_menu: [
      {
        label: 'home',
        icon: 'o_home',
        to: 'categories',
        permissions: ['provider', 'cliente'],
      },
      {
        label: 'history',
        icon: 'o_history',
        to: 'concluded-guides',
        permissions: ['cliente'],
      },
      {
        label: 'favorite',
        icon: 'favorite_border',
        to: 'your-favorites',
        permissions: ['cliente'],
      },
      {
        label: 'messages',
        icon: 'o_question_answer',
        to: '',
        permissions: ['provider', 'cliente'],
      },
      {
        label: 'profile',
        icon: 'o_person',
        to: 'profile',
        permissions: ['provider', 'cliente'],
      },
    ],
  };
}
