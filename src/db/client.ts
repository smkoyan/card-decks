import {Dialect, Sequelize} from 'sequelize';

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

const dialect = process.env.DB_DIALECT as Dialect;

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});

export default sequelize;
