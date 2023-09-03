const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'naver',
  host: 'smtp.naver.com',
  port: 465,
  auth: {
    user: 'na841@naver.com',
    pass: 'ldg8410229!',
  },
})

const sendEmail = async (email, authNum) => {
  const mailOptions = {
    from: 'na841@naver.com',
    to: email,
    subject: '치윰 이메일 인증입니다.',
    html: `
    <section style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="height: 800px; width: 500px;">
        <div style="margin-top: 50px;">
          <img src="data:image/png;base64,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
  " alt="">
        </div>
        <div style="margin-top: 40px;">
          <div style="font-size: 35px; color: #000; font-weight: bold;">이메일 인증번호 안내</div>
        </div>
        <div style="height: 1px; width: 100%; background-color: #3CAF87; margin-top: 30px;"></div>
        <div style="margin-top: 50px;">
          <div style="font-size: 18px; color: #000;">안녕하세요 고객님. 주식회사 치윰입니다.</div>
          <div style="font-size: 18px; color: #000;">고객님의 이메일 인증을 위해 표시된 인증번호를 앱에 입력해주세요.</div>
        </div>
        <div style="margin-top: 50px;">
          <div style="background-color: #79e9c2; width: 200px; height: 50px; line-height: 50px; text-align: center;">
            <div style="font-size: 26px; color: #000; letter-spacing: 10px;">${authNum}</div>
          </div>
        </div>
        <div style="height: 1px; width: 100%; background-color: #3CAF87; margin-top: 50px;"></div>
        <div style="display: flex;flex-direction: column; align-items: center;">
          <div style="margin-top: 20px; font-size: 14px;">고객센터 123-456</div>
          <div style="margin-top: 10px; font-size: 14px;">고객센터 123-456</div>
          <div style="margin-top: 10px; font-size: 14px;">고객센터 123-456</div>
          <div style="margin-top: 10px; font-size: 14px;">고객센터 123-456</div>
          <div style="margin-top: 10px; font-size: 14px;">고객센터 123-456</div>
        </div>
      </div>  
    </section>
    `,
  }
  transporter.sendMail(mailOptions)
}

module.exports = {
  sendEmail,
}
