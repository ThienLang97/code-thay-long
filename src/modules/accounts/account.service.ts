import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "./entity/account.entity";
import { DataSource, Repository } from "typeorm";
import { LoginDto } from "../auth/dto/login.dto";
import { AcocuntUpdateDto } from "./dto/account-update.dto";
import { RegisterDto } from "../auth/dto/register.dto";

@Injectable()
export class AccountService {

    constructor(
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
        private readonly dataSource: DataSource
    ) { };

    async getAccounts() {
        return this.accountRepository.find();
    }

    async register(account: RegisterDto) {
        const { name, email, password } = account;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO accounts (name, email, password) 
            VALUES($1, $2, $3) RETURNING *;`, [name, email, password]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            // console.log(err.message);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async login(loginDto: LoginDto) {
        const { email, role } = loginDto;
        const result = await this.accountRepository.findOne({ where: { email, role }, relations: ['carts'] });
        return result;
    }

    async update(accountUpdate: AcocuntUpdateDto) {
        const { id, ...data } = accountUpdate;
        return await this.accountRepository
            .createQueryBuilder()
            .update(Account)
            .set(data)
            .where("id = :id", { id: id })
            .returning("*")
            .execute();
    }
}