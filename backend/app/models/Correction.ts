import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/database';
import { Document } from './Document';

// 批改项模型接口
interface CorrectionAttributes {
  id: string;
  documentId: string;
  type: string; // error, warning, suggestion
  position: {
    start: number;
    end: number;
  };
  comment: string;
  suggestion?: string;
  applied: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 批改项创建接口
interface CorrectionCreationAttributes extends Omit<CorrectionAttributes, 'id'> {}

// 批改项模型类
export class Correction extends Model<CorrectionAttributes, CorrectionCreationAttributes> implements CorrectionAttributes {
  public id!: string;
  public documentId!: string;
  public type!: string;
  public position!: {
    start: number;
    end: number;
  };
  public comment!: string;
  public suggestion?: string;
  public applied!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化批改项模型
Correction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Document,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['error', 'warning', 'suggestion']],
      },
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    applied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'corrections',
    modelName: 'Correction',
  }
);

// 建立与文档的关联
Correction.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });
Document.hasMany(Correction, { foreignKey: 'documentId', as: 'corrections' });

export default Correction;