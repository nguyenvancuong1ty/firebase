import { NextFunction, Request, Response } from 'express';
import AccountService from '../service/service.account';
import { CREATED, OK } from '../utils/response.success';
import { Conflict, UnAuthorized } from '../utils/response.error';

class AccountController {
    async login(req: Request, res: Response): Promise<any> {
        const data = await AccountService.login(req, res);
        if (data) {
            return new OK(data).send(res);
        } else {
            return new UnAuthorized('Incorrect username or password').send(res);
        }
    }
    async handleLoginWithGoogle(req: Request, res: Response): Promise<any> {
        const data = await AccountService.handleLoginWithGoogle(req, res);
        return new OK(data).send(res);
    }

    async create(req: Request, res: Response): Promise<void | Response> {
        const data = await AccountService.create(req, res);
        if (data.Id) {
            return new CREATED(data).send(res);
        }
        return;
    }

    async changePassword(req: Request, res: Response): Promise<any> {
        const data = await AccountService.changePassword(req, res);
        if (data) {
            return new OK(data, 'change password success').send(res);
        } else {
            return new Conflict('Incorrect password').send(res);
        }
    }

    async confirmCode(req: Request, res: Response): Promise<any> {
        const data = await AccountService.confirmCode(req, res);
        console.log(data);

        if (data) {
            return new OK(data, 'get code success, pleas check you email').send(res);
        } else {
            return new Conflict('Email does not exist').send(res);
        }
    }

    async forgetPassword(req: Request, res: Response): Promise<any> {
        const data = await AccountService.forgetPassword(req, res);
        if (data) {
            return new OK().send(res);
        } else {
            return new Conflict('Incorrect code').send(res);
        }
    }
}

export default AccountController;
