import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/contacts.controllers.js";


const router = Router();

router.route("/search").patch(verifyJWT, searchContacts);
router.route("/get-contacts-for-dm").get(verifyJWT, getContactsForDMList);
router.route("/get-all-contacts").get(verifyJWT, getAllContacts);

export default router;