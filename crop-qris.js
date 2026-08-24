const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const outputDir = path.join(__dirname, 'public', 'images', 'cropped');

// Buat direktori output jika belum ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg'));

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpeg', '.jpg')); // Standardisasi format output

    try {
      // Kita crop bagian bawah gambar (memotong area nominal jika ada di bawah, atau memotong teks di sekitar barcode)
      // Asumsi gambar qris seperti template umum. Koordinat/ukuran crop perlu disesuaikan dengan dimensi asli gambar.
      
      const metadata = await sharp(inputPath).metadata();
      console.log(`Processing ${file}: ${metadata.width}x${metadata.height}`);

      // Area crop: kita ambil bagian tengah (QR code-nya saja) dan menghilangkan header/footer
      // Biasanya QR code berbentuk persegi di tengah gambar.
      // Kita potong berdasarkan persentase (misal ambil 80% width, dan 60% height di tengah)
      // Parameter extract: { left, top, width, height }
      
      const targetWidth = Math.floor(metadata.width * 0.9);
      // Tinggi dikurangi, ambil bagian QR code dan nama merchant di atas, potong bagian footer (tempat biasanya ada instruksi bayar)
      const targetHeight = Math.floor(metadata.height * 0.75); 
      const left = Math.floor((metadata.width - targetWidth) / 2);
      const top = Math.floor(metadata.height * 0.15); // Mulai dari 15% atas untuk melewati header GPN/Logo

      await sharp(inputPath)
        .extract({ left: left, top: top, width: targetWidth, height: targetHeight })
        .toFile(outputPath);
        
      console.log(`✅ Successfully cropped ${file}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
}

processImages();