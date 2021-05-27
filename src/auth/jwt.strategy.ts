import { UserRepository } from '../users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret',
        });
    }

    async validate(payload: { id: number }){
        const { id } = payload;
        const user = await this.userRepository.findOne( id, { 
            select: ['name', 'email', 'status', 'role'],
        });
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return user;

    }
}
