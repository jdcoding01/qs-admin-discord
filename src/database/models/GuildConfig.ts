import { DataTypes } from 'sequelize';
import { sequelize } from '../../index';

const GuildConfig = sequelize.define('GuildConfig', {
  guild_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  guild_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  log_channel_id: {
    type: DataTypes.STRING,
    allowNull: false,
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

export default GuildConfig;

