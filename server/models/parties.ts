import { DataTypes, Model } from "sequelize";
import sequelize from './index';

interface PartiesAttributes {
  id: number;
  name: string;
  image: string;
  memberLimit: number;
  content: string;
  startDate: Date;
  endDate: Date;
  partyState: number;
  leaderId: object;
  isOnline: boolean;
  privateLink: string;
  region: string;
  location: string;
};

export default class Parties extends Model<PartiesAttributes> {
  public readonly id!: number;
  public name!: string;
  public image!: string;
  public memberLimit!: number;
  public content!: string;
  public startDate!: Date;
  public endDate!: Date;
  public partyState!: number;
  public leaderId!: number;
  public isOnline!: boolean;
  public privateLink!: string;
  public region!: string;
  public location!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Parties.init(
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
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  memberLimit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  partyState: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leaderId: {
    type: DataTypes.INTEGER,
    references: {
      model: {
        tableName: "users"
      },
      key: "id",
    },
    allowNull: false
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  privateLink: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
{
  modelName : 'Parties',
  tableName : 'parties',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});