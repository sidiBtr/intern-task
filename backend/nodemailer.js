import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for TLS; true for SSL
  auth: {
    user: 'sidimedbtr@gmail.com',
    pass: '123456789',
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'sidimedbtr@gmail.com', 
      to, // List of recipients
      subject, // Subject line
      text, // Plain text body
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
