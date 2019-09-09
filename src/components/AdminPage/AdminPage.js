import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import DoctorsPendingApproval from './DoctorsPendingApproval';
import Enrollment from './Enrollment';
import EmailTemplates from './EmailTemplates';
import * as userActions from '../../actions/userActions';
import * as adminActions from '../../actions/adminActions';
import * as emailActions from '../../actions/emailActions';
import './AdminPage.css';

class AdminPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      emailTemplate: {},
      editorState: EditorState.createEmpty(),
      showDoctors: false,
      showStudents: false
    }

    this.setEditorState = this.setEditorState.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.changeTemplate = this.changeTemplate.bind(this);
    this.updateEmailTemplate = this.updateEmailTemplate.bind(this);
    this.sendTestEmail = this.sendTestEmail.bind(this);
    this.toggleEnrollmentVisibility = this.toggleEnrollmentVisibility.bind(this);
  }

  componentDidMount() {
    this.props.getDoctors();
    this.props.getStudents();
    this.props.getAdminData();
    this.props.getEmailTemplates();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.emailTemplate !== this.state.emailTemplate) {
      this.setEditorState();
    }
  }

  setEditorState() {
    const blocksFromHTML = convertFromHTML(this.state.emailTemplate.HtmlPart);
    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    this.setState({
      editorState: EditorState.createWithContent(content)
    });
  }

  onInputChange(e) {
    this.setState({
      currentTemplate: {
        [e.target.name]: e.target.value
      }
    })
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  };

  changeTemplate(templateName) {
    const emailTemplate = this.props.emailTemplates.filter(template => {
      if (templateName === template.TemplateName) {
        return true;
      }
      return false;
    }).reduce((obj, template) => {
      return template;
    }, {});
    this.setState({
      emailTemplate
    });
  }

  updateEmailTemplate() {
    const template = Object.assign({}, this.state.emailTemplate, {
      HtmlPart: stateToHTML(this.state.editorState.getCurrentContent())
    });

    this.props.updateEmailTemplate(template);
  }

  sendTestEmail() {
    const template = Object.assign({}, this.state.emailTemplate, {
      HtmlPart: stateToHTML(this.state.editorState.getCurrentContent())
    });
    this.props.sendTestEmail(this.props.email, template);
  }

  toggleEnrollmentVisibility(occupation) {
    const prop = `show${occupation}`;
    this.setState({
      [prop]: !this.state[prop]
    });
  }

  render() {
    const doctorsForApproval = this.props.doctors.filter(doctor => {
      return !doctor.approved;
    }).map(doctor => {
      return <div className="request box-shadow" key={doctor.id}>
        <div className="component-header">
          <div className="component-header-details">
            <i className="fa fa-user-md"></i>
            <div>
              <h3 className="request-data-header">{doctor.name}, {doctor.degree}</h3>
              <h5 className="app-subtitle">{doctor.specialty}</h5>
              <h5 className="app-subtitle">{doctor.address.streetAddress}, {doctor.address.city}, {doctor.address.state} {doctor.address.zipCode}</h5>
            </div>
          </div>
          <p className="component-header-right">Account Opened: {new Date(doctor.createdDate).toDateString()}</p>
        </div>
        <img className="badge-image" src={doctor.badgePhoto} alt="Physician Badge" />
        <div className="center-block">
          <button className="button primary" onClick={() => this.props.approveDoctor(doctor)}>
            Approve
          </button>
          <button className="button secondary">
            Decline
          </button>
        </div>
      </div>
    });
    return (
      <div className="main">
        <h1 className="app-title">Admin Dashboard</h1>
        <nav>
          <button className="secondary"><Link to="/admin/pending-doctors" className="no-decoration secondary">Doctors Pending Approval</Link></button>
          <button className="secondary"><Link to="/admin/enrollment" className="no-decoration secondary">Enrollment Statistics</Link></button>
          <button className="secondary"><Link to="/admin/email-templates" className="no-decoration secondary">Email Templates</Link></button>
        </nav>
        <p className="with-horizontal-line"></p>
        {this.props.location.pathname === '/admin/pending-doctors' &&
          <DoctorsPendingApproval
            doctorsForApproval={doctorsForApproval}
          />}
        {this.props.location.pathname === '/admin/enrollment' &&
          <Enrollment
            updateDate={this.props.updateDate}
            doctors={this.props.doctors}
            showDoctors={this.state.showDoctors}
            doctorCount={this.props.doctorCount}
            students={this.props.students}
            showStudents={this.state.showStudents}
            studentCount={this.props.studentCount}
            requestCount={this.props.requestCount}
            toggleEnrollmentVisibility={this.toggleEnrollmentVisibility}

          />}
        {this.props.location.pathname === '/admin/email-templates' &&
          <EmailTemplates
            changeTemplate={this.changeTemplate}
            emailTemplate={this.state.emailTemplate}
            onInputChange={this.onInputChange}
            editorState={this.state.editorState}
            onEditorStateChange={this.onEditorStateChange}
            sendTestEmail={this.sendTestEmail}
            updateEmailTemplate={this.updateEmailTemplate}
            showUpdateTemplateConfirmation={this.props.showUpdateTemplateConfirmation}
            handleUpdateTemplateConfirmation={this.props.handleUpdateTemplateConfirmation}
          />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.authReducer,
  ...state.userReducer,
  ...state.adminReducer,
  ...state.emailReducer
});

const mapDispatchToProps = dispatch => ({
  getDoctors: () => dispatch(userActions.getDoctors()),
  getStudents: () => dispatch(userActions.getStudents()),
  approveDoctor: (doctor) => dispatch(userActions.approveDoctor(doctor)),
  getAdminData: () => dispatch(adminActions.getAdminData()),
  getEmailTemplates: () => dispatch(emailActions.getEmailTemplates()),
  updateEmailTemplate: (template) => dispatch(emailActions.updateEmailTemplate(template)),
  handleUpdateTemplateConfirmation: () => dispatch(emailActions.handleUpdateTemplateConfirmation()),
  sendTestEmail: (email, template) => dispatch(emailActions.sendTestEmail(email, template)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);