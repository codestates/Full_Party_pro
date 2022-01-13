import { DataTypes, Model } from "sequelize";
import sequelize from './index';

interface UserPartyAttributes {
  id: number;
  userId: object;
  partyId: object;
  message: string;
  isReviewed: boolean;
};

export default class UserParty extends Model<UserPartyAttributes> {
  public readonly id!: number;
  public userId!: number;
  public partyId!: number;
  public message!: string;
  public isReviewed!: Boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

UserParty.init(
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
  },
  isReviewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
{
  modelName : 'UserParty',
  tableName : 'userParty',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});