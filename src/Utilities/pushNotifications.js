var admin = require("firebase-admin");
var fcm = require('fcm-notification');
const {privateFile}=require('./privateFile')
var serviceAccount = privateFile
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);


sendPushNotification= (token,userId,title,body,result) => {

  try{
      let message = {
          android: {
              notification: {
                  title: title,
                  body: body,
              },
              data: {
                  user_id: userId.toString(),
                }
          },
token:token,   
};

      FCM.send(message, function(err, resp) {
          if(err){
result(err,undefined)     

}else{
              result(undefined,resp)
          }
      });

  }catch(err){
      throw err;
      }

  }
module.exports={
  sendPushNotification
}