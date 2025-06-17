import express, { Router } from "express"
import { login, user , isAuthenticated, logout, addDocument, addTracking, getTracking, getTimeline, getUserDocument, updateLastTransaction, getLastTransaction, getDocuments } from "../controller/controller.js";

const router = express.Router();
router.post('/login', login);
router.post('/logout',logout)
router.post('/add-document',addDocument)
router.post('/add-tracking',addTracking)
router.get('/get-user',user)
router.get('/profile')
router.get('/get-document',getDocuments)
router.get('/get-tracking',getTracking)
router.get("/get-timeline",getTimeline)
router.get('/get-user-document',getUserDocument)
router.get('/profile', isAuthenticated)
router.put('/update-transaction',updateLastTransaction)
router.get('/get-last-transaction',getLastTransaction)
export default router