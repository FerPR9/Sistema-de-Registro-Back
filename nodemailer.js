/*require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tucorreo@gmail.com',
        pass: 'tucontraseña'
    }
});

app.post('/enviar-correo', (req, res) => {
    const { destinatario, asunto, cuerpo } = req.body;

    const mailOptions = {
        from: 'tucorreo@gmail.com',
        to: destinatario,
        subject: asunto,
        text: cuerpo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al enviar el correo');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Correo enviado correctamente');
        }
    });
});*/