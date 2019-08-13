import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import * as userActions from '../../actions/userActions';
import * as adminActions from '../../actions/adminActions';
import * as emailActions from '../../actions/emailActions';
import './AdminPage.css';

class AdminPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      emailTemplate: {},
      editorState: EditorState.createEmpty()
    }

    this.setEditorState = this.setEditorState.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.changeTemplate = this.changeTemplate.bind(this);
    this.updateEmailTemplate = this.updateEmailTemplate.bind(this);
    this.sendTestEmail = this.sendTestEmail.bind(this);
  }

  componentDidMount() {
    this.props.getDoctorsForApproval();
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
    // this.props.sendTestEmail(this.props.email, template);
    this.props.sendTestEmail('marie.schmidt.712@gmail.com', template);
  }

  render() {
    const doctors = this.props.doctors.map(doctor => {
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
        {this.props.location.pathname === '/admin/pending-doctors' && <div>
          <h3 className="app-subtitle">Doctors Pending Approval</h3>
          {doctors.length > 0 && doctors}
          {doctors.length === 0 && <div className="request box-shadow">
            <p className="app-subtitle">No unapproved doctors found.</p>
          </div>}
        </div>}
        {this.props.location.pathname === '/admin/enrollment' && <div>
          <h3 className="app-subtitle">Enrollment Statistics</h3>
          <h5>Last Updated: {moment(this.props.updateDate).format('dddd, MMMM Do YYYY')}</h5>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fa fa-user-md"></i> Doctors</h4>
            <h1>{this.props.doctorCount}</h1>
          </div>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fa fa-user-graduate"></i> Students</h4>
            <h1>{this.props.studentCount}</h1>
          </div>
          <div className="request box-shadow center">
            <h4 className="app-subtitle"><i className="fas fa-envelope"></i> Requests</h4>
            <h1>{this.props.requestCount}</h1>
          </div>
        </div>}
        {this.props.location.pathname === '/admin/email-templates' && <div>
          <h3 className="app-subtitle">Email Templates</h3>
          <nav>
            <button className="secondary" onClick={() => { this.changeTemplate('student-welcome-email-template') }}>Student Welcome Email Template</button>
            <button className="secondary" onClick={() => { this.changeTemplate('doctor-welcome-email-template') }}>Doctor Welcome Email Template</button>
            <button className="secondary" onClick={() => { this.changeTemplate('new-request-email-template') }}>New Request Email Template</button>
            <button className="secondary" onClick={() => { this.changeTemplate('doctor-approved-email-template') }}>Doctor Approved Email Template</button>
          </nav>
          <div className="request box-shadow">
            <div className="data-item">
              <h5>Template Name</h5>
              <div className="value">
                <input type="text" name="name" value={this.state.emailTemplate.TemplateName} onChange={this.onInputChange} placeholder="Template Name" required />
              </div>
            </div>
            <div className="data-item">
              <h5>Template Subject</h5>
              <div className="value">
                <input type="text" name="subject" value={this.state.emailTemplate.SubjectPart} onChange={this.onInputChange} placeholder="Template Name" required />
              </div>
            </div>
            <h5 className="">Template Body</h5>
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapper"
              editorClassName="editor"
              onEditorStateChange={this.onEditorStateChange}
            />
            <div className="center">
              <button className="button secondary" onClick={this.sendTestEmail}>Send Test Email</button>
              <button className="button primary" onClick={this.updateEmailTemplate}>Save Template</button>
            </div>
          </div>
          {this.props.showUpdateTemplateConfirmation && <div className="modal center">
            <div className="modal-content">
              <span className="close" onClick={this.props.handleUpdateTemplateConfirmation}>&times;</span>
              <div className="modal-text">
                <h1>Template Successfully Updated</h1>
                <p>The email template has been successfully updated and will now be used for outgoing emails. You can send a test email at any time to preview the text and format.</p>
              </div>
              <button className="button primary" onClick={this.props.handleUpdateTemplateConfirmation}> Close </button>
            </div>
          </div>}
        </div>}
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
  getDoctorsForApproval: () => dispatch(userActions.getDoctorsForApproval()),
  approveDoctor: (doctor) => dispatch(userActions.approveDoctor(doctor)),
  getAdminData: () => dispatch(adminActions.getAdminData()),
  getEmailTemplates: () => dispatch(emailActions.getEmailTemplates()),
  updateEmailTemplate: (template) => dispatch(emailActions.updateEmailTemplate(template)),
  handleUpdateTemplateConfirmation: () => dispatch(emailActions.handleUpdateTemplateConfirmation()),
  sendTestEmail: (email, template) => dispatch(emailActions.sendTestEmail(email, template)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);