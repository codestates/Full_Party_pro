import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface TagAttributes {
  id?: number;
  name: string;
  partyId: number;
};

export class Tag extends Model<TagAttributes> {
  public readonly id!: number;
  public name!: string;
  public partyId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Tag.init(
{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
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
  }
},
{
  modelName : 'Tag',
  tableName : 'tag',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});