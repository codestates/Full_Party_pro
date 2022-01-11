import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface FavoriteAttributes {
  id?: number;
  userId: number;
  partyId: number;
};

export class Favorite extends Model<FavoriteAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Favorite.init(
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
      key: "id",
    },
    allowNull: false
  }
},
{
  modelName : 'Favorite',
  tableName : 'favorite',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});