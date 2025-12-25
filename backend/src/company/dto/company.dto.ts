export class CompanyDto {
  name!: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  logo?: { url?: string; publicId?: string };
}
