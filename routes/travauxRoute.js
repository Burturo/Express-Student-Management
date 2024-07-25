const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { format } = require('date-fns');
const { User, Person, Travaux, sequelize, QueryTypes } = require('../models/model');

router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    const { id, username, userType } = req.session.user;
    const travaux = userType === 'Professeur' ? await getTravaux() : await getTravauxsWithUser(id);

    res.render('travaux', { id, username, userType, travaux });
  } catch (error) {
    console.error('Error fetching travaux:', error);
    res.status(500).send('Internal Server Error');
  }
});

const getTravauxsWithUser = async (userId) => {
  try {
    const travaux = await Travaux.findAll({
      where: { IdPerson: userId },
      include: [{ model: Person, attributes: ['FirstName'] }],
      order: [['createdAt', 'DESC']],
    });
    return travaux;
  } catch (error) {
    console.error('Error fetching travaux:', error);
    throw error;
  }
};

const getTravaux = async () => {
  try {
    const travaux = await Travaux.findAll({
      include: [{ model: Person, attributes: ['FirstName'] }],
      order: [['createdAt', 'DESC']],
    });
    return travaux;
  } catch (error) {
    console.error('Error fetching travaux:', error);
    throw error;
  }
};

router.post('/create', upload.single('file'), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const { id, userType } = req.session.user;
    const { name, description, type } = req.body;
    const file = req.file;
    const currentDateTime = new Date();
    const formattedDate = format(currentDateTime, 'dd-MM-yyyy HH:mm:ss');

    await Travaux.create({
      displayname: name,
      description: description,
      type: type,
      document: file ? file.path : null,
      dueDate: formattedDate,
      IdPerson: id,
    });

    res.redirect('/travaux');
  } catch (error) {
    console.error('Error creating travail:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', upload.single('file'), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const { id } = req.params;
    const { name, description, type, dueDate } = req.body;
    const file = req.file;

    const travail = await Travaux.findByPk(id);
    if (travail) {
      travail.displayname = name;
      travail.description = description;
      travail.type = type;
      if (file) {
        travail.document = file.path;
      }
      await travail.save();
    }

    res.redirect('/travaux');
  } catch (error) {
    console.error('Error editing travail:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const travail = await Travaux.findByPk(req.params.id);
    if (!travail) {
      return res.status(404).send('Travail not found');
    }

    await travail.destroy();
    res.redirect('/travaux');
  } catch (error) {
    console.error('Error deleting travail:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour le téléchargement
router.get('/download/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const travail = await Travaux.findByPk(req.params.id);
    console.log(travail);
    if (!travail.document) {
      res.redirect('/travaux');
      console.error(`Travail not found with id: ${req.params.id}`);
    }

    if (travail.document) {
      const filePath = path.join(__dirname, '..', travail.document); // Assurez-vous que ce chemin est correct
      console.log(`File path resolved to: ${filePath}`);

      if (fs.existsSync(filePath)) {
        console.log(`File exists at path: ${filePath}`);
        res.download(filePath, path.basename(filePath));
      } else {
        console.error(`File not found at path: ${filePath}`);
        res.redirect('/travaux');
      }
    } else {
      console.error('No document associated with this travail.');
      res.redirect('/travaux');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;

