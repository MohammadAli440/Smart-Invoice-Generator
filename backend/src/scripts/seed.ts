import 'dotenv/config';
import mongoose from 'mongoose';
import { UserModel } from '../schemas/user.schema';
import { CompanyModel } from '../schemas/company.schema';

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-invoice';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const existing = await UserModel.findOne({ email: 'demo@company.com' }).exec();
  if (existing) {
    console.log('Demo user already exists');
    process.exit(0);
  }

  const user = await UserModel.create({
    email: 'demo@company.com',
    passwordHash: 'demo-password-hash',
    name: 'Demo User'
  });

  await CompanyModel.create({
    userId: user._id,
    name: 'Demo Company',
    email: 'demo@company.com',
    phone: '+91-9999999999',
    website: 'https://demo.company',
    address: '123 Demo St, City, Country'
  });

  console.log('Seeded demo user and company');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});