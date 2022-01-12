import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface NotificationAttributes {
  id?: number;
  userId: number;
  partyId?: number;
  content: string;
  isRead: boolean;
  userName?: string;
  partyName?: string;
  commentId?: number;
  level?: number;
};

export class Notification extends Model<NotificationAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public content!: string;
  public isRead!: boolean;
  public userName!: string;
  public commentId!: number;
  public level!: number;
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
    onDelete: "CASCADE",
    references: {
      model: "users",
      key: "id"
    },
    allowNull: false
  },
  partyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  partyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
},
{
  modelName : 'Notification',
  tableName : 'notification',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});