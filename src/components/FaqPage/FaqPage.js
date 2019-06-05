import React from 'react';
import './FaqPage.css';

export default function FaqPage() {
  return (
    <div className="main">
      <h1 className="app-title center">Frequently Asked Questions</h1>
      <div>
        <h3 className="app-subtitle">For Students & Physicians</h3>
        <div className="question-block">
          <div className="data-item column">
            <h4>How much does using findshadowing.com cost?</h4>
            <span>Absolutely nothing. This is a free service to connect physicians with students hoping to gain shadowing experience.</span>
          </div>
          <div className="data-item column">
            <h4>By signing up, am I committing to anything?</h4>
            <span>No. Students send shadowing requests at their discretion and physicians respond to shadowing requests at their discretion. By signing up for findshadowing.com, you are not committing to any set number of shadowing students or hours or any requirements.</span>
          </div>
          <div className="data-item column">
            <h4>Is the information provided such as my address secure?</h4>
            <span>Yes. We will not disclose any information given to us in your sign up and the information is only used for more accurate searches.</span>
          </div>
          <div className="data-item column">
            <h4>How often can I request a specific doctor?</h4>
            <span>You can only request them once every 60 days. At 60 days, if your request has not been approved or denied, it is removed. You may then request the same doctor again.</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="app-subtitle">For Physicians</h3>
        <div className="question-block">
          <div className="data-item column">
            <h4>How often will I have students requesting shadowing?</h4>
            <span>This is set by you! If you only want to have one student a week reach out and ask about shadowing, our system will allow you to set that. If you want every other week, you can do that too. It’s up to you!</span>
          </div>
          <div className="data-item column">
            <h4>Won’t students just email me or call me separately?</h4>
            <span>Our goal is to protect you as much as possible from students. Your information will be hidden. Students will be able to see that there is a physician in the area, willing to have students shadow, but won’t see who it is or where, specifically, the office is. Once a student requests, you’ll get an email and you’ll be able to reach back out to the student.</span>
          </div>
          <div className="data-item column">
            <h4>Am I required to write a letter of recommendation?</h4>
            <span>No. Whether or not you write a letter of recommendation for a shadowing student is completely up to your discretion.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

