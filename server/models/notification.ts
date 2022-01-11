import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface NotificationAttributes {
  id?: number;
  userId: object;
  partyId: object;
  content: string;
  isRead: boolean;
};

export class Notification extends Model<NotificationAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public content!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Notification.init(
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
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
{
  modelName : 'Notification',
  tableName : 'notification',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});