import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface Geopoint {
    latitude: number;
    longitude: number;
}

interface User {
    concoursAutorise: boolean;
    localisation: Geopoint;
    niveauGalop: number;
    uid: string;
}

interface Annonce {
    concoursAutorise: boolean;
    localisation: Geopoint;
    niveauGalopRequis: number;
    annonceId: string;
}

const calculateDistance = (point1: Geopoint, point2: Geopoint): number => {
    //formule de haversine
    const R = 6371;
    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

const matchAnnonce = (user: User, annonces: Annonce[]) => {
    const matchedAnnonces = annonces.map((annonce) => {
        const distance = calculateDistance(user.localisation, annonce.localisation);

        // Points basés sur la distance (plus proche donne plus de points)
        const distancePoints = 50 - distance;

        // Points basés sur le niveau d'expérience
        const experiencePoints = user.niveauGalop - annonce.niveauGalopRequis;

        // Points basés sur la participation aux concours
        const concoursPoints = user.concoursAutorise === annonce.concoursAutorise ? 5 : 0;

        // Calcul du total des points
        const totalPoints = distancePoints + experiencePoints + concoursPoints;

        return { ...annonce, points: totalPoints, localisation: annonce.localisation };
    });

    // Trier en fonction des points (du plus élevé au plus bas), donc affichage intelligent si intégré
    matchedAnnonces.sort((a, b) => b.points - a.points);

    return matchedAnnonces;
};

export const matchingFunction = functions.https.onRequest(async (req, res) => {
    try {
        const db = admin.firestore();

        const usersSnapshot = await db.collection('utilisateurs').get();
        const users: User[] = usersSnapshot.docs.map((doc) => doc.data() as User);

        const annoncesSnapshot = await db.collection('annonces').get();
        const annonces: Annonce[] = annoncesSnapshot.docs.map((doc) => doc.data() as Annonce);

        // Associer tous les utilisateurs aux annonces
        for (const user of users) {
            const matchedResults = matchAnnonce(user, annonces);

            // Afficher les résultats
            console.log(`Annonces correspondants pour l'utilisateur ${user.uid} :`, matchedResults);
        }

        res.status(200).send("Matching complete");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error");
    }
});