import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface CommentAttributes {
  id?: number;
  userId: number;
  partyId: number;
  content: string;
};

export class Comment extends Model<CommentAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Comment.init(
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
    onDelete: "CASCADE",
    references: {
      model: "parties",
      key: "id"
    },
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  modelName : 'Comment',
  tableName : 'comment',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});