const { Sequelize, DataTypes } = require("sequelize");
const fs = require('fs');
const path = require('path');
const user = require("./user");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// console.log(dbConfig)
// const sequelizeInstance = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     operatorsAliases: false,

//     pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle
//     }
// });



if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
  
// fs.readdirSync(__dirname)
// .filter(file => {
//   return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
// })
// .forEach(file => {
//   const model = require(path.join(__dirname, file))(sequelize, DataTypes);
//   console.log("1234",__dirname,file,model.name)
//   db[model.name] = model;
// });

// console.log(db)
  
// Object.keys(db).forEach(modelName => {
//   console.log("modelname -- ", modelName)
//   if (db[modelName].associate) {
//     console.log("Here model come")
//     db[modelName].associate(db);
//   }
// });




db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./User")(sequelize, DataTypes);

console.log('db ----- '+ db)


db.sequelize.sync({force: false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = db;



