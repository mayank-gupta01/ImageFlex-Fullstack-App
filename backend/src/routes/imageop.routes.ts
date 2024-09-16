import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import { adjustBrightness, adjustSaturation, uploadImage, adjustRotation, adjustCropping, prepareImageToDownload } from "../controllers/imageop.controller";

const router: Router = Router();

router.route('/upload').post(
    upload.single("userImage"), uploadImage
)
router.route('/brightness').post(adjustBrightness);
router.route('/saturation').post(adjustSaturation);
router.route('/rotation').post(adjustRotation);
router.route('/cropping').post(adjustCropping);
router.route('/download').post(prepareImageToDownload);


export { router as imageRouter };