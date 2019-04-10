import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import awsData from '../aws-config.json';

const poolData = {
  UserPoolId : awsData['pool-id'],
  ClientId : awsData['app-client']
};

export default {
  loginUser: (email, password, handleLoginClose) => {
    const authenticationDetails = new AuthenticationDetails({
      Username : email,
      Password : password,
    });
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username : email,
      Pool : userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        console.log('Access Token: ', accessToken);
        handleLoginClose();
      },
      onFailure: (err) => {
        console.log(err);
        alert(err.message || JSON.stringify(err));
      }
    });
  },
  registerUser: (email, password) => {
    const userPool = new CognitoUserPool(poolData);
    
    let attributeList = [];
    const dataEmail = {
        Name : 'email',
        Value : email
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList = [...attributeList, attributeEmail];


    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, function(err, result){
        if (err) {
          return reject(err);
        }
        const cognitoUser = result.user;
        return resolve(cognitoUser);
      });
    }).then(user => {
      console.log(`New User Registered with Email: ${user.getUsername()}`);
      return {
        displaySignUp: false,
        displayVerification: true
      };
    }).catch(err => {
      alert(err.message || JSON.stringify(err));
    })
  },
  verifyUser: (email, verification) => {
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username : email,
      Pool : userPool
    };

    var cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(verification, true, function(err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }).then(result => {
      console.log(`Account Verification: ${result}`);
      return {
        displayVerification: false, 
        displayConfirmation: true
      };
    }).catch(err => {
      alert(err.message || JSON.stringify(err));
    })
  },
  logoutUser: () => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
  },
  checkAuthStatus: () => {
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      return new Promise ((resolve, reject) => {
        return cognitoUser.getSession(function(err, session) {
          if (err) {
            return reject(err);
          }

          return resolve(session);
        });
      }).then(session => {
        console.log('Session Validity: ' + session.isValid());
        if (session.isValid()) {
          return {
            isLoggedIn: true
          };
        } else {
          return {
            isLoggedIn: false
          };   
        }
      }).catch(err => {
        alert(err.message || JSON.stringify(err));
      });
    } else {
      return new Promise(resolve => ({
        isLoggedIn: false
      }))
    }
  },
  resendVerification (email) {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username : email,
      Pool : userPool
    });

    return new Promise((resolve, reject) => {
      return cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
          return reject (err);
        }
        return resolve(result);
      });
    }).then(result => {
      console.log(`Account Verification: ${result}`);
    }).catch(err => {
      alert(err.message || JSON.stringify(err));
    });
  }
}