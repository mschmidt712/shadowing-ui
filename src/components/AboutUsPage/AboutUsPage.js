import React from 'react';
import './AboutUsPage.css';

export default function AboutUsPage() {
  return (
    <div className="main">
      <h1 className="app-title center">About Us</h1>
      <div>
        <h3 className="app-subtitle">About Findshadowing.com</h3>
        <p className="about-us-text">Findshadowing.com is a website that connects premed students and physicians to facilitate shadowing experience. Medical school admissions require premed students to shadow a physician in order to obtain realistic expectations of the career to see if it’s right for them before committing to a substantial debt and long term degree program. The majority of premed students have struggled to gain shadowing experience as the method of communication has always been cold calls, emails and in person requests to already busy and usually overworked physicians. By creating findshadowing.com, we are hoping to bridge the gap between physicians and premed students. Physicians can control their availability, accessibility, and number of requests they are sent, while premed students get a searchable database of physicians willing to allow students to shadow them and a secure way of requesting shadowing experience. It’s completely free to sign up as a premed student and physician so sign up today for a new way to find shadowing!</p>
      </div>
      {/* <h3 className="with-horizontal-line"></h3> */}
      <div>
        <h3 className="app-subtitle">About Dr. Gray and MSHQ</h3>
        <p className="about-us-text">I am Ryan Gray and I’m a physician turned mentor to premeds and medical students through my website and podcasts at MedicalSchoolHQ.net. I started seven years ago to be a motivating and encouraging voice in the premed space. I am the author of the bestselling Premed Playbook Series, have ten current podcasts with more in the works, am active on all social media platforms with daily advice for premed students, articles published on the MSHQ website, a GPA calculator for applications, and now findshadowing.com to assist premeds with obtaining shadowing experience. My purpose and hope is to assist every student with the goal of becoming a physician through informational, inspirational and motivational podcasts, books, articles, resources, and more. For more information, check out my main website at medicalschoolhq.net. </p>
      </div>
    </div>
  )
}

