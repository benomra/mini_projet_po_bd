import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import Layout from "../components/Layout";
import api from "../utils/axiosConfig"; 
// Palette bleue
const BLUE = "#2563EB";
const BLUE_LIGHT = "#60A5FA";
const BLUE_DARK = "#1E40AF";
const COLORS = [
  "#BAE5F5", "#FDE1AC", "#CCEFBF"
];
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

function Dashboard() {
  const [participantsForYear, setParticipantsForYear] = useState(0);
  const [formationsByDomain, setFormationsByDomain] = useState({ labels: [], data: [] });
  const [budgetByDomain, setBudgetByDomain] = useState({ labels: [], data: [] });
  const [participantsByStructure, setParticipantsByStructure] = useState({ labels: [], data: [] });
  const [participantsByProfil, setParticipantsByProfil] = useState({ labels: [], data: [] });
  const [year, setYear] = useState(new Date().getFullYear());
  const [formationsByYear, setFormationsByYear] = useState(0);
  const [budgetForYear, setBudgetForYear] = useState(0);
  const [budgetGrowth, setBudgetGrowth] = useState({ years: [], data: [] });

  useEffect(() => {
    api.get("http://localhost:8081/api/statistics/formations-by-domain")
      .then(res => setFormationsByDomain({
        labels: Object.keys(res.data),
        data: Object.values(res.data)
      }));

    api.get("http://localhost:8081/api/statistics/budget-by-domain")
      .then(res => setBudgetByDomain({
        labels: Object.keys(res.data),
        data: Object.values(res.data)
      }));

    api.get("http://localhost:8081/api/statistics/participants-by-structure")
      .then(res => setParticipantsByStructure({
        labels: Object.keys(res.data),
        data: Object.values(res.data)
      }));

    api.get("http://localhost:8081/api/statistics/participants-by-profil")
      .then(res => setParticipantsByProfil({
        labels: Object.keys(res.data),
        data: Object.values(res.data)
      }));

    api.get("http://localhost:8081/api/statistics/budget-by-year/all")
      .then(res => {
        const years = Object.keys(res.data).sort();
        const data = years.map(y => res.data[y]);
        setBudgetGrowth({ years, data });
      });
  }, []);

  useEffect(() => {
    api.get(`http://localhost:8081/api/statistics/formations-by-year?annee=${year}`)
      .then(res => setFormationsByYear(res.data));
    api.get(`http://localhost:8081/api/statistics/budget-by-year?annee=${year}`)
      .then(res => setBudgetForYear(res.data));
    api.get(`http://localhost:8081/api/statistics/participants-by-year?annee=${year}`)
      .then(res => setParticipantsForYear(res.data));
  }, [year]);

  return ( 
    <div>
      
  <Layout title="Statistiques">
      <h2 style={{ color: BLUE_DARK, marginBottom: 30 }}>Tableau de bord des statistiques</h2>
      <div style={{
        display: "flex",
        gap: "40px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <div style={{
          width: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow: `0 2px 8px ${BLUE}22`,
          padding: 20
        }}>
          <h3 style={{ color: BLUE_DARK }}>Formations par domaine</h3>
          <Bar
            data={{
              labels: formationsByDomain.labels,
              datasets: [{
                label: "Formations",
                data: formationsByDomain.data,
                backgroundColor: BLUE_LIGHT,
                borderColor: BLUE,
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: BLUE_DARK } },
                y: { ticks: { color: BLUE_DARK } }
              }
            }}
          />
        </div>
        <div style={{
          width: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow: `0 2px 8px ${BLUE}22`,
          padding: 20
        }}>
          <h3 style={{ color: BLUE_DARK }}>Budget par domaine</h3>
          <Pie
            data={{
              labels: budgetByDomain.labels,
              datasets: [{
                label: "Budget",
                data: budgetByDomain.data,
                backgroundColor: COLORS,
                borderColor: "#fff",
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom", labels: { color: BLUE_DARK } } }
            }}
          />
        </div>
        <div style={{
          width: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow:` 0 2px 8px ${BLUE}22`,
          padding: 20
        }}>
          <h3 style={{ color: BLUE_DARK }}>Participants par structure</h3>
          <Doughnut
            data={{
              labels: participantsByStructure.labels,
              datasets: [{
                label: "Participants",
                data: participantsByStructure.data,
                backgroundColor: COLORS,
                borderColor: "#fff",
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom", labels: { color: BLUE_DARK } } }
            }}
          />
        </div>
        <div style={{
          width: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow:` 0 2px 8px ${BLUE}22`,
          padding: 20
        }}>
          <h3 style={{ color: BLUE_DARK }}>Participants par profil</h3>
          <Pie
            data={{
              labels: participantsByProfil.labels,
              datasets: [{
                label: "Participants",
                data: participantsByProfil.data,
                backgroundColor: COLORS,
                borderColor: "#fff",
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom", labels: { color: BLUE_DARK } } }
            }}
          />
        </div>
        <div style={{
          width: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow: `0 2px 8px ${BLUE}22`,
          padding: 20
        }}>
          <h3 style={{ color: BLUE_DARK }}>Croissance du gain (budget) par année</h3>
          <Line
            data={{
              labels: budgetGrowth.years,
              datasets: [{
                label: "Budget total (DT)",
                data: budgetGrowth.data,
                fill: true,
                borderColor: BLUE,
                backgroundColor: BLUE_LIGHT,
                tension: 0.3,
                pointBackgroundColor: BLUE_DARK,
                pointBorderColor: "#fff"
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, labels: { color: BLUE_DARK } },
                title: { display: false }
              },
              scales: {
                x: { ticks: { color: BLUE_DARK } },
                y: { ticks: { color: BLUE_DARK } }
              }
            }}
          />
        </div>
      </div>
      {/* Recherche année + stats pour l'année */}
      <div style={{
        marginTop: 40,
        background: "#fff",
        borderRadius: 10,
        boxShadow: `0 2px 8px ${BLUE}22`,
        padding: 20,
        maxWidth: 500,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Année :</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            min="2000"
            max="2100"
            style={{
              border:` 1px solid ${BLUE}`,
              borderRadius: 5,
              padding: "5px 10px",
              color: BLUE_DARK,
              fontWeight: "bold"
            }}
          />
        </div>
        <h3 style={{ color: BLUE_DARK }}>Statistiques pour l'année {year}</h3>
        <p><b>Nombre de formations :</b> <span style={{ color: BLUE }}>{formationsByYear}</span></p>
        <p><b>Nombre de participants :</b> <span style={{ color: BLUE }}>{participantsForYear}</span></p>
        <p><b>Budget total :</b> <span style={{ color: BLUE }}>{budgetForYear} DT</span></p>
      </div>
    </Layout>
    </div>
  );
 
}

export default Dashboard;