import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const runLog = {
    startedAt: Timestamp.now(),
    deletedCount: 0,
    success: false,
    error: null,
  };

  try {
    const snapshot = await db.collection("guests").get();
    const now = new Date();
    const deletions = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.timestamp?.toDate?.();
      const days = data.days;

      if (!timestamp || typeof days !== "number") return;

      const expiryDate = new Date(timestamp.getTime() + days * 24 * 60 * 60 * 1000);
      if (now > expiryDate) {
        deletions.push(db.collection("guests").doc(docSnap.id).delete());
      }
    });

    await Promise.all(deletions);

    runLog.deletedCount = deletions.length;
    runLog.success = true;
    runLog.finishedAt = Timestamp.now();

    // Log the run
    await db.collection("cronLogs").add(runLog);

    return res.status(200).json({
      message: `Deleted ${deletions.length} expired guest(s).`,
    });
  } catch (error) {
    console.error("Error deleting guests:", error);
    runLog.error = error.message;
    runLog.finishedAt = Timestamp.now();
    await db.collection("cronLogs").add(runLog);

    return res.status(500).json({ error: "Failed to clean up guests." });
  }
}
