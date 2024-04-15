import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { Image } from "../images/entity/image.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly dataSource: DataSource
    ) { };

    async getAll() {
        return await this.productRepository.find({ relations: ['brand', 'images', 'variations'] });
    }

    async getById(id: number) {
        return await this.productRepository.findOne({ where: { id }, relations: ['brand', 'images', 'variations'] });
    }

    async create(product: CreateProductDto) {
        const { name, description, specifications, default_image, discount_percentage, brand_id, price } = product;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(`INSERT INTO products (name, description, specifications, default_image, brand_id, price, discount_percentage) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [name, description, specifications, default_image, brand_id, price, discount_percentage]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            return err;
        } finally {
            await queryRunner.release();
        }
    }

    async createImages(product: any, productImages: string[]) {
        try {
            // Tạo các đối tượng Image và liên kết với sản phẩm
            const images = productImages.map(productImage => {
                const image = new Image();
                image.image_path = productImage;
                image.product = product;
                return image;
            });

            // Lưu các đối tượng Image vào cơ sở dữ liệu
            await this.imageRepository.save(images);
            return;
        } catch (error) {
            console.log("product-service :: ", error);
        }
    }

    async deleteImages(id: number) {
        try {
            return await this.dataSource.createQueryBuilder()
                .delete()
                .from(Image)
                .where("product_id = :id", { id })
                .execute()
        } catch (error) {
            console.log("ERROR DELETE IMAGES :: ", error);
        }
    }

    async delete(id: number) {
        try {
            return await this.productRepository.delete(id);
        } catch (error) {
            return error;
        }
    }

    async updateImage(image: any) {
        const { id, ...data } = image;
        try {
            return await this.imageRepository.update(id, data);
        } catch (error) {
            return error;
        }
    }

    async update(product: any) {
        const { id, name, description, specifications, default_image, brand_id, active, price } = product;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(
                `UPDATE products SET name=$1, description=$2, specifications=$3, default_image=$4, brand_id=$5, active=$6, price=$7 WHERE id=$8  RETURNING *;`,
                [name, description, specifications, default_image, brand_id, active, price, id]);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err);
            return err;
        } finally {
            await queryRunner.release();
        }
    }
}