import { and, isNull, gt } from 'drizzle-orm';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  userInvitations,
  UserInvitationTable,
  UserInvitationInsert,
} from '@core/db/schema/user_invitations.ts';
import { UserInvitationFiltersDTO } from '@modules/userInvitations/userInvitations.schema.ts';

export class UserInvitationsRepository extends BaseRepository<
  UserInvitationTable,
  UserInvitationFiltersDTO
> {
  constructor(db: Database) {
    super(db, userInvitations);
  }

  protected override applyFilters<
    T extends import('drizzle-orm/pg-core').PgSelect,
  >(qb: T, filters: UserInvitationFiltersDTO) {
    const { isActive, ...rest } = filters;

    super.applyFilters(qb, rest);

    if (isActive) {
      qb.where(
        and(
          isNull(userInvitations.acceptedAt),
          gt(userInvitations.expiresAt, new Date()),
        ),
      );
    }

    return qb;
  }

  async hasInvitationActive(email: string): Promise<boolean> {
    return this.exists({ email, isActive: true });
  }

  async create(values: UserInvitationInsert) {
    const [newInvitation] = await this.db
      .insert(userInvitations)
      .values(values)
      .returning();

    return newInvitation;
  }
}
