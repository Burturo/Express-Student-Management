const { sequelize, DataTypes, QueryTypes } = require('../config/database');

const Course = sequelize.define('Course', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  displayname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  document: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IdPerson: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Person',
      key: 'IdPerson'
    }
  }
},{
  freezeTableName: true
});

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  freezeTableName: true
});

const Person = sequelize.define('Person', {
  IdPerson: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId'
    }
  }
},{
  freezeTableName: true
});

const Travaux = sequelize.define('Travaux', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  displayname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  document: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IdPerson: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Person',
      key: 'IdPerson'
    }
  }
},{
  freezeTableName: true
});

// Définition les relations
User.hasMany(Person, { foreignKey: 'userId' });
Person.belongsTo(User, { foreignKey: 'userId' });

Person.hasMany(Course, { foreignKey: 'IdPerson' });
Course.belongsTo(Person, { foreignKey: 'IdPerson' });

Person.hasMany(Travaux, { foreignKey: 'IdPerson' });
Travaux.belongsTo(Person, { foreignKey: 'IdPerson' });

sequelize.sync({alter:true});
module.exports = { Course, User, Person, Travaux, sequelize, QueryTypes };
