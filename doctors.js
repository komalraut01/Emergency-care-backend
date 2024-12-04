const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'secretkey';
const Doctor = require('./models/doctor');
const bcrypt = require('bcrypt');

const doctorAuth = require('./middleware/doctor-auth');
const doctor = require('./models/doctor');


async function findUserByEmail(email){
    const doctor = await Doctor.findOne({email});
    return doctor;
}
router.post('/register', async (req, resp) => {
    const { name, email, password,specilist,address,working_time} = req.body;
    const existingDoctor = await findUserByEmail(email);
    if(existingDoctor){
        resp.status(400).json({message: 'email already registered'});
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor();
    doctor.name = name;
    doctor.email = email;
    doctor.password = hashPassword;
    doctor.specilist = specilist;
    doctor.address = address;
    doctor.working_time = working_time;
    doctor.save();
    resp.status(200).json({ message: 'doctor created successfully' })
})
router.post('/login', async (req, resp) => {
    const {email, password} = req.body;

    const doctor = await findUserByEmail(email);
    if(!doctor){
        resp.status(401).json({message: 'this email is not registered'});
    }

    const passwordMatch = await bcrypt.compare(password,doctor.password);
    if(!passwordMatch){
        resp.status(401).json({message: 'please provide correct password'});
    }
    const token = await jwt.sign({id:doctor._id,email:doctor.email,name:doctor.name},'doctor-secrets',{expiresIn:'7h'});
    resp.status(200).json({token}); 
})

router.get('/list',async(req,resp) => {
    const result = await Doctor.find();
    resp.status(200).json(result)
})

router.get('/id/:id',async (req, resp)=> {
    try {
        const _id = req.params.id;
        const result = await Doctor.findById(_id);
        if (!result){
            resp.status(401).json({message: "doctor with this id not found"});
        }
        resp.status(200).json(result);   
    } catch (error) {
       resp.status(401).json({message: error.message});
    }
   
})

router.get('/profile', doctorAuth.verifyDoctorToken, async (req, resp) => {
    const _id = req.doctor.id;
    const result = await Doctor.findById(_id);
    resp.status(200).json(result);
})

router.put('/updateProfile', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const _id = req.doctor.id;
    const result = await Doctor.updateOne({_id},req.body);
    resp.status(200).json({message:"Profile updated successfully"});
})

module.exports = router;




