
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));


// Body Parser Middleware
//"bodyParser" has a strikethough. Could be a problem spot.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.express.json()  
//app.express.urlencoded()

//uselesscomment

app.get('/', (_req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
   const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  //Following line made my webpage render my standard 'contact' page...but with a localhost:3000/send instead of just localhost:3000 in address bar.
  //res.render('contact', {layout: false});
  console.log(req.body);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'Enter Email Here', // generated ethereal user
        pass: 'Enter Password Here', // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });

    // setup email data with unicode symbols (GARRETT FORCED TO DIVERGE FROM NODEMAILER WEBSITE HERE)
    
    let mailOptions = {
      from: '"NodeMailer Contact" <Enter Email Here>', // sender address
      to: 'Enter Email Here', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      // Error or Success displayed in console
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    res.render('contact', {msg:'Your message has been sent.', layout: false});
   
});
}); 
app.listen(3000, () => console.log('Server started'));
