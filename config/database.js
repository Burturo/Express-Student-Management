const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

const sequelize=new Sequelize('postgres://postgres:0000@localhost:5432/Cours_TravauxDB');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connexion réussie");
  } catch (error) {
    console.log("Erreur de connexion : " + error);
  }
}

testConnection();

module.exports = { sequelize, DataTypes, QueryTypes };
