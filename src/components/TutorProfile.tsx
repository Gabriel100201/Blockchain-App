import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const TutorProfile: React.FC = () => {
  const { state } = useApp();
  const [profile, setProfile] = useState({
    name: "Dr. María González",
    bio: "Profesora de matemáticas con más de 10 años de experiencia en educación superior.",
    education: "PhD en Matemáticas - Universidad de Buenos Aires",
    experience: "10+ años",
    subjects: ["Matemáticas", "Cálculo", "Álgebra", "Geometría"],
    hourlyRate: 15,
    isAvailable: true,
  });

  const [newSubject, setNewSubject] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSubject = () => {
    if (newSubject.trim() && !profile.subjects.includes(newSubject.trim())) {
      setProfile({
        ...profile,
        subjects: [...profile.subjects, newSubject.trim()],
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setProfile({
      ...profile,
      subjects: profile.subjects.filter(
        (subject) => subject !== subjectToRemove
      ),
    });
  };

  const handleSaveProfile = () => {
    // Aquí se conectaría con el smart contract para actualizar el perfil
    console.log("Guardando perfil:", profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Información Personal */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Perfil del Tutor
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                disabled={!isEditing}
                rows={4}
                className="input-field"
                placeholder="Describe tu experiencia y especialidades..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educación
              </label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="text"
                value={profile.experience}
                onChange={(e) =>
                  setProfile({ ...profile, experience: e.target.value })
                }
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>

          {/* Configuración de Tutoría */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarifa por Hora (MTM)
              </label>
              <input
                type="number"
                value={profile.hourlyRate}
                onChange={(e) =>
                  setProfile({ ...profile, hourlyRate: Number(e.target.value) })
                }
                disabled={!isEditing}
                min="1"
                max="100"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Disponibilidad
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={profile.isAvailable}
                  onChange={(e) =>
                    setProfile({ ...profile, isAvailable: e.target.checked })
                  }
                  disabled={!isEditing}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Disponible para tutorías
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materias que Enseñas
              </label>
              <div className="space-y-2">
                {profile.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">{subject}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Nueva materia"
                      className="input-field flex-1"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddSubject()
                      }
                    />
                    <button
                      onClick={handleAddSubject}
                      className="px-3 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleSaveProfile} className="btn-primary">
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* Estadísticas del Tutor */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Estadísticas
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {
                state.tutoringHistory.filter(
                  (s) =>
                    s.tutorAddress.toLowerCase() ===
                    state.wallet.address?.toLowerCase()
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Sesiones Totales</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {
                state.tutoringHistory.filter(
                  (s) =>
                    s.tutorAddress.toLowerCase() ===
                      state.wallet.address?.toLowerCase() &&
                    s.status === "completed"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Sesiones Completadas</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {
                state.tutoringHistory.filter(
                  (s) =>
                    s.tutorAddress.toLowerCase() ===
                      state.wallet.address?.toLowerCase() &&
                    s.status === "pending"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Sesiones Pendientes</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {state.tutoringHistory
                .filter(
                  (s) =>
                    s.tutorAddress.toLowerCase() ===
                      state.wallet.address?.toLowerCase() &&
                    s.status === "completed"
                )
                .reduce((sum, s) => sum + s.tokensPaid, 0)}
            </div>
            <div className="text-sm text-gray-600">MTM Ganados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
