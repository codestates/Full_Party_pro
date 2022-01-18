import { DataTypes, Model } from "sequelize";
import sequelize from './index';

export interface UsersAttributes {
  id?: number;
  userName: string;
  password?: string;
  profileImage: string;
  birth: Date;
  gender: string;
  mobile: string;
  email: string;
  region: string;
  exp: number;
  level: number;
  signupType: string;
};

export class Users extends Model<UsersAttributes> {
  public readonly id!: number;
  public userName!: string;
  public password!: string;
  public profileImage!: string;
  public birth!: Date;
  public gender!: string;
  public mobile!: string;
  public email!: string;
  public region!: string;
  public exp!: number;
  public level!: number;
  public signupType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {

  };
};

Users.init(
{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true
  },
  exp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  signupType: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  modelName : 'Users',
  tableName : 'users',
  sequelize,
  freezeTableName : true,
  timestamps : true,
});