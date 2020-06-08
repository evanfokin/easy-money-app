import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { TransactionType } from '../helpers/transaction-type'
import { Transaction } from './Transaction'
import { Icons } from '../helpers/icons'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column('varchar')
  name: string

  @Column('varchar')
  icon: string

  get ionIcon () {
    return Icons.outline[this.icon]
  }

  @Column('varchar')
  type: TransactionType

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('datetime', { nullable: true })
  deletedAt: Date
}
