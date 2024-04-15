import { Category } from "src/modules/categories/entity/category.entity";
import { Product } from "src/modules/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'brands' })
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    logo: string;

    @Column({ nullable: false, default: true })
    active: boolean;

    @ManyToOne(() => Category, category => category.brands)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => Product, product => product.brand)
    products: Product[];
}