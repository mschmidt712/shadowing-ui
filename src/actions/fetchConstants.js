let env = 'Test';
if (process.env.REACT_APP_ENV === 'production') {
  env = 'Production';
} else if (process.env.REACT_APP_ENV === 'staging') {
  env = 'Staging'
}


console.log(`App is fetching from ${env}`);
export const baseUrl = `https://uaql4ffn74.execute-api.us-east-1.amazonaws.com/${env}`;