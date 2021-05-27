import { Injectable, UnprocessableEntityException, UnauthorizedException, } from '@nestjs/common';
import { UserRepository } from '../users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
        throw new UnprocessableEntityException('As senhas não conferem');
        } else {
        const user = await this.userRepository.createUser(
            createUserDto,
            UserRole.USER,
        );
        const mail = {
            to: user.email,
            from: 'noreply@application.com',
            subject: 'Email de confirmação',
            template: 'email-confirmation',
            context: {
            token: user.confirmationToken,
            },
        };
        await this.mailerService.sendMail(mail);
        return user;
        }
    }

    async signIn(credentialsDto: CredentialsDto) {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if (user === null) {
        throw new UnauthorizedException('Credenciais inválidas');
        }

        const jwtPayload = {
        id: user.id,
        };
        const token = await this.jwtService.sign(jwtPayload);

        return { token };
    }
}