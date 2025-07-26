import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static error(res: Response, error: any, statusCode: number = 500) {
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}