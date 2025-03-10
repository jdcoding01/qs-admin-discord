import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../index';  // Assuming sequelize instance is exported from your main file

const Guild = sequelize.define('Guild', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logsChannel: {
    type: DataTypes.STRING,
  },
  permissions: {
    type: DataTypes.STRING
  }
});

export default Guild;
