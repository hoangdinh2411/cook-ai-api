// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// export class TimestampEntity {
//   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at: Date;

//   @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updated_at: Date;

//   @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
//   deleted_at: Date;
// }

// export class BaseEntity extends TimestampEntity {
//   //seo
//   @Column({ type: 'jsonb', nullable: true })
//   meta_data: {
//     title: string;
//     description: string;
//     keywords: string[];
//   };
// }
