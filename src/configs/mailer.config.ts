import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from "path";


export const mailerConfig: MailerOptions = {
    template: {
        dir: path.resolve(__dirname, '..', '..','templates'),
        adapter: new HandlebarsAdapter(), 
        options: {
            strict: true,
        },
    },
    transport: 'smtps://user@gmail,com:pass@smtp.gmail.com',
};