import { Response } from "express";

export const PROTOCOL = {

};

export enum STATUS {
    OK = 200,
    CLIENT_ERROR = 400,
    SERVER_ERROR = 500
}

export function SEND(response: Response, status: STATUS, code: number, data?: any): void {
    const message: ProtocolMessage = {
        code: code,
        data: data,
    };

    response.status(status).json(message);
}

export type ProtocolMessage = {
    code: number;
    data?: any;
};