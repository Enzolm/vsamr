import Navbar from "@/composant/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router"; // Pour récupérer l'ID de l'association depuis l'URL
import { config } from "@/config/config"; // Assurez-vous que le chemin est correct
import { useState } from "react";
import { MailIcon, PhoneCallIcon } from "lucide-react";

interface Association {
  id: number;
  logo_url: string;
  nom: string;
  description: string;
  email: string;
  telephone: string;
  site_externe: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
}

export default function AssociationInfo() {
  const { id } = useParams<{ id: string }>(); // Récupérer l'ID de l'URL
  const [associationInfo, setAssociationInfo] = useState<Association | null>(null);

  const getAssosByID = async (id: number) => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/associations/${id}`);

      console.log("Association data:", response.data);
      setAssociationInfo(response.data);
    } catch (error) {
      console.error("Error fetching association data:", error);
      throw error;
    }
  };

  if (!id) {
    console.error("Association ID is not provided in the URL");
    return <div>Error: Association ID is missing</div>;
  }
  useEffect(() => {
    getAssosByID(Number(id));
  }, [id]);

  return (
    <div className="bg-cgreen1">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 py-12 px-4">
        <div className="max-w-7xl flex">
          {/* Header */}
          <div className="flex p-6 mb-8 w-full max-w-3xl mx-auto">
            <img
              src={associationInfo?.logo_url}
              alt={associationInfo?.nom}
              className="rounded-4xl mx-auto mb-4 max-h-50
            "
            />
            <div className="text-left mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{associationInfo?.nom}</h1>
              <p className="text-gray-600">{associationInfo?.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Ici, vous pouvez ajouter les détails de l'association */}
            <p className="text-center">Nous contacter ?</p>

            <div className="mt-4 flex flex-wrap">
              <MailIcon className="inline-block mr-2 text-cgreen" />
              <a href={`mailto:${associationInfo?.email}`} className="">
                {associationInfo?.email}
              </a>
            </div>
            <div className="mt-4 flex flex-wrap">
              <PhoneCallIcon className="inline-block mr-2 text-cgreen" />
              <span className="inline-block mr-2 text-cgreen">Téléphone :</span>
              <a href={`tel:${associationInfo?.telephone}`} className="">
                {associationInfo?.telephone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
