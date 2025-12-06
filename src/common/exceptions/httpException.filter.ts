import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { isArray } from "class-validator";
import { Response } from "express";

export class HttpExceptionFilter implements ExceptionFilter {
  public getStatus = (exception: HttpException): number => {
    let status = 500;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    return status;
  };

  public getMessage = (exception: HttpException): string => {
    if (exception instanceof HttpException && exception.getResponse()) {
      const response = exception.getResponse();
      if (typeof response === "string") {
        return response;
      }

      if (isArray(response["message"])) {
        return response["message"][0];
      }
      return response["message"];
    }
    if (exception.message) {
      return exception.message;
    }

    return "Internal server error";
  };

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = this.getMessage(exception);
    const status = this.getStatus(exception);
    if (status === 401) {
      response.clearCookie("token");
    }
    response.status(status).json({
      success: false,
      message,
      status,
    });
  }
}
