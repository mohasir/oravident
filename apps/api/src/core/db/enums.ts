import { pgEnum } from "drizzle-orm/pg-core";

export const Genders = ["MALE", "FEMALE", "OTHER"] as const;
export const ContractTypes = ["FULL_TIME", "PART_TIME", "CONTRACTOR"] as const;

export const genderEnum = pgEnum("gender_enum", Genders);
export const contractTypeEnum = pgEnum("contract_type_enum", ContractTypes);
