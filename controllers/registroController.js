const Registro = require("../models/Registro");
const Conferencia = require("../models/Conferencia");
const Taller = require("../models/Taller");
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico de Gmail
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de Gmail
    }
});

// Supongamos que este contador se guarda y actualiza en la base de datos.
let contadorFolio = 1; // Deberás implementar la lógica para incrementarlo y guardarlo en cada registro.

exports.crearRegistro = async (req, res) => {
    console.log('Datos recibidos:', req.body);
    try {
        let registro = new Registro(req.body);
        await registro.save();

        // Actualizar el cupo de la conferencia o taller
        let nombreEvento = '';
        if (req.body.conferenciaId) {
            const conferencia = await Conferencia.findById(req.body.conferenciaId);
            if (conferencia && conferencia.cupoConferencia > 0) {
                conferencia.cupoConferencia -= 1;
                await conferencia.save();
                nombreEvento = conferencia.nombreConferencia;
                console.log("Nombre del evento (conferencia):",nombreEvento);
            }
        } else if (req.body.tallerId) {
            const taller = await Taller.findById(req.body.tallerId);
            if (taller && taller.cupoTaller > 0) {
                taller.cupoTaller -= 1;
                await taller.save();
                nombreEvento = taller.nombreTaller;
                console.log("Nombre del evento (taller):", nombreEvento);
            }
        }

        const apellidoPaterno = req.body.apellidoPaterno.split(' ')[0]; // Tomar solo el primer apellido
        const folio = `${req.body.nombre.split(' ')[0]}-${apellidoPaterno}-${String(contadorFolio).padStart(5, '0')}`;
        contadorFolio++;

        // Configurar las opciones del correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registro.correoElectronico,
            subject: 'Confirmación de Registro en el Evento',
            text: `Estimado(a) ${registro.nombre},\n\nTe has registrado con éxito en el evento ${nombreEvento}. Tu folio de participación es: ${folio}.\n\nSaludos cordiales,\nEl equipo organizador`
        };

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Hubo un error al enviar el correo electrónico.');
            } else {
                console.log('Email enviado: ' + info.response);
                res.status(200).send(`Registro creado y correo enviado con éxito. Folio: ${folio}`);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerRegistros = async (req, res) => {
    try {

        const registros = await Registro.find();
        res.json(registros)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarRegistro = async (req, res) => {
    try {
        const { nombre, correoElectronico, telefono, areaTrabajo, foto } = req.body;
        let registro = await Registro.findById(req.params.id);

        if (!registro) {
            res.status(404).json({ msg: 'No existe el registro' })
        }

        registro.nombre = nombre;
        registro.correoElectronico = correoElectronico;
        registro.telefono = telefono;
        registro.areaTrabajo = areaTrabajo;
        registro.foto = foto;

        registro = await Registro.findOneAndUpdate({ _id: req.params.id }, registro, { new: true })
        res.json(registro);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');

    }
}

exports.obtenerRegistro = async (req, res) => {
    try {
        let registro = await Registro.findById(req.params.id);

        if (!registro) {
            res.status(404).json({ msg: 'No existe el registro' })
        }
        res.json(registro);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarRegistro = async (req, res) => {
    try {
        let registro = await Registro.findById(req.params.id);

        if (!registro) {
            res.status(404).json({ msg: 'No existe el registro' })
        }
        await Registro.findOneAndRemove({ _id: req.params.id })
        res.json({ msg: 'Registro eliminado con exito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}