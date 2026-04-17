import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import { userInvitations } from '@core/db/schema/user_invitations.ts';
import { UserInvitationFilters } from '@modules/userInvitations/userInvitations.schema.ts';

export class UserInvitationsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserInvitationFilters) {
    const result = await this.db.query.userInvitations.findFirst({
      where: (u, { eq, and, isNull, gt }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.token) conditions.push(eq(u.token, filters.token));

        if (filters.isActive) {
          conditions.push(isNull(u.acceptedAt));
          conditions.push(gt(u.expiresAt, new Date()));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: UserInvitationFilters): Promise<boolean> {
    const result = await this.db.query.userInvitations.findFirst({
      where: (u, { eq, and, isNull, gt }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.token) conditions.push(eq(u.token, filters.token));

        if (filters.isActive) {
          conditions.push(isNull(u.acceptedAt));
          conditions.push(gt(u.expiresAt, new Date()));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async hasInvitationActive(email: string): Promise<boolean> {
    return this.exists({ email, isActive: true });
  }

  async create(values: typeof userInvitations.$inferInsert) {
    const [newInvitation] = await this.db
      .insert(userInvitations)
      .values(values)
      .returning();

    return newInvitation;
  }
}
