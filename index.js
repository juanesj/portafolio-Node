const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));



// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/send-email', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Configura el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Opciones del correo electrónico
  const mailOptions = {
    from: process.env.EMAIL_USER, // usa tu cuenta verificada
    to: 'juanesj@gmail.com',
    subject: `Contacto desde el portafolio: ${subject}`,
    text: `
      Nombre: ${name}
      Correo: ${email}
      Teléfono: ${phone}

      Mensaje:
      ${message}
    `
  };

  // Envía el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).send('Error al enviar el correo: ' + error.message);
    }

    console.log('Correo enviado correctamente:', info.response);

    // Redirige a la página principal después de enviar el correo
    res.redirect('/');
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
