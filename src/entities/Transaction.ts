import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  categoryId: number

  @Column('integer')
  amount: number

  @Column('text', { default: '' })
  comment: string

  @Column('date', { nullable: true })
  date: Date

  @ManyToOne(() => Category, category => category.transactions)
  category: Category
}
