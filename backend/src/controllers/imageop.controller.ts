import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler";
import path from "path";
import sharp from "sharp";
import fs from "fs"
import { imageMapObj } from "../utils/imageMapping";


const tempFilePath = process.env.COMPRESSED_FOLDER_PATH + 'temp.jpg';
const uploadImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        //we need to return the path of the file
        console.log('UploadImage Controller Called')
        const imageFilePath = req.file?.path;
        if (!imageFilePath) {
            throw new Error("Image should be in PNG or JPEG format");
        }

        const compressFilePath = process.env.COMPRESSED_FOLDER_PATH + path.basename(imageFilePath);
        console.log(compressFilePath)


        fs.writeFileSync(compressFilePath, '');
        await sharp(imageFilePath).jpeg({ quality: 1 }).toFile(compressFilePath);


        //create a new object for imageMapping class
        const fullFilePath = path.resolve(imageFilePath);
        imageMapObj.addMapping(fullFilePath, compressFilePath);
        console.log(imageMapObj.getCompressPath(fullFilePath));

        const responseImageFilePath = imageFilePath.slice(7);
        console.log(responseImageFilePath)
        return res.status(200).json({
            "success": true,
            "message": "File Uploaded Successfully",
            "filePath": `${process.env.BASE_URL}/${responseImageFilePath.replace(/\\/g, '/')}`,
            "fullFilePath": fullFilePath
        })

    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }

}


const adjustBrightness = async (req: Request, res: Response): Promise<Response> => {
    try {
        // 0(min) ---------- 50 (normal) ----------- 100(max)
        //we apply all the edits on compressed files
        console.log('Adjust Brightness Controller Called')
        const { filePath, isConfirm = false, lightness } = req.body;
        if (!fs.existsSync(filePath)) {
            throw new Error("File Path doesn't exist")
        }

        //convert string to int
        const targetLightness = parseInt(lightness as string, 10);

        //check valid integer
        if (isNaN(targetLightness) || targetLightness < 0 || targetLightness > 100) {
            throw new Error("Please enter a valid number between 0 to 100")
        }

        //get the compressed file path
        const compressedFilePath = imageMapObj.getCompressPath(filePath)
        if (!compressedFilePath) {
            throw new Error(`Compressed File Path doesn't exist`)
        }

        //using sharp adjust the brightness of the compressed image
        const adjustedImage = await sharp(compressedFilePath)
            // .resize({ width: 300, height: 200 })
            .modulate({
                lightness: targetLightness - 50,
            })
            .toBuffer();


        // when confirm that brightness edit done we change it to the compressed file
        if (isConfirm) {
            //first create a temp file in the compressed folder because we can't write in same file
            await fs.promises.writeFile(tempFilePath, '');

            //adjust the brightness in compressed file and write it to a temp file
            await sharp(compressedFilePath)
                .modulate({
                    lightness: targetLightness - 50,
                })
                .toFile(tempFilePath)


            //rename temp file with the compressed file
            await fs.promises.rename(tempFilePath, compressedFilePath);
        }

        //return the response as an image
        res.set('Content-Type', 'image/jpeg');
        return res.send(adjustedImage);

    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const adjustSaturation = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('Adjust Saturation Controller Called')
        // 0(min) ---------- 50 (normal) ----------- 100(max)
        // we divided it by 50 so that it take value as a multiplier
        //we apply all the edits on compressed files

        //take out filepath and isconfirm flag
        const { filePath, isConfirm = false, saturation } = req.body;
        //check file exist or not
        if (!fs.existsSync(filePath)) {
            throw new Error("File Path doesn't exist")
        }

        //convert string to int
        const targetSaturation = parseInt(saturation as string, 10);

        //validate the data
        if (isNaN(targetSaturation) || targetSaturation < 0 || targetSaturation > 100) {
            throw new Error("Please enter a valid number between 0 to 100")
        }

        //get the compressed file path
        console.log(filePath)
        const compressedFilePath = imageMapObj.getCompressPath(filePath);
        console.log(compressedFilePath)
        //throw error if compress file path not found
        if (!compressedFilePath) {
            throw new Error(`Compressed File Path doesn't exist`)
        }

        //adjust the image's saturation to show preview
        const adjustedImage = await sharp(compressedFilePath)
            .modulate({
                saturation: targetSaturation / 50,
            })
            .toBuffer();


        // when confirm that brightness edit done we change it to the compressed file
        if (isConfirm) {
            //first create a temp file in the compressed folder because we can't write in same file
            await fs.promises.writeFile(tempFilePath, '');

            //write adjust image in temp file
            await sharp(compressedFilePath)
                .modulate({
                    saturation: targetSaturation,
                })
                .toFile(tempFilePath)

            //rename temp file to the compressed file
            await fs.promises.rename(tempFilePath, compressedFilePath);
        }

        res.set('Content-Type', 'image/jpeg');
        return res.send(adjustedImage);
    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const adjustRotation = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('Adjust Rotation Controller Called')
        //check file path, and isConfirm flag
        const { filePath, isConfirm = false, rotation } = req.body;
        //validate whether file existed
        if (!fs.existsSync(filePath)) {
            throw new Error("File Path doesn't exist")
        }

        //convert targetRotation to int
        const targetRotation = parseInt(rotation as string, 10);

        //validate data
        if (isNaN(targetRotation) || targetRotation < -180 || targetRotation > 180) {
            throw new Error("Please enter a valid number between -180 to 180")
        }

        //get the compressed file path
        console.log(filePath)
        const compressedFilePath = imageMapObj.getCompressPath(filePath);
        console.log(compressedFilePath)
        //throw error if compressed file path not found
        if (!compressedFilePath) {
            throw new Error(`Compressed File Path doesn't exist`)
        }

        //adjust the image's rotation to show the preview
        const adjustedImage = await sharp(compressedFilePath)
            .rotate(targetRotation)
            .toBuffer();


        // when confirm that brightness edit done we change it to the compressed file
        if (isConfirm) {
            //first create a temp file in the compressed folder because we can't write in same file
            await fs.promises.writeFile(tempFilePath, '');
            //write file in a temp file
            await sharp(compressedFilePath)
                .rotate(targetRotation)
                .toFile(tempFilePath)

            //rename temp file to compressed file
            await fs.promises.rename(tempFilePath, compressedFilePath);
        }

        //send image as a response
        res.set('Content-Type', 'image/jpeg');
        return res.send(adjustedImage);

    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const adjustCropping = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('Adjust Cropping Controller Called')
        //extract filePath and isConfirm flag
        const { filePath, isConfirm = false } = req.body;
        //check file exist or not
        if (!fs.existsSync(filePath)) {
            throw new Error("File Path doesn't exist")
        }

        //extract params
        const { cropWidth, cropHeight } = req.query;
        //validate
        if (!(cropWidth && cropHeight)) {
            throw new Error("width and height should be entered")
        }

        //convert to int
        const targetWidth = parseInt(cropWidth as string, 10);
        const targetHeight = parseInt(cropHeight as string, 10);

        //validate data
        if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
            throw new Error("Please enter a valid number for width or height")
        }

        //get the compressed file path
        console.log(filePath)
        const compressedFilePath = imageMapObj.getCompressPath(filePath);
        console.log(compressedFilePath)
        //threw err if filepath not found
        if (!compressedFilePath) {
            throw new Error(`Compressed File Path doesn't exist`)
        }

        //adjust image's crop to preview the image
        const adjustedImage = await sharp(compressedFilePath)
            .resize({ width: targetWidth, height: targetHeight })
            .toBuffer();


        // when confirm that brightness edit done we change it to the compressed file
        if (isConfirm) {
            //first create a temp file in the compressed folder because we can't write in same file
            await fs.promises.writeFile(tempFilePath, '');
            //write file to the temp file
            await sharp(compressedFilePath)
                .resize({ width: targetWidth, height: targetHeight })
                .toFile(tempFilePath)

            // after manipulation rename it
            await fs.promises.rename(tempFilePath, compressedFilePath);
        }

        //send file in response
        res.set('Content-Type', 'image/jpeg');
        return res.send(adjustedImage);

    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const prepareImageToDownload = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('Download Image Controller Called')
        //take out the filepath and format in which file need
        const { filePath, format } = req.body
        //validate filePath
        if (!fs.existsSync(filePath)) {
            throw new Error("File Path doesn't exist")
        }

        //validate entered format of image
        if (format != 'jpg' && format != 'png') {
            throw new Error('Please enter jpg or png option');
        }

        console.log(filePath);
        const compressedFilePath = imageMapObj.getCompressPath(filePath);
        console.log(compressedFilePath)

        //validate compress file path
        if (!compressedFilePath) {
            throw new Error(`compressed file path doesn't exist`)
        }

        let adjustedImage;
        if (format == 'jpg') {
            adjustedImage = await sharp(compressedFilePath)
                .jpeg({ quality: 100 })
                .toBuffer();

            res.set('Content-Type', 'image/jpeg');
        }
        else {
            adjustedImage = await sharp(compressedFilePath)
                .png({ quality: 100 })
                .toBuffer();

            res.set('Content-Type', 'image/png');
        }

        return res.send(adjustedImage)

    } catch (error) {
        console.log("error:-----------", (error as Error).message);
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

export { uploadImage, adjustBrightness, adjustSaturation, adjustRotation, adjustCropping, prepareImageToDownload }