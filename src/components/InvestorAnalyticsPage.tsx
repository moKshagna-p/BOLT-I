import React, { useEffect, useState } from "react";

interface Investment {
  name: string;
  [key: string]: any;
}

const InvestorAnalyticsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const response = await fetch("http://localhost:3001/api/user/investments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch investments");
        const data = await response.json();
        setInvestments(data.investments || []);
      } catch (err: any) {
        setError(err.message || "Error fetching investments");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading investments...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2 className="text-2xl font-bold mb-4">Investor Analytics</h2>
      {investments.length === 0 ? (
        <div>
          <p className="mb-4">No investments yet.</p>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Investments</h3>
          <ul className="list-disc list-inside">
            {investments.map((inv, idx) => (
              <li key={idx} className="mb-1">{inv.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InvestorAnalyticsPage; 