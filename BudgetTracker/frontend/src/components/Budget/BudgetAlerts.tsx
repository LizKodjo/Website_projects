import { useState, type FC } from "react";
import type { Budget, Transaction } from "../../types";
import {
  checkBudgetAlerts,
  getAlertColor,
  getAlertIcon,
  type BudgetAlert,
} from "../../utils/alerts";

interface BudgetAlertsProps {
  budgets: Budget[];
  transactions: Transaction[];
  onDismiss?: (alert: BudgetAlert) => void;
}

const BudgetAlerts: FC<BudgetAlertsProps> = ({
  budgets,
  transactions,
  onDismiss,
}) => {
  const alerts = checkBudgetAlerts(budgets, transactions);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.includes(`${alert.category}-${alert.type}`)
  );

  const handleDismiss = (alert: BudgetAlert) => {
    const alertKey = `${alert.category}-${alert.type}`;
    setDismissedAlerts((prev) => [...prev, alertKey]);
    onDismiss?.(alert);
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Budget Alerts</h3>
      {visibleAlerts.map((alert, index) => (
        <div
          key={`${alert.category}-${alert.type}-${index}`}
          className={`p-4 rounded-lg border-l-4 bg-${getAlertColor(
            alert.type
          )}-50 border-${getAlertColor(alert.type)}-500`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-xl">{getAlertIcon(alert.type)}</span>
              <div>
                <p
                  className={`font-semibold text-${getAlertColor(
                    alert.type
                  )}-800`}
                >
                  {alert.message}
                </p>
                <p
                  className={`text-sm text-${getAlertColor(
                    alert.type
                  )}-600 mt-1`}
                >
                  Spent £{alert.currentSpending.toFixed(2)} of £
                  {alert.budgetLimit.toFixed(2)}({Math.round(alert.percentage)}
                  %)
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full bg-${getAlertColor(
                      alert.type
                    )}-500`}
                    style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(alert)}
              className={`text-${getAlertColor(
                alert.type
              )}-500 hover:text-${getAlertColor(alert.type)}-700`}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlerts;
