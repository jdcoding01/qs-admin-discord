import { DataTypes } from 'sequelize';
import { sequelize } from '../../index';

const Permissions = sequelize.define('Permissions', {
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: { // Either Discord user id or Discord role id
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

export default Permissions;

