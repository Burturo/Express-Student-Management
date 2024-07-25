const express = require('express');
const router = express.Router();
const { User, Course, Travaux,sequelize, QueryTypes } = require('../models/model');

router.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const { id, username, userType } = req.session.user;
    let reporting;
    const allUsersCount= await getTotalUserCount();
    if (userType === 'Etudiant') {
      reporting = {
        CourseCount: await getTotalCourseCount(),
        travauxCount: await getTravauxCountByUserId(id),
      };
    } else {
      reporting = {
        travauxCount: await getTotalTravauxCount(),
        CourseCount: await getCourseCountByUserId(id),
      };
    }
    console.log("Result :" +allUsersCount);
    res.render('dashboard', { id, username, userType, reporting, allUsersCount });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Method to get total course count
const getTotalUserCount = async () => {
  try {
    const count = await User.count();
    console.log(count);
    return count;
    
  } catch (error) {
    console.error('Error fetching total user count:', error);
    throw error;
  }
};

// Method to get course count by user ID
const getCourseCountByUserId = async (userId) => {
  try {
    const count = await Course.count({
      where: { IdPerson: userId },
    });
    return count;
  } catch (error) {
    console.error('Error fetching course count by user ID:', error);
    throw error;
  }
};

// Method to get total course count
const getTotalCourseCount = async () => {
  try {
    const count = await Course.count();
    return count;
  } catch (error) {
    console.error('Error fetching total course count:', error);
    throw error;
  }
};

// Method to get travaux count by user ID
const getTravauxCountByUserId = async (userId) => {
  try {
    const count = await Travaux.count({
      where: { IdPerson: userId },
    });
    return count;
  } catch (error) {
    console.error('Error fetching travaux count by user ID:', error);
    throw error;
  }
};

// Method to get total travaux count
const getTotalTravauxCount = async () => {
  try {
    const count = await Travaux.count();
    return count;
  } catch (error) {
    console.error('Error fetching total travaux count:', error);
    throw error;
  }
};

module.exports = router;
