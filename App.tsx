import React from "react";

type Team = {
  id: number;
  name: string;
  cash: number;
  points: number;
};

const initialTeams: Team[] = [
  { id: 1, name: "Team 1", cash: 100_000, points: 0 },
  { id: 2, name: "Team 2", cash: 100_000, points: 0 },
  { id: 3, name: "Team 3", cash: 100_000, points: 0 },
  { id: 4, name: "Team 4", cash: 100_000, points: 0 },
];

function App() {
  const [teams, setTeams] = React.useState<Team[]>(initialTeams);

  const addPoints = (teamId: number, deltaPoints: number, deltaCash: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, points: t.points + deltaPoints, cash: t.cash + deltaCash }
          : t
      )
    );
  };

  const sorted = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Entrepreneurship Sprint</h1>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Rangliste */}
        <div style={{ minWidth: 260 }}>
          <h2>Rangliste</h2>
          <ol>
            {sorted.map((t) => (
              <li key={t.id} style={{ marginBottom: "0.5rem" }}>
                <strong>{t.name}</strong> – {t.points} P / {t.cash.toLocaleString("de-DE")} €
              </li>
            ))}
          </ol>
        </div>

        {/* Steuerung */}
        <div style={{ flex: 1 }}>
          <h2>Aktionen</h2>
          <p>Wähle ein Team und vergib Punkte / Cash, z. B. nach jeder Entscheidungsrunde.</p>

          {teams.map((t) => (
            <div
              key={t.id}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: 8,
                border: "1px solid #1f2937",
              }}
            >
              <strong>{t.name}</strong>
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                <button onClick={() => addPoints(t.id, +10, +20_000)}>+10 P / +20k €</button>
                <button onClick={() => addPoints(t.id, -5, -10_000)}>-5 P / -10k €</button>
                <button onClick={() => addPoints(t.id, 0, -20_000)}>Strafzahlung -20k €</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
