import { useState, useEffect } from "react";
import axios from "axios";

interface WalletInfo {
  address: string;
  balance: number;
  is_scam: boolean;
  is_verified: boolean;
  is_suspended: boolean;
}

interface ActionDetails {
  opcode: string;
  source: string;
  value: number;
}

interface Action {
  end_utime: number;
  success: boolean;
  details: ActionDetails;
  paid: boolean;
}

function AdminPanel() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [lastActions, setLastActions] = useState<Action[]>([]);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3002/wallet-info");
        console.log(response.data.data);
        setWalletInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching wallet info:", error);
      }
    };

    fetchWalletInfo();

    const fetchLastActions = async () => {
      try {
        const response = await axios.get("http://localhost:3002/last-actions");
        console.log(response.data.actions);
        setLastActions(response.data.actions);
      } catch (error) {
        console.error("Error fetching last actions:", error);
      }
    };

    fetchLastActions();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString(); // Convert to readable date
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {walletInfo ? (
        <div className="wallet-info">
          <p>
            <strong>Address:</strong> {walletInfo?.address ?? "N/A"}
          </p>
          <p>
            <strong>Balance:</strong> {walletInfo.balance} TON
          </p>
          <p>
            <strong>Scam Status:</strong>{" "}
            {walletInfo.is_scam ? "🚨 Yes" : "✅ No"}
          </p>
          <p>
            <strong>Verified:</strong>{" "}
            {walletInfo.is_verified ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Suspended:</strong>{" "}
            {walletInfo.is_suspended ? "🚨 Yes" : "✅ No"}
          </p>
        </div>
      ) : (
        <p>Loading wallet info...</p>
      )}

      <div>
        <h2>Last Actions</h2>
        {lastActions.length > 0 ? (
          <ul>
            {lastActions.map((action, index) => (
              <li key={index} className="action-item">
                <p>
                  <b>End Time:</b> {formatDate(action.end_utime)}
                </p>
                <p>
                  <b>Success:</b> {action.success ? "✅ Yes" : "❌ No"}
                </p>
                <p>
                  <b>Opcode:</b>{" "}
                  {action.details?.opcode == "0x5ae8724b"
                    ? "Buy Level"
                    : action.details?.opcode == "0x2ba86c9a"
                    ? "Payback"
                    : "Unknown"}
                </p>
                <p>
                  <b>Source:</b> {action.details?.source}
                </p>
                <p>
                  <b>Value:</b> {action.details?.value} TON
                </p>
                <p>
                  <b>Paid:</b> {action.paid ? "✅ Yes" : "❌ No"}
                </p>
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent actions found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
