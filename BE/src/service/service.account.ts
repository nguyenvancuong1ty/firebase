import { Request, Response } from 'express';
import { Timestamp, db } from '../db/firebase';
import Account from '../models/model.account';
import { Conflict, INTERNAL_SERVER_ERROR } from '../utils/response.error';
import path from 'path';
import { getAccessToken } from '../utils/auth2.0';
import { mailDefine } from '../utils/mail.define';
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const ejs = require('ejs');
const readFile = async (path: string) => {
    try {
        const data = await new Promise<TemplateStringsArray>((resolve, reject) => {
            fs.readFile(path, 'utf8', (err: Error, fileData: TemplateStringsArray) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(fileData);
                }
            });
        });
        return data;
    } catch (err) {
        return '';
    }
};

class AccountService {
    static async login(req: Request, res: Response): Promise<any> {
        const { email, password }: any = req.body;
        console.log(email, password);

        const querySnapshot = await db.collection('account').where('username', '==', email).get();
        const data: Array<Account> = [];
        querySnapshot.docs.map(async (doc: any) => {
            const account: Account = { Id: doc.id, ...doc.data() };

            data.push(account);
        });
        if (Array.isArray(data) && data.length > 0 && bcrypt.compareSync(password, data[0].password)) {
            const accessToken = jwt.sign({ email: email, role: data[0].type_account }, process.env.SECRET, {
                expiresIn: '2d',
            });
            const refreshToken = jwt.sign({ email: email, role: data[0].type_account }, process.env.SECRET, {
                expiresIn: '7d',
            });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            return {
                data: data[0],
                accessToken: accessToken,
            };
        } else {
            return false;
        }
    }

    static async handleLoginWithGoogle(req: Request, res: Response): Promise<any> {
        const { uid, email, displayName } = req.body;
        const data: Account = {
            active: false,
            address: '',
            age: 18,
            deleted: false,
            username: email,
            password: bcrypt.hashSync(uid + email, 8),
            type_account: 'customer',
            fullName: displayName,
            salary: 0,
            timeCreate: Timestamp.fromDate(new Date()),
        };
        const accessToken: string = jwt.sign({ email: email, role: data.type_account }, process.env.SECRET, {
            expiresIn: '2d',
        });
        const refreshToken: string = jwt.sign({ email: email, role: data.type_account }, process.env.SECRET, {
            expiresIn: '7d',
        });
        const accountRef: any = db.collection('account').doc(uid);
        const doc = await accountRef.get();
        if (!doc.exists) {
            await db.collection('account').doc(uid).set(data);
        }
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken, address: data.address };
    }

    static async create(req: Request, res: Response): Promise<any> {
        const { email, displayName, password, confirmCode, confirm_password } = req.body;
        const code = await db.collection('codeConfirm').where('email', '==', email).get();
        if (confirm_password !== password) {
            return new Conflict('Incorrect confirm password vs password').send(res);
        } else if (!code.docs[0] || confirmCode * 1 !== code.docs[0].data().code) {
            return new Conflict('Incorrect code or expired code.').send(res);
        } else {
            const querySnapshot = await db.collection('account').where('username', '==', email).get();
            if (querySnapshot.docs[0]) {
                return new Conflict('Account already exist').send(res);
            } else {
                const newAccount: Account = {
                    active: false,
                    address: '',
                    age: 0,
                    deleted: false,
                    fullName: displayName || '',
                    password: bcrypt.hashSync(password, 8),
                    salary: 0,
                    timeCreate: Timestamp.fromDate(new Date()),
                    type_account: 'customer',
                    username: email,
                };
                const response = await db.collection('account').add(newAccount);
                if (response.id) {
                    const accessToken: string = jwt.sign({ email: email, role: newAccount.type_account }, process.env.SECRET, {
                        expiresIn: '2d',
                    });
                    const refreshToken: string = jwt.sign({ email: email, role: newAccount.type_account }, process.env.SECRET, {
                        expiresIn: '7d',
                    });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true });

                    return { Id: response.id, ...newAccount, accessToken: accessToken };
                }

                return new INTERNAL_SERVER_ERROR('Account already exist').send(res);
            }
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        const { email, username, password } = req.body;
        const querySnapshot = await db.collection('account').where('username', '==', email).get();
        if (querySnapshot.docs[0]) {
            return false;
        } else {
            const newAccount: Account = {
                active: false,
                address: '',
                age: 0,
                deleted: false,
                fullName: '',
                password: bcrypt.hashSync(password, 8),
                salary: 0,
                timeCreate: Timestamp.fromDate(new Date()),
                type_account: 'customer',
                username: email,
            };
            const response = await db.collection('account').update(newAccount);
            console.log(response.id);

            return response.id;
        }
    }

    static async changePassword(req: Request, res: Response): Promise<any> {
        const { password, newPassword } = req.body;
        const { id } = req.params;
        const querySnapshot = await db.collection('account').doc(id).get();

        if (querySnapshot.data() && bcrypt.compareSync(password, querySnapshot.data().password)) {
            const response = await db
                .collection('account')
                .doc(id)
                .update({ password: bcrypt.hashSync(newPassword, 8) });
            console.log(response);
            return response;
        } else {
            return false;
        }
    }

    static async confirmCode(req: Request, res: Response): Promise<any> {
        const transporter = await mailDefine();
        console.log('đi');
        const code: number = Math.floor((Math.random() + 1) * 10000);
        try {
            await db.runTransaction(async (transaction: any) => {
                const oldCode = await transaction.get(db.collection('codeConfirm').where('email', '==', req.params.email));
                let docId: string = '';
                if (oldCode.docs[0]) {
                    docId = oldCode.docs[0].id;
                    await transaction.update(db.collection('codeConfirm').doc(oldCode.docs[0].id), {
                        email: req.params.email,
                        code: code,
                    });
                } else {
                    const newData = await db.collection('codeConfirm').doc();
                    docId = newData.id;
                    await transaction.set(newData, {
                        email: req.params.email,
                        code: code,
                    });
                }
                const html = await readFile(path.join(path.resolve(process.cwd()), 'public/index.ejs'));
                const renderedHtml = ejs.render(html, { code: code });
                await transporter.sendMail({
                    from: 'Email thank you',
                    to: [req.params.email], // list of receivers
                    subject: 'Hello ✔ 😊😊😊', // Subject line
                    text: 'Thank you 😁😁😁', // plain text body
                    html: renderedHtml, // html body
                });
                setTimeout(() => {
                    db.collection('codeConfirm').doc(docId).delete();
                }, 60000);
            });
            return true;
        } catch (error) {
            console.log('E--', error);
            return false;
        }
    }

    static async forgetPassword(req: Request, res: Response) {
        const { confirm } = req.body;
        const code = await db.collection('codeConfirm').where('email', '==', req.params.email).get();
        if (confirm * 1 === code.docs[0].data().code) {
            const transporter = await mailDefine();
            const newPass = './;;adsfjiwefawed';
            await transporter
                .sendMail({
                    from: 'Email thank you',
                    to: req.params.email, // list of receivers
                    subject: `Hello ${req.params.email}✔ `, // Subject line
                    text: 'Thank you', // plain text body
                    html: `<h1>new password : -------   ${newPass}   ---------</h1>`, // html body
                })
                .then(async (res: any) => {
                    const account = await db.collection('account').where('email', '==', req.params.email).get();
                    console.log(account && account.docs[0].id);

                    account &&
                        (await db
                            .collection('account')
                            .doc(account.docs[0].id)
                            .update({ password: bcrypt.hashSync(newPass, 8) }));
                });

            return true;
        } else {
            return false;
        }
    }
}

export default AccountService;
