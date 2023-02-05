const Jimp = require("jimp");
const path = require("path");
const { exec } = require("child_process");

const fs = require("fs");
const {format} = require("date-fns")

// ** IMPORTANT **
const VIDEO_LINK = "YOUR VIDEO LINK";

const createImage = async () => {
    const imagePath = path.join(__dirname, `img.png`);
    const videoPath = path.join(__dirname,  "video.mp4");

    fs.exists(imagePath, function(exists) {

        if(exists) {
      
            console.log('File exists. Deleting now ...');
      
            fs.unlinkSync(imagePath);
      
        } else {
      
            console.log('File not found, so not deleting.');
      
        }
      
      });

      fs.exists(videoPath, function(exists) {

        if(exists) {
      
            console.log('File exists. Deleting now ...');
      
            fs.unlinkSync(videoPath);
      
        } else {
      
            console.log('File not found, so not deleting.');
      
        }
      
      });

    

    const lines = `Capture Location: 192/2 President road, chasara, Narayanganj Sadar, Narayanganj-1400, Bangladesh\nSubmitted At: ${format(
        new Date(),
        "hh:mm a, dd/MM/yyyy"
      )}`
        .replace(/(.{40})/g, "$1\n")
        .split("\n");

        const width = 400;
        const height =
          lines.length >= 8
            ? 350
            : lines.length >= 4 && lines.length < 8
            ? 220
            : 150;

            const image = new Jimp(width, height);
 

            for (let x = 0; x < image.bitmap.width; x++) {
                for (let y = 0; y < image.bitmap.height; y++) {
                  // console.log({ x, y });
                  image.setPixelColor(Jimp.rgbaToInt(0, 0, 0, 128), x, y);
                }
              }

    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const x = 75;
    const y = 10;
    // image.print(font, x, y, `Capture Location: `);
    lines.forEach((line, idx) => {
      image.print(font, x, y + 20 * idx, `${line}`);
    });

    image.print(
      font,
      x,
      height - 40,
      "SendPhotoProof.com- Delivery Proof Service"
    );

    const image1 = await Jimp.read("pfim.png");
    image1.resize(35, 35);
    image.composite(image1, 30, 30, {
      opacity: 0.1,
    });
    
    await image.writeAsync(imagePath).then((res) => {
      console.log(`ffmpeg -i "${VIDEO_LINK}"  -i "${imagePath}"  -r 60 -filter_complex "[1][0]scale2ref=w=oh*mdar:h=ih*0.3[logo][video];[video][logo]overlay=W-w-5:H-h-5" -crf 23 -strict -2 -c:a copy video.mp4 -y`)
        exec(
          `ffmpeg -i "${VIDEO_LINK}"  -i "${imagePath}"  -r 60 -filter_complex "[1][0]scale2ref=w=oh*mdar:h=ih*0.3[logo][video];[video][logo]overlay=W-w-5:H-h-5" -crf 23 -strict -2 -c:a copy video.mp4 -y`,
          async (e, sto, ste) => {
            if (e) {
              console.log(`Video Convertion Error: ${e.message}`);
            }
            if (ste) {
              console.log(`Video Convertion STError: ${ste.message}`);
            }
  
            

            
            console.log("done");
          }
        );
      });


}

createImage()