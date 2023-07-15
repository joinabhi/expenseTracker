const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
require('dotenv').config()

const User = require('../model/user')
const Forgotpassword = require('../model/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        throw new Error('User does not exist');
      }
  
      const id = uuid.v4();
      await user.createForgotpassword({ id, active: true });
  
      sgMail.setApiKey(process.env.API_KEY);
  
      const msg = {
        to: 'abhi.gpt96@gmail.com',
        from: 'ashu@gmail.com',
        subject: 'Reset Password',
        text: 'Click the link below to reset your password',
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      };
  
      const response = await sgMail.send(msg);
  
      return res.status(response[0].statusCode).json({
        message: 'Link, To reset password has sent on your email',
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.json({ message: err.message, success: false });
    }
  };
  
  const resetpassword = async (req, res) => {
    try {
      const id = req.params.id;
      const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });
  
      if (forgotpasswordrequest) {
        await forgotpasswordrequest.update({ active: false });
  
        res.status(200).send(`
          <html>
            <script>
              function formsubmitted(event) {
                event.preventDefault();
                console.log('called');
              }
            </script>
            <form action="/password/updatepassword/${id}" method="get">
              <label for="newpassword">Enter New Password</label>
              <input name="newpassword" type="password" required></input>
              <button>Reset Password</button>
            </form>
          </html>
        `);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const updatepassword = async (req, res) => {
    try {
      const { newpassword } = req.query;
      const { resetpasswordid } = req.params;
  
      const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });
      if (!resetpasswordrequest) {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
  
      const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });
      if (!user) {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
  
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newpassword, salt);
      await user.update({ password: hash });
  
      return res.status(201).json({ message: 'Successfully updated the new password', success: true });
    } catch (error) {
      return res.status(403).json({ error, success: false });
    }
  };
  


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}