// scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function optimizeImages() {
  const imageDir = path.join(__dirname, "../assets/images");
  const outputDir = path.join(__dirname, "../assets/images/optimized");

  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Get all image files
    const files = await fs.readdir(imageDir);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    console.log(`Found ${imageFiles.length} images to optimize`);

    for (const file of imageFiles) {
      const inputPath = path.join(imageDir, file);
      const outputName = path.basename(file, path.extname(file)) + ".webp";
      const outputPath = path.join(outputDir, outputName);

      // Convert to WebP
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

      console.log(`Optimized: ${file} → ${outputName}`);

      // Create a smaller thumbnail version
      const thumbnailPath = path.join(outputDir, "thumb-" + outputName);
      await sharp(inputPath)
        .resize(300, 300, { fit: "inside" })
        .webp({ quality: 70 })
        .toFile(thumbnailPath);
    }

    console.log("✅ Image optimization complete!");
  } catch (error) {
    console.error("❌ Error optimizing images:", error);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages();
}

module.exports = optimizeImages;
