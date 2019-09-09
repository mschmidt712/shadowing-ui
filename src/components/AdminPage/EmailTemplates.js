import React from 'react';
import { Editor } from 'react-draft-wysiwyg';

export default function EmailTemplates(props) {
  return (
    <div>
      <h3 className="app-subtitle">Email Templates</h3>
      <nav>
        <button className="secondary" onClick={() => { props.changeTemplate('student-welcome-email-template') }}>Student Welcome Email Template</button>
        <button className="secondary" onClick={() => { props.changeTemplate('doctor-welcome-email-template') }}>Doctor Welcome Email Template</button>
        <button className="secondary" onClick={() => { props.changeTemplate('new-request-email-template') }}>New Request Email Template</button>
        <button className="secondary" onClick={() => { props.changeTemplate('doctor-approved-email-template') }}>Doctor Approved Email Template</button>
      </nav>
      <div className="request box-shadow">
        <div className="data-item">
          <h5>Template Name</h5>
          <div className="value">
            <input type="text" name="name" value={props.emailTemplate.TemplateName} onChange={props.onInputChange} placeholder="Template Name" required />
          </div>
        </div>
        <div className="data-item">
          <h5>Template Subject</h5>
          <div className="value">
            <input type="text" name="subject" value={props.emailTemplate.SubjectPart} onChange={props.onInputChange} placeholder="Template Name" required />
          </div>
        </div>
        <h5 className="">Template Body</h5>
        <Editor
          editorState={props.editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={props.onEditorStateChange}
        />
        <div className="center">
          <button className="button secondary" onClick={props.sendTestEmail}>Send Test Email</button>
          <button className="button primary" onClick={props.updateEmailTemplate}>Save Template</button>
        </div>
      </div>
      {props.showUpdateTemplateConfirmation && <div className="modal center">
        <div className="modal-content">
          <span className="close" onClick={props.handleUpdateTemplateConfirmation}>&times;</span>
          <div className="modal-text">
            <h1>Template Successfully Updated</h1>
            <p>The email template has been successfully updated and will now be used for outgoing emails. You can send a test email at any time to preview the text and format.</p>
          </div>
          <button className="button primary" onClick={props.handleUpdateTemplateConfirmation}> Close </button>
        </div>
      </div>}
    </div>
  )
}
