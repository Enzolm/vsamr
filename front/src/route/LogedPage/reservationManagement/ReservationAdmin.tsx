import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Check,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config/config";
import { reservationSalle } from "@/config/config";

interface Reservation {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  typeReservation: string;
  nombrePersonnes: number;
  description: string;
  besoinsSpecifiques?: string;
  statut: "en_attente" | "validee" | "annulee" | "passee";
  createdAt: string;
  updatedAt: string;
}

type TabType = "en_attente" | "validee" | "annulee" | "passee";

const statusConfig = {
  en_attente: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
  },
  validee: {
    label: "Validée",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  annulee: {
    label: "Annulée",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  passee: {
    label: "Passée",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: History,
  },
};

function ReservationAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("en_attente");
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelComment, setCancelComment] = useState("");
  const [reservationToCancel, setReservationToCancel] =
    useState<Reservation | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/reservations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      toast.error("Erreur lors de la récupération des réservations");
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (
    id: number,
    newStatus: "validee" | "annulee",
    commentaire_admin?: string
  ) => {
    try {
      const requestData: any = { statut: newStatus };
      if (newStatus === "annulee" && commentaire_admin) {
        requestData.commentaire_admin = commentaire_admin;
      }

      await axios.put(
        `${config.api.baseUrl}/reservations/${id}/status`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id
            ? { ...reservation, statut: newStatus }
            : reservation
        )
      );

      toast.success(
        `Réservation ${
          newStatus === "validee" ? "validée" : "annulée"
        } avec succès`
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
    setCancelComment("");
  };

  const confirmCancelReservation = async () => {
    if (!reservationToCancel) return;

    if (!cancelComment.trim()) {
      toast.error("Veuillez saisir un motif d'annulation");
      return;
    }

    await updateReservationStatus(
      reservationToCancel.id,
      "annulee",
      cancelComment
    );

    setShowCancelModal(false);
    setReservationToCancel(null);
    setCancelComment("");
  };

  const getTypeReservationLabel = (typeId: string) => {
    const type = reservationSalle.typesReservation.find((t) => t.id === typeId);
    return type ? type.label : typeId;
  };

  const filteredReservations = reservations.filter(
    (reservation) => reservation.statut === activeTab
  );

  const getTabCount = (status: TabType) => {
    return reservations.filter((r) => r.statut === status).length;
  };

  const openModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-white via-white to-canva-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-canva-darkblue mb-2">
            Gestion des Réservations
          </h1>
          <p className="text-custom-green2">
            Gérez les demandes de réservation de la salle polyvalente
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon;
                const count = getTabCount(status as TabType);
                return (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status as TabType)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === status
                        ? "border-custom-green text-custom-green"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                    {count > 0 && (
                      <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune réservation{" "}
                  {statusConfig[activeTab].label.toLowerCase()}
                </h3>
                <p className="text-gray-500">
                  Les réservations apparaîtront ici une fois créées.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredReservations.map((reservation) => {
                  const StatusIcon = statusConfig[reservation.statut].icon;
                  return (
                    <div
                      key={reservation.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <h3 className="text-lg font-semibold text-canva-darkblue">
                              {reservation.prenom} {reservation.nom}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                statusConfig[reservation.statut].color
                              }`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[reservation.statut].label}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-custom-green" />
                              <span>
                                {new Date(
                                  reservation.dateReservation
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-custom-green" />
                              <span>
                                {reservation.heureDebut} -{" "}
                                {reservation.heureFin}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-custom-green" />
                              <span>
                                {reservation.nombrePersonnes} personnes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-custom-green" />
                              <span>{reservation.email}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Type:</strong>{" "}
                              {getTypeReservationLabel(
                                reservation.typeReservation
                              )}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              <strong>Description:</strong>{" "}
                              {reservation.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => openModal(reservation)}
                            className="p-2 text-gray-400 hover:text-custom-green transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {reservation.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() =>
                                  updateReservationStatus(
                                    reservation.id,
                                    "validee"
                                  )
                                }
                                className="p-2 text-green-600 hover:text-green-800 transition-colors"
                                title="Valider la réservation"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelReservation(reservation)
                                }
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                title="Annuler la réservation"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal de détails */}
        {showModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-canva-darkblue">
                    Détails de la réservation
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.prenom} {selectedReservation.nom}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusConfig[selectedReservation.statut].color
                      }`}
                    >
                      {statusConfig[selectedReservation.statut].label}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.telephone}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedReservation.dateReservation
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure début
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.heureDebut}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure fin
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.heureFin}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'événement
                    </label>
                    <p className="text-sm text-gray-900">
                      {getTypeReservationLabel(
                        selectedReservation.typeReservation
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de personnes
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReservation.nombrePersonnes}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedReservation.description}
                  </p>
                </div>

                {selectedReservation.besoinsSpecifiques && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Besoins spécifiques
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedReservation.besoinsSpecifiques}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <strong>Créé le:</strong>{" "}
                    {new Date(selectedReservation.createdAt).toLocaleString(
                      "fr-FR"
                    )}
                  </div>
                  <div>
                    <strong>Modifié le:</strong>{" "}
                    {new Date(selectedReservation.updatedAt).toLocaleString(
                      "fr-FR"
                    )}
                  </div>
                </div>
              </div>

              {selectedReservation.statut === "en_attente" && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        handleCancelReservation(selectedReservation);
                        closeModal();
                      }}
                      className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Annuler la réservation
                    </button>
                    <button
                      onClick={() => {
                        updateReservationStatus(
                          selectedReservation.id,
                          "validee"
                        );
                        closeModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                    >
                      Valider la réservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal d'annulation avec commentaire */}
      {showCancelModal && reservationToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Annuler la réservation
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Réservation de{" "}
                <strong>
                  {reservationToCancel.prenom} {reservationToCancel.nom}
                </strong>
              </p>
              <p className="text-sm text-gray-600">
                Le{" "}
                {new Date(
                  reservationToCancel.dateReservation
                ).toLocaleDateString("fr-FR")}
                de {reservationToCancel.heureDebut} à{" "}
                {reservationToCancel.heureFin}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif d'annulation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                placeholder="Veuillez expliquer le motif de l'annulation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setReservationToCancel(null);
                  setCancelComment("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmCancelReservation}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationAdmin;
