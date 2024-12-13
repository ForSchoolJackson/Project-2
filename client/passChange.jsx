// imports
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// handle thr password change
const handlePasswordChange = async (e) => {
    e.preventDefault();
    helper.hideError();

    const currentPassword = e.target.querySelector('#pass').value;
    const newPassword = e.target.querySelector('#newPass').value;
    const newPassword2 = e.target.querySelector('#newPass2').value;

    if (!currentPassword || !newPassword || !newPassword2) {
      helper.handleError('All fields are required!');
      return false;
    }

    if (newPassword !== newPassword2) {
      helper.handleError('New passwords do not match!');
      return false;
    }
    
    helper.sendPost(e.target.action, { currentPassword, newPassword, newPassword2 });
    return false;
  };


//chnage password componant
const ChangePasswordWindow = () => {
    return (
      <form onSubmit={handlePasswordChange}>
        <h2>Change Your Password</h2>
  
        <input id="pass" type="password" name="pass" placeholder="current password" />
        <input id="newPass" type="password" name="newPass" placeholder="new password" />
        <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
        <input className="formSubmit" type="submit" value="Submit" />
        <div id="message" class='hidden'>
                <h3><span id="errorMessage"></span></h3>
            </div>
      </form>
    );
  };

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<ChangePasswordWindow />)
};

window.onload = init;