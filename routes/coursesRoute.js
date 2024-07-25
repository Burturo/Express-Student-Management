const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { format } = require('date-fns');
const { User, Person, Course, sequelize, QueryTypes } = require('../models/model');

// Route pour afficher les cours
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }

    const { id, username, userType } = req.session.user;
    const courses = userType === 'Etudiant' ? await getCourses() : await getCoursesWithUser(id);

    res.render('courses', { id, username, userType, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

const getCoursesWithUser = async (userId) => {
  try {
    const courses = await Course.findAll({
      where: { IdPerson: userId },
      include: [{ model: Person, attributes: ['FirstName'] }],
      order: [['createdAt', 'DESC']],
    });
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

const getCourses = async () => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Person, attributes: ['FirstName'] }],
      order: [['createdAt', 'DESC']],
    });
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Route pour créer un cours
router.post('/create', upload.single('file'), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const { id } = req.session.user;
    const { name, description, type } = req.body;
    const file = req.file;
    const currentDateTime = new Date();
    const formattedDate = format(currentDateTime, 'dd-MM-yyyy HH:mm:ss');

    await Course.create({
      displayname: name,
      description,
      type,
      document: file ? file.path : null,
      dueDate: formattedDate,
      IdPerson: id,
    });

    res.redirect('/courses');
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour mettre à jour un cours
router.post('/edit/:id', upload.single('file'), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const { name, description, type } = req.body;
    const file = req.file;

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    course.displayname = name;
    course.description = description;
    course.type = type;
    if (file) {
      course.document = file.path;
    }
    await course.save();

    res.redirect('/courses');
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour supprimer un cours
router.post('/delete/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    await course.destroy();
    res.redirect('/courses');
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
