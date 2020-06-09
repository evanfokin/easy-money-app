import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  categoryId: string

  @Column('integer')
  amount: number

  @Column('text', { default: '' })
  comment: string

  @Column('datetime')
  date: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('datetime', { nullable: true })
  deletedAt: Date

  @ManyToOne(() => Category, category => category.transactions)
  category: Category
}
