export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission == "granted") {
      new Notification(title, options);
    }
  }

  static showBudgetAlert(
    category: string,
    percentage: number,
    spent: number,
    limit: number
  ) {
    let message = "";
    if (percentage >= 100) {
      message = `You've exceeded your ${category} budget!`;
    } else if (percentage >= 90) {
      message = `You're close to exceeding your ${category} budget!`;
    } else if (percentage >= 75) {
      message = `You've used ${Math.round(
        percentage
      )}% of your ${category} budget.`;
    }

    if (message) {
      this.showNotification("Budget Alert", {
        body: `${message}\nSpent: £${spent.toFixed(2)} / £${limit.toFixed(2)}`,
        icon: "/money-icon.png",
        tag: `budget-alert-${category}`,
      });
    }
  }
}
