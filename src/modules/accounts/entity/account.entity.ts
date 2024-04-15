import { Cart } from "src/modules/carts/entity/cart.entity";
import { Order } from "src/modules/orders/entity/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'accounts' })
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ length: 255, nullable: false })
    password: string;

    @Column({ length: 10, unique: true, nullable: true })
    phone: string;

    @Column({ nullable: true, name: 'image_path' })
    imagePath: string;

    @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
    gender: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Column({ nullable: false, default: true })
    active: boolean;

    // // mối quan hệ giữa bảng accounts với bảng orders (2)
    @OneToMany(() => Order, order => order.account)
    orders: Order[];

    @OneToMany(() => Cart, cart => cart.account)
    carts: Cart[];
}