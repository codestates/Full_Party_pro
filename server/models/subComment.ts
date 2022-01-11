import { DataTypes, Model } from "sequelize";
import sequelize from './index';

interface SubCommentAttributes {
  id: number;
  userId: object;
  commentId: object;
  content: string;
};

export default class SubComment extends Model<SubCommentAttributes> {
  public readonly id!: number;
  public userId!: number;
  public commentId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

SubComment.init(
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
      model: {
        tableName: "users"
      },
      key: "id",
    },
    allowNull: false
  },
  commentId: {
    type: DataTypes.INTEGER,
    references: {
      model: {
        tableName: "comment"
      },
      key: "id",
    },
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  modelName : 'SubComment',
  tableName : 'subComment',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});