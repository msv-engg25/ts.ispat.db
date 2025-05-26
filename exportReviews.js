import ExcelJS from 'exceljs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cron from 'node-cron';
import Review from './backend/models/review.js';

dotenv.config({ path: path.resolve('./backend/.env') });

async function exportReviews() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const reviews = await Review.find().lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reviews');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 30 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Position', key: 'position', width: 25 },
      { header: 'Product', key: 'product', width: 25 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Review Title', key: 'reviewTitle', width: 40 },
      { header: 'Review Message', key: 'reviewMessage', width: 50 },
      { header: 'Consent', key: 'consent', width: 10 },
      { header: 'Images', key: 'images', width: 50 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    reviews.forEach(review => {
      worksheet.addRow({
        ...review,
        consent: review.consent ? 'Yes' : 'No',
        images: review.images ? review.images.join(', ') : '',
        createdAt: review.createdAt ? review.createdAt.toISOString() : '',
      });
    });

    await workbook.xlsx.writeFile('reviews.xlsx');
    console.log(`✅ Excel file "reviews.xlsx" updated at ${new Date().toLocaleString()}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error exporting reviews:', error);
  }
}

// Schedule export every 5 minutes (adjust cron time as needed)
cron.schedule('*/5 * * * *', () => {
  console.log('⏰ Running scheduled export...');
  exportReviews();
});

// Optionally run immediately on start
exportReviews();
