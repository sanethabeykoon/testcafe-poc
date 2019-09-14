
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

export function verifyEmail(caseId){

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

var emailStatus = {availability:false, msgSnippet:''};

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);

    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listMessages);
    
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Retrieve Messages in user's mailbox matching query.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * 
 */
function listMessages(auth) {

  const gmail = google.gmail({version: 'v1', auth});
  
  gmail.users.messages.list(
	{
	  userId: 'me',
    query: 'q',
    maxResults: 3
	}, (err, res) => 
	{
    if (err){
      
      emailStatus.msgSnippet = 'listMessages API returned an error: ' + err;
  
    }else{

      let msgs = res.data.messages;
    
      getMessage(gmail, msgs);

    }

	});
	
}

/**
 * Get Message with given ID.
 *
 * Param1: Authorized gmail object.
 * Param2: Message IDs.
 * 
 */
function getMessage(gmail, msgs) {
  
for(let msg of msgs){

  if(emailStatus.msgSnippet == ''){

  gmail.users.messages.get(
	{
	  userId: 'me',
    id: msg.id
	}, (err, res) => 
	{
      if (err) {
        emailStatus.msgSnippet = 'getMessage API returned an error: ' + err;
      }
      else{
      
        let currentMsg = res;
      
        if(currentMsg.data.snippet.includes(caseId)){
        
          emailStatus.availability = true;
          emailStatus.msgSnippet = currentMsg.data.snippet;
        
        }
      }
  });
  }else{
    break;
  }  
}

}

return new Promise(function(resolve, reject){
  const interval = setInterval(function(){
              if (emailStatus.msgSnippet != '') {
                clearInterval(interval);
                resolve(emailStatus);
              }
            }
  , 3000);
});

}
