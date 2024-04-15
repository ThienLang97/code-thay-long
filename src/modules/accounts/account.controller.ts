import { Body, Controller, Get, HttpStatus, Put, Req, UnauthorizedException } from "@nestjs/common";
import { AccountService } from "./account.service";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { JWT_CONFIG } from "src/common/constants/jwt.constant";
import { AcocuntUpdateDto } from "./dto/account-update.dto";

@Controller('accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) { };

    @Get()
    async getAccounts() {
        return this.accountService.getAccounts();
    }

    @Put('update')
    async update(@Req() request: Request, @Body() body: AcocuntUpdateDto) {

        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7);
        if (!token) {
            throw new UnauthorizedException("Missing token");
        }

        const infoToken = await this.jwtService.verifyAsync(token, { secret: JWT_CONFIG.ACCESS_KEY });
        const { id } = infoToken;

        const accountUpdate = { id, ...body };

        const result = await this.accountService.update(accountUpdate);
        const data = result.raw[0];
        const imagePath = data.image_path;
        data.imagePath = imagePath;
        delete data.image_path;
        delete data.password;

        return {
            statusCode: HttpStatus.OK,
            message: "Information updated successfully",
            data
        }
    }
}