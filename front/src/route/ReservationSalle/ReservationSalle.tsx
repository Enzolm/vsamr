import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, Clock, Users, MapPin, Mail, Phone, FileText, Send, CheckCircle, AlertCircle, Info } from "lucide-react";

import Navbar from "@/composant/Navbar";
import { Calendar as CalendrierComponent } from "@/composant/Calendrier";
import { reservationSalle } from "@/config/config";
import type { ReservationSalle } from "@/types/reservation";

// Schema de validation avec Zod
const reservationSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    telephone: z
      .string()
      .min(10, "Numéro de téléphone invalide")
      .regex(/^[0-9+\-\s]+$/, "Format de téléphone invalide"),
    dateReservation: z.string().min(1, "Date de réservation requise"),
    heureDebut: z.string().min(1, "Heure de début requise"),
    heureFin: z.string().min(1, "Heure de fin requise"),
    typeReservation: z.string().min(1, "Type de réservation requis"),
    nombrePersonnes: z.number().min(1, "Nombre de personnes requis").max(200, "Maximum 200 personnes"),
    description: z.string().min(10, "Description requise (minimum 10 caractères)"),
    besoinsSpecifiques: z.string().optional(),
  })
  .refine(
    (data) => {
      const debut = new Date(`2000-01-01T${data.heureDebut}`);
      const fin = new Date(`2000-01-01T${data.heureFin}`);
      return fin > debut;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["heureFin"],
    }
  );

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function ReservationSalle() {
  // Aucune donnée de réservation (pas de BDD)
  const reservations: ReservationSalle[] = [];
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      nombrePersonnes: 1,
    },
  });

  const watchedDate = watch("dateReservation");

  // Vérifier les créneaux disponibles pour une date
  const getCreneauxDisponibles = (date: string) => {
    const reservationsJour = reservations.filter((r) => r.dateReservation === date);
    return reservationsJour;
  };

  // Convertir les réservations en événements pour le calendrier
  const convertirReservationsEnEvenements = () => {
    const events = reservations.map((reservation) => ({
      id: `reservation-${reservation.id}`,
      title: `${reservation.typeReservation} - ${reservation.heureDebut}-${reservation.heureFin}`,
      date: new Date(reservation.dateReservation),
      description: `${reservation.prenom} ${reservation.nom} - ${reservation.nombrePersonnes} personnes`,
      color: getEventColor(reservation.typeReservation),
    }));
    return events;
  };

  // Obtenir la couleur de l'événement basée sur le type de réservation
  const getEventColor = (typeReservation: string): "blue" | "green" | "red" | "purple" | "orange" => {
    const typeConfig = reservationSalle.typesReservation.find((t) => t.id === typeReservation);
    if (!typeConfig) return "blue";

    // Mapper les couleurs hex aux couleurs supportées par le calendrier
    const colorMap: Record<string, "blue" | "green" | "red" | "purple" | "orange"> = {
      "#ff6b6b": "red",
      "#4ecdc4": "green",
      "#45b7d1": "blue",
      "#f39c12": "orange",
      "#9b59b6": "purple",
      "#e67e22": "orange",
      "#2ecc71": "green",
      "#3498db": "blue",
      "#e74c3c": "red",
      "#9c88ff": "purple",
    };

    return colorMap[typeConfig.couleur] || "blue";
  };

  // Soumettre la demande de réservation
  const onSubmit = async (data: ReservationFormData) => {
    try {
      setLoading(true);

      // Vérifier la disponibilité avant envoi (mais ne pas bloquer si pas de conflit)
      const creneauxOccupes = getCreneauxDisponibles(data.dateReservation);
      const conflitDetecte = creneauxOccupes.some((reservation) => {
        const debutExistant = new Date(`2000-01-01T${reservation.heureDebut}`);
        const finExistante = new Date(`2000-01-01T${reservation.heureFin}`);
        const debutDemande = new Date(`2000-01-01T${data.heureDebut}`);
        const finDemandee = new Date(`2000-01-01T${data.heureFin}`);

        return debutDemande < finExistante && finDemandee > debutExistant;
      });

      if (conflitDetecte) {
        toast.error("Ce créneau n'est pas disponible. Veuillez choisir un autre horaire.");
        return;
      }

      // Simulation de l'envoi (pas de base de données)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Votre demande de réservation a été envoyée ! Un email de confirmation vous sera envoyé.");
      reset();
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-white via-white to-canva-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-canva-darkblue mb-4">Réservation de la Salle Polyvalente</h1>
          <p className="text-lg text-custom-green2 max-w-3xl mx-auto">Réservez notre salle polyvalente pour vos événements. Consultez les disponibilités et envoyez votre demande en ligne.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendrier des disponibilités */}
          <div className="bg-white rounded-xl shadow-contrast p-6">
            <h2 className="text-2xl font-semibold text-canva-darkblue mb-6 flex items-center">
              <Calendar className="mr-3 text-custom-green" />
              Disponibilités
            </h2>

            <CalendrierComponent events={convertirReservationsEnEvenements()} />

            {/* Légende */}
            <div className="mt-6 p-4 bg-custom-white2 rounded-lg">
              <h3 className="font-semibold text-canva-darkblue mb-3">Légende :</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {reservationSalle.typesReservation.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: type.couleur }}></div>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="bg-white rounded-xl shadow-contrast p-6">
            <h2 className="text-2xl font-semibold text-canva-darkblue mb-6 flex items-center">
              <FileText className="mr-3 text-custom-green" />
              Demande de Réservation
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">Nom *</label>
                  <input type="text" {...register("nom")} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.nom ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="Votre nom" />
                  {errors.nom && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nom.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">Prénom *</label>
                  <input type="text" {...register("prenom")} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.prenom ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="Votre prénom" />
                  {errors.prenom && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.prenom.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email *
                  </label>
                  <input type="email" {...register("email")} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="votre@email.com" />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Téléphone *
                  </label>
                  <input type="tel" {...register("telephone")} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.telephone ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="06 12 34 56 78" />
                  {errors.telephone && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.telephone.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Date et horaires */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date *
                  </label>
                  <input type="date" {...register("dateReservation")} min={new Date().toISOString().split("T")[0]} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.dateReservation ? "border-red-500" : "border-custom-darkWhite"}`} />
                  {errors.dateReservation && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dateReservation.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Heure début *
                  </label>
                  <input type="time" {...register("heureDebut")} min={reservationSalle.horairesSalle.debut} max={reservationSalle.horairesSalle.fin} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.heureDebut ? "border-red-500" : "border-custom-darkWhite"}`} />
                  {errors.heureDebut && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.heureDebut.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Heure fin *
                  </label>
                  <input type="time" {...register("heureFin")} min={reservationSalle.horairesSalle.debut} max={reservationSalle.horairesSalle.fin} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.heureFin ? "border-red-500" : "border-custom-darkWhite"}`} />
                  {errors.heureFin && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.heureFin.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Type et nombre de personnes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">Type d'événement *</label>
                  <select {...register("typeReservation")} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.typeReservation ? "border-red-500" : "border-custom-darkWhite"}`}>
                    <option value="">Sélectionnez un type</option>
                    {reservationSalle.typesReservation.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.typeReservation && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.typeReservation.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-canva-darkblue mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Nombre de personnes *
                  </label>
                  <input type="number" {...register("nombrePersonnes", { valueAsNumber: true })} min="1" max="200" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all ${errors.nombrePersonnes ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="Nombre de personnes" />
                  {errors.nombrePersonnes && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nombrePersonnes.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-canva-darkblue mb-2">Description de l'événement *</label>
                <textarea {...register("description")} rows={4} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all resize-none ${errors.description ? "border-red-500" : "border-custom-darkWhite"}`} placeholder="Décrivez votre événement..." />
                {errors.description && (
                  <span className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Besoins spécifiques */}
              <div>
                <label className="block text-sm font-medium text-canva-darkblue mb-2">Besoins spécifiques (optionnel)</label>
                <textarea {...register("besoinsSpecifiques")} rows={3} className="w-full px-4 py-3 border border-custom-darkWhite rounded-lg focus:ring-2 focus:ring-custom-green focus:border-transparent transition-all resize-none" placeholder="Matériel nécessaire, aménagement spécial..." />
              </div>

              {/* Affichage des créneaux occupés pour la date sélectionnée */}
              {watchedDate && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Créneaux déjà réservés pour le {new Date(watchedDate).toLocaleDateString("fr-FR")} :
                  </h4>
                  {getCreneauxDisponibles(watchedDate).length === 0 ? (
                    <p className="text-green-700">Aucune réservation - Disponible toute la journée</p>
                  ) : (
                    <ul className="text-yellow-800 space-y-1">
                      {getCreneauxDisponibles(watchedDate).map((reservation, index) => (
                        <li key={index} className="flex items-center">
                          <div
                            className="w-3 h-3 rounded mr-2"
                            style={{
                              backgroundColor: reservationSalle.typesReservation.find((t) => t.id === reservation.typeReservation)?.couleur || "#dda0dd",
                            }}
                          ></div>
                          {reservation.heureDebut} - {reservation.heureFin} ({reservation.typeReservation})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Bouton de soumission */}
              <button type="submit" disabled={isSubmitting || loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center">
                {isSubmitting || loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer la demande
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Tarifs */}
          <div className="bg-white rounded-xl shadow-contrast p-6">
            <h3 className="text-xl font-semibold text-canva-darkblue mb-4">Tarifs Indicatifs</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-custom-green">Particuliers :</h4>
                <ul className="mt-2 space-y-1 text-sm text-custom-green2">
                  <li>• Demi-journée : {reservationSalle.tarifs.particulier.demieJournee}€</li>
                  <li>• Journée complète : {reservationSalle.tarifs.particulier.journeeComplete}€</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-custom-green">Associations :</h4>
                <ul className="mt-2 space-y-1 text-sm text-custom-green2">
                  <li>• Demi-journée : {reservationSalle.tarifs.association.demieJournee}€</li>
                  <li>• Journée complète : {reservationSalle.tarifs.association.journeeComplete}€</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="bg-white rounded-xl shadow-contrast p-6">
            <h3 className="text-xl font-semibold text-canva-darkblue mb-4">Informations Pratiques</h3>
            <div className="space-y-3 text-sm text-custom-green2">
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-1 text-custom-green flex-shrink-0" />
                <span>
                  Horaires : {reservationSalle.horairesSalle.debut} - {reservationSalle.horairesSalle.fin}
                </span>
              </div>
              <div className="flex items-start">
                <Users className="w-4 h-4 mr-2 mt-1 text-custom-green flex-shrink-0" />
                <span>Capacité maximale : 200 personnes</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-custom-green flex-shrink-0" />
                <span>Adresse : Salle Polyvalente, Place de la Mairie, Villeneuve-sur-Auvers</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-1 text-custom-green flex-shrink-0" />
                <span>Équipements inclus : tables, chaises, cuisine équipée, sonorisation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
