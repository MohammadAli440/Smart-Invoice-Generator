This folder contains simple Mongoose schemas used in early development.

Files:
- `user.schema.ts` - `UserModel`
- `company.schema.ts` - `CompanyModel`
- `client.schema.ts` - `ClientModel`
- `invoice.schema.ts` - `InvoiceModel`
- `email-log.schema.ts` - `EmailLogModel`

Use these models directly (e.g., import { UserModel } from './schemas/user.schema') for quick prototyping. In production you may want to wrap them in Nest providers/services.
