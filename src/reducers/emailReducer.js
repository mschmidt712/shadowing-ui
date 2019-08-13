import * as emailActions from '../actions/emailTypes';

const initialState = {
  emailTemplates: [],
  showUpdateTemplateConfirmation: false,
  emailErr: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case emailActions.GET_EMAIL_TEMPLATES:
      return Object.assign({}, state, {
        emailTemplates: action.payload
      });
    case emailActions.UPDATE_EMAIL_TEMPLATE:
      const emailTemplates = state.emailTemplates.filter(template => {
        if (template.name === action.payload.name) {
          return false;
        }
        return true;
      }).push(action.payload);
      return Object.assign({}, state, {
        emailTemplates
      });
    case emailActions.SHOW_UPDATE_TEMPLATE_CONFIRMATION:
      return Object.assign({}, state, {
        showUpdateTemplateConfirmation: true
      });
    case emailActions.HIDE_UPDATE_TEMPLATE_CONFIRMATION:
      return Object.assign({}, state, {
        showUpdateTemplateConfirmation: false
      });
    default:
      return state;
  }
}