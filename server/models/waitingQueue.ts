import { DataTypes, Model } from "sequelize";
import sequelize from './index';

interface WaitingQueueAttributes {
  id: number;
  userId: object;
  partyId: object;
  message: string;
};

export default class WaitingQueue extends Model<WaitingQueueAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

WaitingQueue.init(
{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id"
    },
    allowNull: false
  },
  partyId: {
    type: DataTypes.INTEGER,
    references: {
      model: "parties",
      key: "id"
    },
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  modelName : 'WaitingQueue',
  tableName : 'waitingQueue',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});